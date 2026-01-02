use sea_orm_migration::prelude::*;

/// Extended migrator that includes seed data migrations
/// This file is safe from sea-orm-cli overwrites
pub struct ExtendedMigrator;

/// Check if seed migrations should run based on RUN_SEEDS environment variable
fn should_run_seeds() -> bool {
    std::env::var("RUN_SEEDS")
        .map(|val| val.to_lowercase() == "true" || val == "1")
        .unwrap_or(false)
}

#[async_trait::async_trait]
impl MigratorTrait for ExtendedMigrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        // Start with base migrations from the CLI-managed Migrator
        let mut all_migrations = crate::Migrator::migrations();

        // Conditionally add seed migrations based on RUN_SEEDS env var
        if should_run_seeds() {
            tracing::info!("RUN_SEEDS is enabled - seed migrations will be executed");
            all_migrations.push(Box::new(crate::seeds::accounts::Migration));
            all_migrations.push(Box::new(crate::seeds::events::Migration));
            all_migrations.push(Box::new(crate::seeds::vendors::Migration));
            all_migrations.push(Box::new(crate::seeds::vendor_inventory::Migration));
        } else {
            tracing::info!("RUN_SEEDS is disabled - skipping seed migrations");
        }

        all_migrations
    }
}
