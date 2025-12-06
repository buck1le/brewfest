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
                    .add_column(ColumnDef::new(Event::City).string())
                    .add_column(ColumnDef::new(Event::State).string())
                    .add_column(ColumnDef::new(Event::Address).string())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Event::Table)
                    .drop_column(Event::City)
                    .drop_column(Event::State)
                    .drop_column(Event::Address)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Event {
    Table,
    City,
    State,
    Address,
}
