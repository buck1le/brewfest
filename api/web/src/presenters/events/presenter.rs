use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::Value;

use crate::presenters::events::Partial as EventsPartial;

pub struct Presenter {
    events: Vec<entities::events::Model>,
}

impl Presenter {
    pub fn new(events: Vec<entities::events::Model>) -> Self {
        Self { events }
    }

    pub fn render(&self) -> Result<impl IntoResponse, (StatusCode, String)> {
        let item_json: Vec<Value> = self
            .events
            .iter()
            .map(|item| {
                EventsPartial::new(item.clone()).render()
            })
            .collect();

        Ok(Json(item_json).into_response())
    }
}


