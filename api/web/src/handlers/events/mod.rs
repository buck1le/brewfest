use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use chrono::NaiveDate;
use serde::Deserialize;
use std::sync::Arc;

use entities::sea_orm::*;
use entities::vendor_inventory_items::Entity as VendorInventoryItems;
use entities::vendors::Entity as Vendors;
use entities::*;

use crate::{
    auth::ExtractApiKey,
    common::events::load_event,
    presenters::events::{
        vendors::inventory::Presenter as VendorInventoryItemsPresenter, Coordinates, Partial,
        Partial as EventPartial, Presenter as IndexPresenter,
    },
};

pub mod schedule;
pub mod thumbnail;
pub mod vendor;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EventCreateRequest {
    name: String,
    description: String,
    coordinates: Coordinates,
    start_date: String,
    end_date: String,
}

fn parse_date(date_str: &str) -> Result<NaiveDate, (StatusCode, String)> {
    NaiveDate::parse_from_str(date_str, "%Y-%m-%d")
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("Invalid date: {}", e)))
}

#[axum::debug_handler]
pub async fn create(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    ExtractApiKey(_api_key): ExtractApiKey,
    Json(payload): Json<EventCreateRequest>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let start_date_time = parse_date(&payload.start_date)?;
    let end_date_time = parse_date(&payload.end_date)?;

    let new_item = events::ActiveModel {
        name: Set(payload.name.clone()),
        description: Set(payload.description.clone()),
        start_date: Set(start_date_time),
        latitude: Set(payload.coordinates.latitude),
        longitude: Set(payload.coordinates.longitude),
        end_date: Set(end_date_time),
        ..Default::default() // sets the other fields such as ID
    };

    match new_item.insert(database_connection).await {
        Ok(inserted_item) => Ok(Json(Partial::new(&inserted_item).render())),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to insert item: {}", e),
        )),
    }
}

pub async fn show(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(event_id): Path<i32>,
) -> impl IntoResponse {
    match load_event(event_id, &db).await {
        Ok(event) => Json(EventPartial::new(&event).render()).into_response(),
        Err((status, msg)) => (status, msg).into_response(),
    }
}

pub async fn index(Extension(db): Extension<Arc<DatabaseConnection>>) -> impl IntoResponse {
    let database_connection = &*db;

    let events = events::Entity::find()
        .all(database_connection)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database query error: {}", e),
            )
        })?;

    IndexPresenter::new(events).render()
}

#[derive(Deserialize)]
pub struct VendorType {
    vendor_type: Option<String>,
}

pub async fn inventory(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Query(VendorType { vendor_type }): Query<VendorType>,
    Path(event_id): Path<i32>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let event = load_event(event_id, &db).await?;

    let vendors_and_events = event
        .find_related(Vendors)
        .filter(vendors::Column::VendorType.eq(vendor_type))
        .find_with_related(VendorInventoryItems)
        .all(database_connection)
        .await
        .unwrap();

    let inventory = vendors_and_events
        .into_iter()
        .flat_map(|(_, inventory_items)| inventory_items)
        .collect::<Vec<_>>();

    VendorInventoryItemsPresenter::new(&inventory).render()
}
