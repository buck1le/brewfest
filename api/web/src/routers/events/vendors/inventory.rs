use axum::{
    routing::{get, post},
    Router,
};

use crate::handlers::events::vendor::inventory::{self, thumbnail};

pub fn routes() -> Router {
    Router::new()
        .route("/", get(inventory::index))
        .route("/", post(inventory::create))
        .route("/:inventory_id/thumbnail", post(thumbnail::create))
}
