use std::env;
use axum::{routing::get, Extension, Router};
use tokio::net::TcpListener;
use tracing::info;
use dotenvy::dotenv;
use migration::{Migrator, MigratorTrait, sea_orm::Database};
use tracing_subscriber::EnvFilter;
use std::sync::Arc;

pub mod handlers;
pub mod utils;
pub mod routers;
pub mod presenters;
mod config;

#[tokio::main]
async fn start() -> anyhow::Result<()> {
    env::set_var("RUST_LOG", "debug");

    tracing_subscriber::fmt()
        .without_time()
        .with_target(false)
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    info!("Starting server...");


    dotenv().expect("Failed to load .env file");
    
    let aws_config = aws_config::from_env().region("us-east-2").load().await;
    let aws_s3_client = aws_sdk_s3::Client::new(&aws_config);
    info!("AWS S3 client initialized");

    let config = config::DatabaseConfig::new();
    let db = Database::connect(&config.url).await?;
    Migrator::up(&db, None).await?;
    info!("Database migration complete");

    let db = Arc::new(db);
    let aws_s3_client = Arc::new(aws_s3_client);

    let routes_all = Router::new()
        .merge(routers::routes())
        .layer(Extension(db)) //  make the database connection available to all routes
        .layer(Extension(aws_s3_client)); // make the S3 client available to all routes
    
    let listener = TcpListener::bind("127.0.0.1:8050").await.unwrap();

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
