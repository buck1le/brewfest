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

use entities::{sea_orm::*, vendor};

use crate::common::events::load_vendor;
use crate::handlers::response::Response;

pub async fn create(
    Extension(aws_s3_client): Extension<Arc<S3>>,
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path((event_id, vendor_id)): Path<(i32, i32)>,
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

            let vendor = match load_vendor(event_id, vendor_id, &db).await {
                Ok(vendor) => vendor,
                Err(e) => return e.into_response(),
            };

            let mut vendor: vendor::ActiveModel = vendor.into();

            vendor.thumbnail = Set(Some(s3_key));
            match vendor.update(&*db).await {
                Ok(_) => {
                    return Response::success("Successfully updated the vendor").into_response()
                }
                Err(e) => {
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to update the vendor: {}", e),
                    )
                        .into_response()
                }
            }
        }
    }

    (StatusCode::BAD_REQUEST, "Invalid field name").into_response()
}
