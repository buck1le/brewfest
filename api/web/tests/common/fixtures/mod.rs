pub mod events;

use std::sync::Arc;
use entities::sea_orm::DatabaseConnection;

pub struct Fixtures {
    db: Arc<DatabaseConnection>,
}

impl Fixtures {
    pub fn new(db: Arc<DatabaseConnection>) -> Self {
        Self { db }
    }

    pub async fn seed(&self) -> anyhow::Result<()> {
        // this is using auto deref to get the db connection
        events::seed_events(&self.db).await.expect("Failed to seed events");
        Ok(())
    }
}
