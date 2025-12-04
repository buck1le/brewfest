use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Event::Table)
                    .add_column(ColumnDef::new(Event::Latitude).double().not_null())
                    .add_column(ColumnDef::new(Event::Longitude).double().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Event::Table)
                    .drop_column(Event::Latitude)
                    .drop_column(Event::Longitude)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Event {
    Table,
    Latitude,
    Longitude
}
