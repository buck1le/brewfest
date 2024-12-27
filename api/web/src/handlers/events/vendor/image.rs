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

use crate::common::events::load_event;
use crate::handlers::response::Response;
use crate::presenters::events::vendors::images::Presenter as ImagePresenter;

use entities::{vendors, sea_orm::*};

use entities::vendor_images::Entity as VendorImages;
use entities::vendors::Entity as Vendors;

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

            match VendorImages::create_vendor_image(&db, event_id, vendor_id, &s3_key, "")
                .await
            {
                Ok(_) => info!("Successfully created the vendor image."),
                Err(e) => {
                    return (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed to create the vendor image: {}", e),
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
    Path((event_id, vendor_id)): Path<(i32, i32)>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    let event = load_event(event_id, &db).await?;

    if let Some(event) = event {
        let vendor = event
            .find_related(Vendors)
            .filter(vendors::Column::Id.eq(vendor_id))
            .one(database_connection)
            .await
            .unwrap();

        if let Some(vendor) = vendor {
            let images = vendor
                .find_related(VendorImages)
                .all(database_connection)
                .await
                .unwrap();

            ImagePresenter::new(images).render()
        } else {
            Err((StatusCode::NOT_FOUND, "Vendor not found".to_string()))
        }
    } else {
        Err((StatusCode::NOT_FOUND, "Event not found".to_string()))
    }
}
