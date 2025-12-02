use axum::http::StatusCode;
use axum::{
    extract::{Multipart, Path},
    response::IntoResponse,
    Extension,
};
use images::{upload, S3};
use std::sync::Arc;
use tracing::info;
use uuid::Uuid;

use entities::schedule_item::{self, Entity as ScheduleItems};
use entities::sea_orm::*;

use crate::handlers::response::Response;

pub async fn create(
    Extension(aws_s3_client): Extension<Arc<S3>>,
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path((_event_id, schedule_item_id)): Path<(i32, i32)>,
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

            let schedule_item = match ScheduleItems::find_by_id(schedule_item_id).one(&*db).await.map_err(|e| {
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    format!("Failed to fetch vendor: {}", e),
                )
            }) {
                Ok(schedule_item) => schedule_item,
                Err(e) => return e.into_response(),
            };

            if let Some(schedule_item) = schedule_item {
                let mut schedule_item: schedule_item::ActiveModel = schedule_item.into();

                schedule_item.thumbnail = Set(Some(s3_key));
                match schedule_item.update(&*db).await.map_err(|e| {
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to update schedule_item: {}", e),
                    )
                }) {
                    Ok(_) => {
                        return Response::success("Successfully updated the schedule item").into_response()
                    }
                    Err(e) => return e.into_response(),
                }
            } else {
                return (StatusCode::NOT_FOUND, "Event not found").into_response();
            }
        }
    }

    (StatusCode::BAD_REQUEST, "Invalid field name").into_response()
}
