use axum::{Router, routing::get, routing::post};
use crate::handlers::events::schedule;
use crate::handlers::events::schedule::image;

pub fn routes() -> Router {
    Router::new()
        .route("/api/events/:id/schedule", get(schedule::index))
        .route("/api/events/:id/schedule", post(schedule::create))
        .route("/api/events/:id/schedule/:id", get(schedule::show))
        .route("/api/events/:id/schedule/:id/images", post(image::create))
        // .route("/api/schedule/:id", delete(schedule::delete))
}
