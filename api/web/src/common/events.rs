use axum::http::StatusCode;

use entities::sea_orm::*;
use entities::*;

pub async fn load_event(
    event_id: i32,
    db: &DatabaseConnection,
) -> Result<Option<events::Model>, (StatusCode, String)> {
    events::Entity::find_by_id(event_id)
        .one(db)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database query error: {}", e),
            )
        })
}
