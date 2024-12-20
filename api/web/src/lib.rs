use axum::{routing::get, Extension, Router};
use dotenvy::dotenv;
use migration::{sea_orm::Database, Migrator, MigratorTrait};
use std::sync::Arc;
use tokio::net::TcpListener;
use tracing::{debug, info};
use tracing_subscriber::EnvFilter;

use images::S3;

pub mod auth;
pub mod common;
mod config;
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

#[cfg(test)]
mod test {
    use super::*;
    use entities::{events, sea_orm::{ConnectOptions, DatabaseConnection}};
    use std::{net::SocketAddr, time::Duration};
    use testcontainers::{core::IntoContainerPort, runners::AsyncRunner, ImageExt};
    use tokio::net::TcpListener;

    #[derive(Clone)]
    struct TestApp {
        pub client: reqwest::Client,
        pub addr: SocketAddr,
        pub db_pool: Arc<DatabaseConnection>,

        // Keep the container alive so it does not get dropped
        _container:
            Arc<tokio::sync::Mutex<testcontainers::ContainerAsync<testcontainers::GenericImage>>>,
    }

    impl TestApp {
        pub async fn new() -> Self {
            env_logger::builder().is_test(true).try_init().ok();

            debug!("Starting test app");

            let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
            let addr = listener.local_addr().unwrap();

            let image = testcontainers::GenericImage::new("postgres", "13")
                .with_exposed_port(5432.tcp())
                .with_env_var("POSTGRES_USER", "postgres")
                .with_env_var("POSTGRES_PASSWORD", "postgres")
                .with_env_var("POSTGRES_DB", "brewfest_test");

            let node = image.start().await.unwrap();

            tokio::time::sleep(std::time::Duration::from_secs(5)).await;

            let mut opt = ConnectOptions::new(
                format!(
                    "postgres://postgres:postgres@localhost:{}/brewfest_test",
                    node.get_host_port_ipv4(5432).await.unwrap()
                )
                .to_owned(),
            );

            opt.max_connections(10)
                .min_connections(1)
                .connect_timeout(Duration::from_secs(5));

            let db_pool = Database::connect(opt).await.unwrap();

            debug!("Connected to database");

            std::env::set_var("S3_BUCKET", "my-test-bucket");
            std::env::set_var("S3_FOLDER", "test");

            migration::Migrator::up(&db_pool, None).await.unwrap();

            let routes_all = Router::new()
                .merge(routers::routes())
                .layer(Extension(Arc::new(db_pool.clone())))
                .layer(Extension(Arc::new(S3::new().await.unwrap())));

            tokio::spawn(async move {
                axum::serve(listener, routes_all.into_make_service())
                    .await
                    .unwrap();
            });

            Self {
                client: reqwest::Client::new(),
                addr,
                db_pool: Arc::new(db_pool),
                _container: Arc::new(node.into()),
            }
        }

        pub async fn get(&self, path: &str) -> reqwest::Response {
            self.client
                .get(format!("http://{}{}", self.addr, path))
                .send()
                .await
                .unwrap()
        }
    }

    #[tokio::test]
    async fn test_hello_world() {
        use entities::sea_orm::*;


        let app = TestApp::new().await;

        let new_event = events::ActiveModel {
            name: Set("Hello, World!".into()),
            description: Set("Hello, World!".into()),
            start_date: Set("2021-01-01".parse().unwrap()),
            end_date: Set("2021-01-01".parse().unwrap()),
            ..Default::default()
        };

        new_event.insert(&*app.db_pool).await.unwrap();

        let res = app.get("/api/events").await;

        assert_eq!(res.status(), 200);
        assert_eq!(res.text().await.unwrap(), "Hello, World!");
    }
}
