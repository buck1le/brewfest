use axum::http::StatusCode;
use axum::{
    extract::{Multipart, Path},
    response::IntoResponse,
    Extension,
};
use entities::schedule_images::Entity as ScheduleImage;
use images::{upload, S3};
use std::sync::Arc;
use tracing::info;
use uuid::Uuid;

use crate::handlers::response::Response;
use crate::presenters::events::schedule::images::Presenter as ImagePresenter;

use entities::{events, schedule_items, sea_orm::*};

use entities::schedule_images::Entity as ScheduleImages;
use entities::schedule_items::Entity as ScheduleItems;

async fn load_event(
    event_id: i32,
    db: &DatabaseConnection,
) -> Result<Option<events::Model>, (StatusCode, String)> {
    events::Entity::find_by_id(event_id)
        .one(db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database query error: {}", e),
            )
        })
}

pub async fn create(
    Extension(aws_s3_client): Extension<Arc<S3>>,
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path((event_id, schedule_item_id)): Path<(i32, i32)>,
    mut multipart: Multipart,
) -> impl IntoResponse {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        if let "file" = name.as_str() {
            let content_type = field.content_type().map(|ct| ct.to_string());

            let file_extension = match content_type {
                Some(content_type) => content_type.split('/').last().unwrap().to_string(),
                None => {
                    return (StatusCode::BAD_REQUEST, "Failed to get the file extension")
                        .into_response()
                }
            };

            let object_name = format!("{}.{}", Uuid::new_v4(), file_extension);

            let file_data = match field.bytes().await {
                Ok(data) => data.to_vec(),
                Err(e) => {
                    return (
                        StatusCode::BAD_REQUEST,
                        format!("Failed to read file data: {}", e),
                    )
                        .into_response()
                }
            };


            let s3_key = match upload(file_data, &object_name, &*aws_s3_client).await {
                Ok(key) => key,
                Err(e) => {
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to upload the image: {}", e),
                    )
                        .into_response()
                }
            };

            info!("Successfully uploaded the image to S3 with key: {}", s3_key);

            match ScheduleImage::create_schedule_image(&db, event_id, schedule_item_id, &s3_key, "")
                .await
            {
                Ok(_) => info!("Successfully created the schedule image."),
                Err(e) => {
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to create the schedule image: {}", e),
                    )
                        .into_response()
                }
            }
        } else {
            return (StatusCode::BAD_REQUEST, "Invalid field name").into_response();
        }
    }

    Response::success("Successfully uploaded the image").into_response()
}

pub async fn index(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path((event_id, schedule_item_id)): Path<(i32, i32)>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    let event = load_event(event_id, &db).await?;

    if let Some(event) = event {
        let item = event
            .find_related(ScheduleItems)
            .filter(schedule_items::Column::Id.eq(schedule_item_id))
            .one(database_connection)
            .await
            .unwrap();

        if let Some(item) = item {
            let images = item
                .find_related(ScheduleImages)
                .all(database_connection)
                .await
                .unwrap();

            ImagePresenter::new(images).render()
        } else {
            Err((StatusCode::NOT_FOUND, "Event not found".to_string()))
        }
    } else {
        Err((StatusCode::NOT_FOUND, "Event not found".to_string()))
    }
}
