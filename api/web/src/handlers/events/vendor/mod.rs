use axum::extract::Query;
use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use entities::*;
use serde::Deserialize;

use std::sync::Arc;

use entities::sea_orm::*;
use entities::vendor::Entity as Vendor;

use crate::auth::ExtractApiKey;
use crate::common::events::{load_event, load_vendor};
use crate::presenters::events::vendors::{Partial as VendorPartial, Presenter as VendorPresenter};

pub mod image;
pub mod inventory;
pub mod thumbnail;

#[derive(Deserialize)]
pub struct VendorType {
    vendor_type: Option<String>,
}

pub async fn index(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Query(vendor_type): Query<VendorType>,
    Path(event_id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    let event = load_event(event_id, &db).await?;

    let vendors = match vendor_type.vendor_type {
        Some(vendor_type) => {
            event
                .find_related(Vendor)
                .filter(vendor::Column::VendorType.eq(vendor_type))
                .all(database_connection)
                .await
        }
        None => event.find_related(Vendor).all(database_connection).await,
    };

    let vendors = vendors.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to fetch vendors: {}", e),
        )
    })?;

    let vendor_ids: Vec<i32> = vendors.iter().map(|v| v.id).collect();

    let all_images = entities::vendor_image::Entity::find()
        .filter(entities::vendor_image::Column::VendorId.is_in(vendor_ids))
        .all(database_connection)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch images: {}", e),
            )
        })?;

    // Group images by vendor_id
    let mut images_by_vendor: std::collections::HashMap<i32, Vec<entities::vendor_image::Model>> =
        std::collections::HashMap::new();

    for image in all_images {
        images_by_vendor
            .entry(image.vendor_id)
            .or_default()
            .push(image);
    }

    VendorPresenter::new(vendors, images_by_vendor).render()
}

#[derive(Deserialize)]
pub struct Location {
    latitude: f64,
    longitude: f64,
}

#[derive(Deserialize)]
enum VendorCategory {
    Food,
    Beverage,
    Merchandise,
    Service,
}

impl From<VendorCategory> for Option<String> {
    fn from(category: VendorCategory) -> Option<String> {
        Some(match category {
            VendorCategory::Food => "food".to_string(),
            VendorCategory::Beverage => "beverage".to_string(),
            VendorCategory::Merchandise => "merchandise".to_string(),
            VendorCategory::Service => "service".to_string(),
        })
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VendorCreateRequest {
    name: String,
    email: String,
    phone: String,
    operating_out_of: String,
    vendor_type: String,
    description: String,
    coordinates: Location,
    category: VendorCategory,
}

pub async fn create(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    ExtractApiKey(_api_key): ExtractApiKey,
    Path(event_id): Path<i32>,
    Json(payload): Json<VendorCreateRequest>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let new_item = vendor::ActiveModel {
        name: Set(payload.name),
        email: Set(payload.email),
        phone: Set(payload.phone),
        vendor_type: Set(Some(payload.vendor_type)),
        latitude: Set(payload.coordinates.latitude),
        longitude: Set(payload.coordinates.longitude),
        category: Set(payload.category.into()),
        operating_out_of: Set(payload.operating_out_of),
        description: Set(payload.description),
        event_id: Set(event_id),
        ..Default::default() // sets the other fields such as ID
    };

    // Insert the new item into the database and handle potential errors
    match new_item.insert(database_connection).await {
        Ok(inserted_item) => {
            // New vendor has no images yet
            let rendered = VendorPartial::new(inserted_item, vec![]).render();
            Ok(Json(rendered))
        }
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to insert item: {}", e),
        )),
    }
}

#[derive(Deserialize)]
pub struct ShowParams {
    event_id: i32,
    vendor_id: i32,
}

pub async fn show(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(ShowParams {
        event_id,
        vendor_id,
    }): Path<ShowParams>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    let vendor = load_vendor(event_id, vendor_id, &db).await?;

    // Load vendor images
    let vendor_images = entities::vendor_image::Entity::find()
        .filter(entities::vendor_image::Column::VendorId.eq(vendor_id))
        .all(database_connection)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch images: {}", e),
            )
        })?;

    let rendered = VendorPartial::new(vendor, vendor_images).render();

    Ok(Json(rendered).into_response())
}
