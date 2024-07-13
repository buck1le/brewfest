use crate::handlers::events::vendor;
use axum::{routing::get, routing::post, Router};

pub fn routes() -> Router {
    Router::new()
        .route("/", get(vendor::index))
        .route("/", post(vendor::create))
}
