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
                    .add_column(ColumnDef::new(Vendor::VendorType).string())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendor::Table)
                    .drop_column(Vendor::VendorType)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Vendor {
    Table,
    VendorType,
}
