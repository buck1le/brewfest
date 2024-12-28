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

use entities::{sea_orm::*, vendor_inventory_items};

use crate::common::events::load_vendor_inventory_item;
use crate::handlers::response::Response;

pub async fn create(
    Extension(aws_s3_client): Extension<Arc<S3>>,
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path((event_id, vendor_id, inventory_id)): Path<(i32, i32, i32)>,
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

            let inventory_item = match load_vendor_inventory_item(event_id, vendor_id, inventory_id, &db).await {
                Ok(inventory_item) => inventory_item,
                Err(e) => return e.into_response(),
            };

            let mut inventory_item: vendor_inventory_items::ActiveModel = inventory_item.into();

            inventory_item.thumbnail = Set(Some(s3_key));

            match inventory_item.update(&*db).await {
                Ok(_) => return Response::success("Successfully updated the inventory item with thumbnail.").into_response(),
                Err(e) => {
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to update the inventory item with thumbnail: {}", e),
                    )
                        .into_response()
                }
            };
        }
    }

    (StatusCode::BAD_REQUEST, "Invalid field name").into_response()
}
