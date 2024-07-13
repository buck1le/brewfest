use crate::handlers::events::vendor;
use axum::{routing::get, routing::post, Router};

pub fn routes() -> Router {
    Router::new().route("/api/vendors", get(vendor::index))
    .route("/api/vendors", post(vendor::create))
    // .route("/api/vendors", post(vendors::create))
    // .route("/api/vendors/:id", put(vendors::update))
    // .route("/api/vendors/:id", delete(vendors::delete))
}
