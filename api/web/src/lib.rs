use axum::{Extension, Router};
use migration::{sea_orm::Database, ExtendedMigrator, MigratorTrait};
use notifications::NotificationService;
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

    let s3 = S3::new().await?;
    let config = config::DatabaseConfig::new();
    let db = Database::connect(&config.url).await?;
    debug!("Connected to database with url: {}", config.url);

    ExtendedMigrator::up(&db, None).await?;
    info!("Database migration complete");

    let db = Arc::new(db);
    let aws_s3_client = Arc::new(s3);

    // Initialize NotificationService
    let fcm_service_account_path = std::env::var("FCM_SERVICE_ACCOUNT_KEY")
        .unwrap_or_else(|_| "./config/firebase-service-account.json".to_string());

    let notification_service = Arc::new(
        NotificationService::new(fcm_service_account_path, db.clone())
            .await
            .expect("Failed to initialize NotificationService")
    );

    info!("NotificationService initialized successfully");

    let routes_all = Router::new()
        .merge(routers::routes())
        .layer(Extension(db))
        .layer(Extension(aws_s3_client))
        .layer(Extension(notification_service));

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
