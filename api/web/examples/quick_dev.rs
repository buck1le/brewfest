#![allow(unused)]

use tracing::info;

pub type Result<T> = core::result::Result<T, Error>;
pub type Error = Box<dyn std::error::Error>;

#[tokio::main]
async fn main() -> Result<()> {
    let base_url = "http://127.0.0.1:8080";
    let hc = httpc_test::new_client(base_url)?;

    hc.do_get("/").await?.print().await?;

    hc.do_get("/api/vendors").await?.print().await?;

    hc.do_get("/api/schedule").await?.print().await?;

    

    Ok(())
}
