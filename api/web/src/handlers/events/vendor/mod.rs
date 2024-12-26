use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use entities::*;
use serde::Deserialize;

use std::sync::Arc;

use entities::sea_orm::*;
use entities::vendors::Entity as Vendors;

use crate::auth::ExtractApiKey;
use crate::common::events::load_event;
use crate::presenters::events::vendors::{Partial as VendorPartial, Presenter as VendorPresenter};

pub mod image;
pub mod thumbnail;

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
#[serde(rename_all = "camelCase")]
pub struct VendorCreateRequest {
    name: String,
    email: String,
    phone: String,
    operating_out_of: String,
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

    let new_item = vendors::ActiveModel {
        name: Set(payload.name),
        email: Set(payload.email),
        phone: Set(payload.phone),
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
        Ok(inserted_item) => Ok(Json(VendorPartial::new(&inserted_item).render())),
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

    let event = load_event(event_id, &db).await.unwrap();

    if let Some(event) = event {
        let item = event
            .find_related(Vendors)
            .filter(vendors::Column::Id.eq(vendor_id))
            .one(database_connection)
            .await
            .unwrap();

        if let Some(item) = item {
            Ok(Json(VendorPartial::new(&item).render()).into_response())
        } else {
            Err((StatusCode::NOT_FOUND, "Schedule item not found".to_string()))
        }
    } else {
        Err((StatusCode::NOT_FOUND, "Event not found".to_string()))
    }
}
