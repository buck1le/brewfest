use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use entities::{*};
use serde::Deserialize;

use std::sync::Arc;

use entities::sea_orm::*;

pub struct Query;

pub async fn index(Extension(db): Extension<Arc<DatabaseConnection>>) -> impl IntoResponse {
    let database_connection = &*db;

    let vendors = vendors::Entity::find()
        .all(database_connection)
        .await
        .unwrap();

    Json(vendors)
}


#[derive(Deserialize)]
pub struct Location {
    latitude: f64,
    longitude: f64,
}

#[derive(Deserialize)]
pub struct VendorCreateRequest {
    name: String,
    email: String,
    phone: String,
    location: Location,
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
        latitude: Set(payload.location.latitude),
        longitude: Set(payload.location.longitude),
        event_id: Set(event_id),
        ..Default::default() // sets the other fields such as ID
    };

    // Insert the new item into the database and handle potential errors
    match new_item.insert(database_connection).await {
        Ok(inserted_item) => Ok(Json(inserted_item)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to insert item: {}", e),
        )),
    }
}
