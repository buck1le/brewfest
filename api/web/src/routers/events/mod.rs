use axum::{routing::{get, post}, Router};

pub mod schedule;
pub mod vendors;

use crate::handlers::events;
use crate::handlers::events::thumbnail;

pub fn events_routes() -> Router {
    Router::new()
        .route("/", get(events::index))
        .route("/", post(events::create))
        .route("/:event_id/inventory", get(events::inventory))
        .route("/:event_id/thumbnail", post(thumbnail::create))
        .nest("/:event_id/schedule", schedule::routes())
        .nest("/:event_id/vendors", vendors::routes())
}
