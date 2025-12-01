use web_server::routers;

use std::{net::SocketAddr, sync::Arc, time::Duration};
use tracing::debug;

use axum::{Extension, Router};
use images::S3;
use migration::{
    sea_orm::{ConnectOptions, Database, DatabaseConnection},
    MigratorTrait,
};
use testcontainers::{core::ContainerPort, runners::AsyncRunner, ImageExt};
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
    pub async fn new() -> anyhow::Result<Self> {
        debug!("Starting test app");

        let listener = TcpListener::bind("127.0.0.1:0").await?;
        let addr = listener.local_addr()?;

        let image = testcontainers::GenericImage::new("postgres", "13")
            .with_exposed_port(ContainerPort::Tcp(5432))
            .with_env_var("POSTGRES_USER", "postgres")
            .with_env_var("POSTGRES_PASSWORD", "postgres")
            .with_env_var("POSTGRES_DB", "brewfest_test");

        let node = image.start().await?;
        let port = node.get_host_port_ipv4(5432).await?;
        let max_retires = 10;
        let sleep_duration = Duration::from_secs(1);
        let mut retries = 0;
        let url = format!(
            "postgres://postgres:postgres@localhost:{}/brewfest_test",
            port
        );

        loop {
            let mut opt = ConnectOptions::new(url.to_owned());
            opt.max_connections(1)
                .connect_timeout(Duration::from_secs(5));

            match Database::connect(opt).await {
                Ok(conn) => {
                    conn.close().await?;
                    break;
                }
                Err(_) if retries < max_retires => {
                    retries += 1;
                    tokio::time::sleep(sleep_duration).await;
                }
                Err(e) => {
                    panic!(
                        "Failed to connect to database after {} retries: {}",
                        retries, e
                    );
                }
            }
        }

        let mut opt = ConnectOptions::new(url);

        opt.max_connections(10)
            .min_connections(1)
            .connect_timeout(Duration::from_secs(5));

        let db_pool = Database::connect(opt).await?;

        debug!("Connected to database");

        std::env::set_var("S3_BUCKET", "my-test-bucket");
        std::env::set_var("S3_FOLDER", "test");

        migration::Migrator::up(&db_pool, None).await?;

        let routes_all = Router::new()
            .merge(routers::routes())
            .layer(Extension(Arc::new(db_pool.clone())))
            .layer(Extension(Arc::new(S3::new().await?)));

        tokio::spawn(async move {
            axum::serve(listener, routes_all.into_make_service())
                .await
                .unwrap();
        });

        Ok(Self {
            client: reqwest::Client::new(),
            addr,
            db_pool: Arc::new(db_pool),
            _container: Arc::new(node.into()),
        })
    }

    pub async fn get(&self, path: &str) -> TestResponse {
        let url = format!("http://{}{}", self.addr, path);

        let response = self
            .client
            .get(url.clone())
            .send()
            .await
            .unwrap_or_else(|_| panic!("Failed  to get {}", url));

        TestResponse::new(response).await
    }

    pub async fn post(&self, path: &str, payload: &str, api_key: &str) -> TestResponse {
        let url = format!("http://{}{}", self.addr, path);

        let response = self
            .client
            .post(url.clone())
            .body(payload.to_string())
            .header("x-api-key", api_key)
            .header("Content-Type", "application/json")
            .send()
            .await
            .unwrap_or_else(|_| panic!("Failed to post {}", url));

        TestResponse::new(response).await
    }
}

pub struct TestResponse {
    pub status: reqwest::StatusCode,
    pub headers: reqwest::header::HeaderMap,
    pub body: String,
}

impl TestResponse {
    async fn new(response: reqwest::Response) -> Self {
        let status = response.status();
        let headers = response.headers().clone();
        let body = response.text().await.unwrap();

        Self {
            status,
            headers,
            body,
        }
    }

    pub fn debug(&self) -> &Self {
        println!("Status: {}", self.status);
        println!("Headers: {:#?}", self.headers);
        println!("Body: {}", self.body);
        self
    }

    pub fn json(&self) -> serde_json::Value {
        serde_json::from_str(&self.body).unwrap()
    }
}
