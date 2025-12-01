use crate::routers;
use axum::{Extension, Router};
use database::DatabaseConnection;
use std::{net::SocketAddr, sync::Arc};
use testcontainers::{GenericImage, ImageExt};
use tokio::net::TcpListener;

#[derive(Clone)]
pub struct TestApp {
    pub client: reqwest::Client,
    pub addr: SocketAddr,
    pub db_pool: Arc<DatabaseConnection>,

    // Keep the container alive so it does not get dropped
    _container:
        Arc<tokio::sync::Mutex<testcontainers::ContainerAsync<testcontainers::GenericImage>>>,
}

impl TestApp {
    pub async fn new() -> Self {
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

    pub async fn post(&self, path: &str, payload: &str, api_key: &str) -> reqwest::Response {
        self.client
            .post(format!("http://{}{}", self.addr, path))
            .body(payload.to_string())
            .header("x-api-key", api_key)
            .header("Content-Type", "application/json")
            .send()
            .await
            .unwrap()
    }
}
