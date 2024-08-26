use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::Value;

use crate::presenters::events::schedule::images::Partial as ImagePartial;

pub struct Presenter {
    images: Vec<entities::schedule_images::Model>,
}

impl Presenter {
    pub fn new(images: Vec<entities::schedule_images::Model>) -> Self {
        Self { images }
    }

    pub fn render(&self) -> Result<impl IntoResponse, (StatusCode, String)> {
        let item_json: Vec<Value> = self
            .images
            .iter()
            .map(|item| ImagePartial::new(item.clone()).render())
            .collect();

        Ok(Json(item_json).into_response())
    }
}
