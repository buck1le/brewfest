use axum::{Router, routing::get, routing::post};
use crate::handlers::events::schedule;
use crate::handlers::events::schedule::image;

pub fn routes() -> Router {
    Router::new()
        .route("/", get(schedule::index))
        .route("/", post(schedule::create))
        .route("/:schedule_item_id", get(schedule::show))
        .route("/:schedule_item_id/images", post(image::create))
        .route("/:schedule_item_id/images", get(image::index))
}
