use axum::{routing::get, routing::post, Router};

pub mod inventory;

use crate::handlers::events::vendor::{self, thumbnail, image};

pub fn routes() -> Router {
    Router::new()
        .route("/", get(vendor::index))
        .route("/", post(vendor::create))
        .route("/:vendor_id", get(vendor::show))
        .route("/:vendor_id/images", post(image::create))
        .route("/:vendor_id/thumbnail", post(thumbnail::create))
        .nest("/:vendor_id/inventory", inventory::routes())
}
