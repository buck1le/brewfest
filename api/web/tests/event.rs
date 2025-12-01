mod common;

use common::test_app::TestApp;
use axum::http::StatusCode;
use tokio::sync::OnceCell;

static TEST_APP: OnceCell<TestApp> = OnceCell::const_new();

async fn get_app() -> &'static TestApp {
    TEST_APP
        .get_or_init(|| async { TestApp::new().await.expect("Failed to start test app") })
        .await
}

#[tokio::test]
async fn should_return_events() {
    let app = get_app().await;
    let response = app.get("/api/events").await;

    response.debug();

    assert_eq!(response.status, StatusCode::OK);
    assert_eq!(response.body, "[]");
}

#[tokio::test]
async fn should_return_event() {
    let app = get_app().await;
    let response = app.get("/api/events/1").await;

    response.debug();

    assert_eq!(response.status, StatusCode::OK);
    assert_eq!(response.body, "{}");
}
