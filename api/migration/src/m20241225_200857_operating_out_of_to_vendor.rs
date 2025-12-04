use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendor::Table)
                    .add_column(ColumnDef::new(Vendor::OperatingOutOf).string().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendor::Table)
                    .drop_column(Vendor::OperatingOutOf)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Vendor {
    Table,
    OperatingOutOf,
}
