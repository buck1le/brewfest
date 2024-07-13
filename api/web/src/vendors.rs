use super::handlers::vendor;
use axum::{routing::delete, routing::get, routing::post, routing::put, Router};

pub fn routes() -> Router {
    Router::new().route("/api/vendors", get(vendor::vendor::index))
    // .route("/api/vendors/:id", get(vendors::show))
    // .route("/api/vendors", post(vendors::create))
    // .route("/api/vendors/:id", put(vendors::update))
    // .route("/api/vendors/:id", delete(vendors::delete))
}
