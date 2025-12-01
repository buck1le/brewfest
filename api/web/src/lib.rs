use axum::{Extension, Router};
use dotenvy::dotenv;
use migration::{sea_orm::Database, Migrator, MigratorTrait};
use std::sync::Arc;
use tokio::net::TcpListener;
use tracing::{debug, info};
use tracing_subscriber::EnvFilter;
use images::S3;

mod config;
pub mod auth;
pub mod common;
pub mod handlers;
pub mod presenters;
pub mod routers;
pub mod utils;

#[tokio::main]
async fn start() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .without_time()
        .with_target(false)
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    dotenv().expect("Failed to load .env file");

    let s3 = S3::new().await?;
    let config = config::DatabaseConfig::new();
    let db = Database::connect(&config.url).await?;
    debug!("Connected to database with url: {}", config.url);

    Migrator::up(&db, None).await?;
    info!("Database migration complete");

    let db = Arc::new(db);
    let aws_s3_client = Arc::new(s3);

    let routes_all = Router::new()
        .merge(routers::routes())
        .layer(Extension(db))
        .layer(Extension(aws_s3_client));

    let listener = TcpListener::bind("0.0.0.0:8080").await.unwrap();

    axum::serve(listener, routes_all.into_make_service()).await?;

    Ok(())
}

pub fn main() {
    let result = start();

    if let Some(err) = result.err() {
        println!("Error: {err}");
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use entities::sea_orm::*;
    use entities::{
        events,
        sea_orm::{ConnectOptions, DatabaseConnection},
    };
    use presenters::events::vendors::Partial as VendorPartial;
    use presenters::events::Partial as EventPartial;
    use std::{net::SocketAddr, time::Duration};
    use testcontainers::{core::IntoContainerPort, runners::AsyncRunner, ImageExt};
    use tokio::net::TcpListener;

    mod unprotected_routes {
        use super::*;

        #[tokio::test]
        async fn test_get_events() {
            let app = TestApp::new().await;

            let new_event = events::ActiveModel {
                name: Set("Hello, World!".into()),
                description: Set("Hello, World!".into()),
                start_date: Set("2021-01-01".parse().unwrap()),
                latitude: Set(0.0),
                longitude: Set(0.0),
                end_date: Set("2021-01-01".parse().unwrap()),
                ..Default::default()
            };
            let inserted_event = new_event.insert(&*app.db_pool).await.unwrap();
            let expected_response =
                serde_json::to_string(&vec![EventPartial::new(&inserted_event).render()]).unwrap();

            let res = app.get("/api/events").await;

            assert_eq!(res.status(), 200);
            assert_eq!(res.text().await.unwrap(), expected_response);

            // Clean up
            inserted_event.delete(&*app.db_pool).await.unwrap();
        }

        #[tokio::test]
        async fn test_get_vendor() {
            let app = TestApp::new().await;

            let new_event = events::ActiveModel {
                name: Set("Hello, World!".into()),
                description: Set("Hello, World!".into()),
                start_date: Set("2021-01-01".parse().unwrap()),
                latitude: Set(0.0),
                longitude: Set(0.0),
                end_date: Set("2021-01-01".parse().unwrap()),
                ..Default::default()
            };
            let inserted_event = new_event.insert(&*app.db_pool).await.unwrap();

            let new_vendor = entities::vendors::ActiveModel {
                name: Set("Hello, World!".into()),
                email: Set("jloesch@example.com".into()),
                phone: Set("123-456-7890".into()),
                vendor_type: Set(None),
                operating_out_of: Set("Hello, World!".into()),
                description: Set("Hello, World!".into()),
                latitude: Set(0.0),
                category: Set(Some("Food".into())),
                longitude: Set(0.0),
                event_id: Set(inserted_event.id),
                ..Default::default()
            };

            let inserted_vendor = new_vendor.insert(&*app.db_pool).await.unwrap();
            let expected_response =
                serde_json::to_string(&vec![VendorPartial::new(&inserted_vendor).render()])
                    .unwrap();

            let res = app
                .get(&format!("/api/events/{}/vendors", inserted_event.id))
                .await;

            assert_eq!(res.status(), 200);
            assert_eq!(res.text().await.unwrap(), expected_response);
        }
    }

    mod protected_routes {
        use once_cell::sync::Lazy;

        use super::*;

        static API_KEY: Lazy<String> = Lazy::new(|| {
            std::env::set_var("API_KEY", "test");
            std::env::var("API_KEY").expect("API_KEY must be set for tests")
        });

        #[tokio::test]
        async fn test_create_event() {
            let payload = r#"{ 
                "name": "Hello, World!", 
                "description": "Hello, World!", 
                "startDate": "2021-01-01", 
                "coordinates": { "latitude": 0.0, "longitude": 0.0 },
                "endDate": "2021-01-01" 
             }"#;

            let app = TestApp::new().await;

            let res = app.post("/api/events", payload, &API_KEY).await;

            assert_eq!(res.status(), 200);
        }

        #[tokio::test]
        async fn test_create_vendor() {
            let payload = r#"{ 
                    "name": "Hello, World!", 
                    "email": "jloesch@example.com", 
                    "phone": "123-456-7890", 
                    "description": "Hello, World!",
                    "operatingOutOf": "Hello, World!",
                    "vendorType": "Food",
                    "coordinates": { "latitude": 0.0, "longitude": 0.0 },
                    "category": "Food"
                }"#;

            let app = TestApp::new().await;

            let new_event = events::ActiveModel {
                name: Set("Hello, World!".into()),
                description: Set("Hello, World!".into()),
                start_date: Set("2021-01-01".parse().unwrap()),
                latitude: Set(0.0),
                longitude: Set(0.0),
                end_date: Set("2021-01-01".parse().unwrap()),
                ..Default::default()
            };

            let inserted_event = new_event.insert(&*app.db_pool).await.unwrap();

            let res = app
                .post(
                    &format!("/api/events/{}/vendors", inserted_event.id),
                    payload,
                    &API_KEY,
                )
                .await;

            assert_eq!(res.status(), 200);
        }
    }
}
