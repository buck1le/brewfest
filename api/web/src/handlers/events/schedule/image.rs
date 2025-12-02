use axum::http::StatusCode;
use axum::{
    extract::{Multipart, Path},
    response::IntoResponse,
    Extension,
};
use entities::schedule_image::Entity as ScheduleImage;
use images::{upload, S3};
use std::sync::Arc;
use tracing::info;
use uuid::Uuid;

use crate::common::events::load_schedule_item;
use crate::handlers::response::Response;
use crate::presenters::events::schedule::images::Presenter as ImagePresenter;

use entities::sea_orm::*;

use entities::schedule_image::Entity as ScheduleImages;

pub async fn create(
    Extension(aws_s3_client): Extension<Arc<S3>>,
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path((event_id, schedule_item_id)): Path<(i32, i32)>,
    mut multipart: Multipart,
) -> impl IntoResponse {
    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        if let "file" = name.as_str() {
            let object_name = Uuid::new_v4().to_string();

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

    let schedule_item = load_schedule_item(event_id, schedule_item_id, &db).await?;

    let images = schedule_item
        .find_related(ScheduleImages)
        .all(database_connection)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch images: {}", e),
            )
        })?;

    ImagePresenter::new(images).render()
}
