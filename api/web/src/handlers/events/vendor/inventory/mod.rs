pub mod thumbnail;

use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};

use serde::Deserialize;
use std::sync::Arc;

use crate::auth::ExtractApiKey;
use crate::common::events::load_vendor;
use crate::presenters::events::vendors::inventory::{
    Partial as VendorinventoryPartial, Presenter as VendorInventoryItemsPresenter,
};

use entities::{sea_orm::*, vendor_inventory_items};

use entities::vendor_inventory_items::Entity as VendorInventoryItems;

pub async fn index(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path((event_id, vendor_id)): Path<(i32, i32)>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    let vendor = load_vendor(event_id, vendor_id, &db).await?;

    let inventory = vendor
        .find_related(VendorInventoryItems)
        .all(database_connection)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch inventory items: {}", e),
            )
        })?;

    VendorInventoryItemsPresenter::new(&inventory).render()
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VendorInventoryItemCreateRequest {
    name: String,
    category: String,
}

pub async fn create(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    ExtractApiKey(_api_key): ExtractApiKey,
    Path((event_id, vendor_id)): Path<(i32, i32)>,
    Json(payload): Json<VendorInventoryItemCreateRequest>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let vendor = load_vendor(event_id, vendor_id, &db).await?;

    let new_item = vendor_inventory_items::ActiveModel {
        name: Set(payload.name),
        category: Set(payload.category),
        vendor_id: Set(vendor.id),
        ..Default::default() // sets the other fields such as ID
    };

    // Insert the new item into the database and handle potential errors
    match new_item.insert(database_connection).await {
        Ok(inserted_item) => Ok(Json(VendorinventoryPartial::new(&inserted_item).render())),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to insert item: {}", e),
        )),
    }
}
