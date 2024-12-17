use axum::{routing::get, routing::post, Router};

use crate::handlers::events::vendor;
use crate::handlers::events::vendor::image;

pub fn routes() -> Router {
    Router::new()
        .route("/", get(vendor::index))
        .route("/", post(vendor::create))
        .route("/:vendor_id", get(vendor::show))
        .route("/:vendor_id/images", post(image::create))
        .route("/:vendor_id/images", get(image::index))
}
