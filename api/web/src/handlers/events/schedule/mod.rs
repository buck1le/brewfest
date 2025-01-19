pub mod image;
pub mod thumbnail;

use axum::extract::{Json, Path};
use axum::http::StatusCode;
use axum::{response::IntoResponse, Extension};

use chrono::prelude::*;
use entities::*;

use serde::Deserialize;

use entities::schedule_items::Entity as ScheduleItems;

use entities::sea_orm::*;
use std::sync::Arc;

use crate::common::events::{load_event, load_schedule_item};
use crate::presenters::events::schedule::Partial as SchedulePartial;
use crate::presenters::events::schedule::Presenter as SchedulePresenter;

pub async fn index(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(event_id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    let event = load_event(event_id, database_connection).await?;

    let schedule_items = event
        .find_related(ScheduleItems)
        .all(database_connection)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch schedule items: {}", e),
            )
        })?;

    SchedulePresenter::new(&schedule_items).render()
}

#[derive(Deserialize)]
pub struct ShowParams {
    event_id: i32,
    schedule_item_id: i32,
}

pub async fn show(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(ShowParams {
        event_id,
        schedule_item_id,
    }): Path<ShowParams>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let schedule_item = load_schedule_item(event_id, schedule_item_id, &db).await?;
    Ok(Json(SchedulePartial::new(&schedule_item).render()))
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScheduleCreateRequest {
    title: String,
    description: String,
    start_date: String,
    end_date: String,
}

fn parse_date(
    date_str: &str,
) -> Result<NaiveDateTime, (StatusCode, String)> {
    NaiveDateTime::parse_from_str(date_str, "%Y-%m-%dT%H:%M:%S")
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("Invalid date: {}", e)))
}

pub async fn create(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(event_id): Path<i32>,
    Json(payload): Json<ScheduleCreateRequest>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let event = load_event(event_id, database_connection).await?;

    let start_date_time = parse_date(&payload.start_date)?;
    let end_date_time = parse_date(&payload.end_date)?;

    let new_item = schedule_items::ActiveModel {
        title: Set(payload.title.clone()),
        description: Set(payload.description.clone()),
        start_date: Set(start_date_time),
        end_date: Set(end_date_time),
        event_id: Set(event.id),
        ..Default::default() // sets the other fields such as ID
    };

    // Insert the new item into the database and handle potential errors
    match new_item.insert(database_connection).await {
        Ok(inserted_item) => Ok(Json(SchedulePartial::new(&inserted_item).render())),
        Err(e) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to insert item: {}", e),
        )),
    }
}
