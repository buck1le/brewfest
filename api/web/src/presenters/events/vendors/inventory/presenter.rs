use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::Value;

use crate::presenters::events::vendors::inventory::Partial as VendorInventoryPartial;

pub struct Presenter<'a> {
    inventory_items: &'a Vec<entities::vendor_inventory_items::Model>,
}

impl <'a> Presenter <'a> {
    pub fn new(inventory_items: &'a Vec<entities::vendor_inventory_items::Model>) -> Self {
        Self { inventory_items }
    }

    pub fn render(&self) -> Result<impl IntoResponse, (StatusCode, String)> {
        let item_json: Vec<Value> = self
            .inventory_items
            .iter()
            .map(|item| {
                VendorInventoryPartial::new(item).render()
            })
            .collect();

        Ok(Json(item_json).into_response())
    }
}


