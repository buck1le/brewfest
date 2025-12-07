pub mod events;

use axum::Router;
use events::events_routes;

pub fn routes() -> Router {
    Router::new()
        .nest("/api/v1/events", events_routes())
}
