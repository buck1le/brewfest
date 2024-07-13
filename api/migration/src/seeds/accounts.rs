
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        let events_insert_sql = r#"
            INSERT INTO accounts (name, description)
            VALUES ($1, $2)
        "#;

        let values = vec![
            sea_orm::Value::String(Some(Box::new("Account Name".to_owned()))),
            sea_orm::Value::String(Some(Box::new("This is a description".to_owned()))),
        ];

        let stmt = sea_orm::Statement::from_sql_and_values(
            sea_orm::DatabaseBackend::Postgres,
            events_insert_sql,
            values,
        );

        let _ = db.execute(stmt).await?;

        Ok(())
    }
}
