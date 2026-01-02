use sea_orm_migration::prelude::*;

#[async_std::main]
async fn main() {
    // Use ExtendedMigrator which includes seed migrations when RUN_SEEDS=true
    cli::run_cli(migration::ExtendedMigrator).await;
}
