pub mod device_tokens;
pub mod events;

use axum::Router;
use device_tokens::device_tokens_routes;
use events::events_routes;

pub fn routes() -> Router {
    Router::new()
        .nest("/api/v1/events", events_routes())
        .nest("/api/v1/device-tokens", device_tokens_routes())
}
