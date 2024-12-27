

pub fn routes() -> Router {
    Router::new()
        .nest("/events", events::events_routes())
        .nest("/vendors", vendors::routes())
}
