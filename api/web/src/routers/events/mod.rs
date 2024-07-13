use axum::Router;

pub mod schedule;
pub mod vendors;

pub fn events_routes() -> Router {
    Router::new()
        .nest("/:event_id/schedule", schedule::routes())
        .nest("/:event_id/vendors", vendors::routes())
}
