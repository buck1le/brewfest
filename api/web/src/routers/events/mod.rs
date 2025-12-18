use axum::{
    routing::{get, post},
    Router,
};

pub mod schedule;
pub mod vendors;

use crate::handlers::events;

pub fn events_routes() -> Router {
    Router::new()
        .route("/", get(events::index))
        .route("/", post(events::create))
        .route("/:event_id", get(events::show))
        .route("/:event_id/thumbnail", post(events::thumbnail::create))
        .route("/:event_id/inventory", get(events::inventory))
        .nest("/:event_id/schedule", schedule::routes())
        .nest("/:event_id/vendors", vendors::routes())
}
