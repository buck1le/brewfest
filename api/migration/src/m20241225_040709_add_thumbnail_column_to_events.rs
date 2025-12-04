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
                    .add_column(ColumnDef::new(Event::Thumbnail).string())
                    .drop_column(Event::Image)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Event::Table)
                    .drop_column(Event::Thumbnail)
                    .add_column(ColumnDef::new(Event::Image).string())
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Event {
    Table,
    Thumbnail,
    Image
}
