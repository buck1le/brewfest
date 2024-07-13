use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        let events_insert_sql = r#"
            INSERT INTO events (name, description, event_date_range)
            VALUES ($1, $2, $3::daterange)
        "#;

        let values = vec![
            sea_orm::Value::String(Some(Box::new("Sample Event".to_owned()))),
            sea_orm::Value::String(Some(Box::new("This is a sample event.".to_owned()))),
            sea_orm::Value::String(Some(Box::new("['2024-01-01', '2024-01-02']".to_owned()))),
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
