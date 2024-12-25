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

use crate::common::events::load_event;
use crate::presenters::events::schedule::Presenter as SchedulePresenter;
use crate::presenters::events::schedule::Partial as SchedulePartial;

pub async fn index(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(event_id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    let event = load_event(event_id, database_connection).await?;

    if let Some(event) = event {
        let schedule_items = event
            .find_related(ScheduleItems)
            .all(database_connection)
            .await;

        match schedule_items {
            Ok(schedule_items) => SchedulePresenter::new(&schedule_items).render(),
            Err(e) => Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to fetch schedule items: {}", e),
            )),
        }
    } else {
        Err((StatusCode::NOT_FOUND, "Event not found".to_string()))
    }
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
    let database_connection = &*db;

    let event = load_event(event_id, &db).await.unwrap();

    if let Some(event) = event {
        let item = event
            .find_related(ScheduleItems)
            .filter(schedule_items::Column::Id.eq(schedule_item_id))
            .one(database_connection)
            .await
            .unwrap();

        if let Some(item) = item {
            Ok(Json(SchedulePartial::new(&item).render()).into_response())
        } else {
            Err((StatusCode::NOT_FOUND, "Schedule item not found".to_string()))
        }
    } else {
        Err((StatusCode::NOT_FOUND, "Event not found".to_string()))
    }
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
    Path(event_id): Path<i32>,
    Json(payload): Json<ScheduleCreateRequest>,
) -> impl IntoResponse {
    let database_connection = &*db;

    let event = load_event(event_id, database_connection).await?;

    if event.is_none() {
        return Err((StatusCode::NOT_FOUND, "Event not found".to_string()));
    }

    let start_date_time = parse_date(&payload.start_date, 0, 0, 0)?;
    let end_date_time = parse_date(&payload.end_date, 23, 59, 59)?;

    let new_item = schedule_items::ActiveModel {
        title: Set(payload.title.clone()),
        description: Set(payload.description.clone()),
        start_date: Set(start_date_time),
        end_date: Set(end_date_time),
        event_id: Set(event_id),
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
