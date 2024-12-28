use axum::{routing::get, Router};

use crate::handlers::events::vendor::inventory;

pub fn routes() -> Router {
    Router::new()
        .route("/", get(inventory::index))
}
