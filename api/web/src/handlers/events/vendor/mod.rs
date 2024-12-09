use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use entities::*;
use serde::Deserialize;

use std::sync::Arc;

use entities::sea_orm::*;
use entities::vendors::Entity as Vendors;

use crate::common::events::load_event;
use crate::presenters::events::vendors::{Partial, Presenter as VendorPresenter};

pub struct Query;

pub async fn index(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(event_id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    let event = load_event(event_id, &db).await?;

    if let Some(event) = event {
        let vendors = event.find_related(Vendors).all(database_connection).await;

        match vendors {
            Ok(vendors) => VendorPresenter::new(&vendors).render(),
            Err(e) => Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch vendors: {}", e),
            )),
        }
    } else {
        Err((StatusCode::NOT_FOUND, "Event not found".to_string()))
    }
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
pub struct VendorCreateRequest {
    name: String,
    email: String,
    phone: String,
    coordinates: Location,
    category: VendorCategory,
}

pub async fn create(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(event_id): Path<i32>,
    Json(payload): Json<VendorCreateRequest>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let new_item = vendors::ActiveModel {
        name: Set(payload.name),
        email: Set(payload.email),
        phone: Set(payload.phone),
        latitude: Set(payload.coordinates.latitude),
        longitude: Set(payload.coordinates.longitude),
        category: Set(payload.category.into()),
        event_id: Set(event_id),
        ..Default::default() // sets the other fields such as ID
    };

    // Insert the new item into the database and handle potential errors
    match new_item.insert(database_connection).await {
        Ok(inserted_item) => Ok(Json(Partial::new(&inserted_item).render())),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to insert item: {}", e),
        )),
    }
}
