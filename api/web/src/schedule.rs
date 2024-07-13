use axum::{Router, routing::get, routing::post, routing::put, routing::delete};
use super::handlers::schedule::schedule;
use super::handlers::schedule::image;

pub fn routes() -> Router {
    Router::new()
        .route("/api/schedule", get(schedule::index))
        .route("/api/schedule/:id", get(schedule::show))
        .route("/api/schedule", post(schedule::create))
        .route("/api/schedule/:id/images", post(image::create))
        // .route("/api/schedule/:id", delete(schedule::delete))
}
