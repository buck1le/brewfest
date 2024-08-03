use axum::{Router, routing::get};

pub mod schedule;
pub mod vendors;

use crate::handlers::events;

pub fn events_routes() -> Router {
    Router::new()
        .route("/", get(events::index))
        .nest("/:event_id/schedule", schedule::routes())
        .nest("/:event_id/vendors", vendors::routes())
}
