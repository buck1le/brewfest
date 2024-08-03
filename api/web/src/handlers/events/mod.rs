use axum::{http::StatusCode, response::IntoResponse, Extension, Json};
use chrono::NaiveDate;
use serde::Deserialize;
use std::sync::Arc;

use entities::{*};
use entities::sea_orm::*;

pub mod schedule;
pub mod vendor;

#[derive(Deserialize)]
pub struct EventCreateRequest {
    name: String,
    description: String,
    start_date: String,
    end_date: String,
}

fn parse_date(
    date_str: &str,
) -> Result<NaiveDate, (StatusCode, String)> {
    NaiveDate::parse_from_str(date_str, "%Y-%m-%d")
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("Invalid date: {}", e)))
}

pub async fn create(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Json(payload): Json<EventCreateRequest>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let start_date_time = parse_date(&payload.start_date)?;
    let end_date_time = parse_date(&payload.end_date)?;

    let new_item = events::ActiveModel {
        name: Set(payload.name.clone()),
        description: Set(payload.description.clone()),
        start_date: Set(start_date_time),
        end_date: Set(end_date_time),
        ..Default::default() // sets the other fields such as ID
    };

    match new_item.insert(database_connection).await {
        Ok(inserted_item) => Ok(Json(inserted_item)),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to insert item: {}", e),
        )),
    }
}

pub async fn index(
    Extension(db): Extension<Arc<DatabaseConnection>>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let events = events::Entity::find()
        .all(database_connection)
        .await
        .unwrap();

    Json(events)
}
