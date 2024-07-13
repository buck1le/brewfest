use aws_sdk_s3::Client as S3Client;
use entities::schedule_images::Entity as ScheduleImage;
use axum::http::StatusCode;
use axum::{
    extract::{Multipart, Path},
    response::IntoResponse,
    Extension,
};
use tracing::info;
use std::env;
use std::sync::Arc;
use uuid::Uuid;

use crate::handlers::response::Response;
use crate::utils::s3_uploader::S3Uploader;
use entities::sea_orm::*;

pub async fn create(
    Extension(aws_s3_client): Extension<Arc<S3Client>>,
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(id): Path<i32>,
    mut multipart: Multipart,
) -> impl IntoResponse {
    let bucket_name = env::var("BUCKET_NAME").expect("BUCKET_NAME must be set");
    let folder_name = env::var("FOLDER_NAME").expect("FOLDER_NAME must be set");

    let aws_s3_client = S3Uploader::new(aws_s3_client, bucket_name, folder_name);

    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        if let "file" = name.as_str() {
            let content_type = field.content_type().map(|ct| ct.to_string());

            let file_extension = match content_type {
                Some(content_type) => content_type.split('/').last().unwrap().to_string(),
                None => return (StatusCode::BAD_REQUEST, "Failed to get the file extension").into_response(),
            };

            let object_name = format!("{}.{}", Uuid::new_v4(), file_extension);

            let file_data = match field.bytes().await {
                Ok(data) => data.to_vec(),
                Err(e) => return (StatusCode::BAD_REQUEST, format!("Failed to read file data: {}", e)).into_response(),
            };

            let s3_key = match aws_s3_client.upload(file_data, &object_name).await {
                Ok(key) => key,
                Err((status, message)) => {
                    return (status, message).into_response();
                }
            };

            match ScheduleImage::create_schedule_image(&db, id, &s3_key, "").await {
                Ok(_) => info!("Successfully created the schedule image."),
                Err(e) => return (StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to create the schedule image: {}", e)).into_response(),
            }
        }
    }
    Response::success("Successfully uploaded the image").into_response()
}
