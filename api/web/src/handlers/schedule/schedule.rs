use axum::extract::{Json, Path};
use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension};

use chrono::prelude::*;
use entities::{prelude::*, *};

use serde::Deserialize;
use serde_json::{json, to_string_pretty};

use entities::schedule_images::Entity as ScheduleImages;
use entities::schedule_items::Entity as ScheduleItems;
use tracing::info;

use entities::sea_orm::*;
use std::sync::Arc;

use crate::handlers::response::Response;

pub async fn index(Extension(db): Extension<Arc<DatabaseConnection>>) -> impl IntoResponse {
    let database_connection = &*db;

    let schedule_items = schedule_items::Entity::find()
        .all(database_connection)
        .await
        .unwrap();

    Json(json!(schedule_items))
}

pub async fn show(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(id): Path<i32>,
) -> impl IntoResponse {
    let database_connection = &*db;

    info!("Fetching schedule item with id: {}", id);

    match ScheduleItems::find_by_id(id).one(database_connection).await {
        Ok(Some(schedule_item)) => {
            match schedule_item
                .find_related(ScheduleImages)
                .all(database_connection)
                .await
            {
                Ok(schedule_images) => {
                    println!("Schedule images: {:?}", schedule_images);
                    let body = Json(json!({
                            "scheduleItem": schedule_item,
                            "scheduleImages": schedule_images
                    }));
                    Response::success(&body.to_string()).into_response()
                }
                Err(_e) => {
                    let body = Json(json!({
                        "error": "Failed to fetch schedule images"

                    }));
                    Response::error(&body.to_string()).into_response()
                }
            }
        }
        Ok(None) => {
            let body = Json(json!({
                "error": "Schedule item not found"
            }));
            Response::error(&body.to_string()).into_response()
        }
        Err(_e) => {
            let body = Json(json!({
                "error": "Failed to fetch schedule item"
            }));
            Response::error(&body.to_string()).into_response()
        }
    }
}

#[derive(Deserialize)]
pub struct ScheduleCreateRequest {
    title: String,
    description: String,
    start_date: String,
    end_date: String,
}

fn parse_date(
    date_str: &str,
    hour: u32,
    minute: u32,
    second: u32,
) -> Result<NaiveDateTime, (StatusCode, String)> {
    let date = NaiveDate::parse_from_str(date_str, "%Y-%m-%d")
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("Invalid date: {}", e)))?;
    date.and_hms_opt(hour, minute, second)
        .ok_or((StatusCode::BAD_REQUEST, "Invalid date".to_string()))
}

pub async fn create(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Json(payload): Json<ScheduleCreateRequest>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let start_date_time = parse_date(&payload.start_date, 0, 0, 0)?;
    let end_date_time = parse_date(&payload.end_date, 23, 59, 59)?;

    // Get the current date and time
    let now = Utc::now();
    let naive_datetime = now.naive_utc();

    let new_item = schedule_items::ActiveModel {
        title: Set(payload.title.clone()),
        description: Set(payload.description.clone()),
        start_date: Set(start_date_time),
        end_date: Set(end_date_time),
        created_at: Set(naive_datetime),
        updated_at: Set(naive_datetime),
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
