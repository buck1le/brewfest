use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::Value;

use crate::presenters::events::schedule::Partial as SchedulePartial;

pub struct Presenter <'a> {
    schedule_items: &'a Vec<entities::schedule_items::Model>,
}

impl <'a> Presenter <'a> {
    pub fn new(schedule_items: &'a Vec<entities::schedule_items::Model>) -> Self {
        Self { schedule_items }
    }

    pub fn render(&self) -> Result<impl IntoResponse, (StatusCode, String)> {
        let item_json: Vec<Value> = self
            .schedule_items
            .iter()
            .map(|item| SchedulePartial::new(item.clone()).render())
            .collect();

        Ok(Json(item_json).into_response())
    }
}
