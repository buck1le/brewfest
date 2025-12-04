use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .alter_table(
                sea_query::Table::alter()
                    .table(Event::Table)
                    .add_column(ColumnDef::new(Event::Image).string())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                sea_query::Table::alter()
                .table(Event::Table)
                .drop_column(Event::Image)
                .to_owned()
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Event {
    Table,
    Image,
}
