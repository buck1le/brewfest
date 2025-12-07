use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::Value;

use crate::presenters::events::vendors::Partial as VendorPartial;

pub struct Presenter {
    vendors: Vec<entities::vendor::Model>,
}

impl Presenter {
    pub fn new(vendors: Vec<entities::vendor::Model>) -> Self {
        Self { vendors }
    }

    pub fn render(self) -> Result<impl IntoResponse, (StatusCode, String)> {
        let item_json: Vec<Value> = self
            .vendors
            .into_iter()
            .map(|item| {
                VendorPartial::new(item).render()
            })
            .collect();

        Ok(Json(item_json).into_response())
    }
}


