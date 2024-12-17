use axum::{routing::get, Extension, Router};
use tokio::net::TcpListener;
use tracing::{debug, info};
use dotenvy::dotenv;
use migration::{Migrator, MigratorTrait, sea_orm::Database};
use tracing_subscriber::EnvFilter;
use std::sync::Arc;

use images::S3;

pub mod handlers;
pub mod utils;
pub mod routers;
pub mod presenters;
pub mod common;

mod config;

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
    
    let listener = TcpListener::bind("127.0.0.1:8080").await.unwrap();

    axum::serve(listener, routes_all.into_make_service()).await?;

    Ok(())
}

pub fn main() {
    let result = start();

    if let Some(err) = result.err() {
        println!("Error: {err}");
    }
}

pub fn hello_world_router() -> Router {
    Router::new().route("/", get(|| async { "Hello, World!" }))
}
