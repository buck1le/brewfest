use axum::{routing::{get, post}, Router};

pub mod schedule;
pub mod vendors;

use once_cell::sync::OnceCell;
use crate::handlers::events;
use crate::handlers::events::thumbnail;

pub fn events_routes() -> Router {
    Router::new()
        .route("/", get(events::index))
        .route("/", post(events::create))
        .route("/:event_id/inventory", get(events::inventory))
        .route("/:event_id/thumbnail", post(thumbnail::create))
        .nest("/:event_id/schedule", schedule::routes())
        .nest("/:event_id/vendors", vendors::routes())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::utils::test_app::TestApp;
    use axum::http::StatusCode;
    use serde_json::json;

    static TEST_APP: OnceCell<TestApp> = OnceCell::new();

    async fn get_app() -> &'static TestApp {
        TEST_APP.get_or_init(|| {
            tokio::runtime::Runtime::new()
                .unwrap()
                .block_on(async { TestApp::new().await })
        })
    }

    #[tokio::test]
    async fn should_return_events() {
        let app = get_app().await;
        let response = app.get("/events").await;

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(response.text().await.unwrap(), "[]");
    }

    #[tokio::test]
    async fn should_return_event() {
        let app = TestApp::new().await;
        let response = app.get("/events/1").await;

        assert_eq!(response.status(), StatusCode::OK);
        assert_eq!(response.text().await.unwrap(), "{}");
    }
}

