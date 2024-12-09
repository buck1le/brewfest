use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::Value;

use crate::presenters::events::vendors::Partial as VendorPartial;

pub struct Presenter<'a> {
    vendors: &'a Vec<entities::vendors::Model>,
}

impl <'a> Presenter <'a> {
    pub fn new(vendors: &'a Vec<entities::vendors::Model>) -> Self {
        Self { vendors }
    }

    pub fn render(&self) -> Result<impl IntoResponse, (StatusCode, String)> {
        let item_json: Vec<Value> = self
            .vendors
            .iter()
            .map(|item| {
                VendorPartial::new(item).render()
            })
            .collect();

        Ok(Json(item_json).into_response())
    }
}


