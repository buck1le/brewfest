use axum::{
    routing::{delete, post},
    Router,
};

use crate::handlers::device_tokens;

pub fn device_tokens_routes() -> Router {
    Router::new()
        .route("/", post(device_tokens::register))
        .route("/:token", delete(device_tokens::unregister))
}
