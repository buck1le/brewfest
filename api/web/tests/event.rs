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

    assert_eq!(response.status, StatusCode::OK);

    // Verify response is an array
    let json = response.json();
    assert!(json.is_array(), "Response should be an array");
    assert!(!json.as_array().unwrap().is_empty(), "Should have at least one event");
}

#[tokio::test]
async fn should_return_event() {
    let app = get_app().await;
    let response = app.get("/api/events/1").await;

    assert_eq!(response.status, StatusCode::OK);

    // Verify response is an object with expected fields
    let json = response.json();
    assert!(json.is_object(), "Response should be an object");
    assert!(json["id"].is_number(), "Should have an id");
    assert!(json["name"].is_string(), "Should have a name");
    assert!(json["description"].is_string(), "Should have a description");
    assert!(json["startDate"].is_string(), "Should have a startDate");
    assert!(json["endDate"].is_string(), "Should have an endDate");
    assert!(json["coordinates"].is_object(), "Should have coordinates");
    assert!(json["resources"].is_object(), "Should have resources");
}
