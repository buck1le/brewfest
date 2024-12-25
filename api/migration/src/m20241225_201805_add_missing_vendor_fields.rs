use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendors::Table)
                    .add_column(ColumnDef::new(Vendors::Description).string().not_null())
                    .modify_column(ColumnDef::new(Vendors::Category).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendors::Table)
                    .drop_column(Vendors::Description)
                    .modify_column(ColumnDef::new(Vendors::Category).null())
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Vendors {
    Table,
    Description,
    Category,
}
