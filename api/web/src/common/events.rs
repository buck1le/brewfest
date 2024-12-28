use axum::http::StatusCode;

use entities::sea_orm::*;
use entities::*;

pub async fn load_event(
    event_id: i32,
    db: &DatabaseConnection,
) -> Result<events::Model, (StatusCode, String)> {
    events::Entity::find_by_id(event_id)
        .one(db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database query error: {}", e),
            )
        })?
        .ok_or_else(|| (StatusCode::NOT_FOUND, "Event not found".to_string()))
}

pub async fn load_vendor(
    event_id: i32,
    vendor_id: i32,
    db: &DatabaseConnection,
) -> Result<vendors::Model, (StatusCode, String)> {
    let event = load_event(event_id, db).await?;

    event
        .find_related(vendors::Entity)
        .filter(vendors::Column::Id.eq(vendor_id))
        .one(db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database query error: {}", e),
            )
        })?
        .ok_or_else(|| (StatusCode::NOT_FOUND, "Vendor not found".to_string()))
}

pub async fn load_schedule_item(
    event_id: i32,
    schedule_item_id: i32,
    db: &DatabaseConnection,
) -> Result<schedule_items::Model, (StatusCode, String)> {
    let event = load_event(event_id, db).await?;

    event
        .find_related(schedule_items::Entity)
        .filter(schedule_items::Column::Id.eq(schedule_item_id))
        .one(db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database query error: {}", e),
            )
        })?
        .ok_or_else(|| (StatusCode::NOT_FOUND, "Schedule item not found".to_string()))
}
