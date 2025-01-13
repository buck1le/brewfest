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
                    .add_column(ColumnDef::new(Vendors::VendorType).string())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendors::Table)
                    .drop_column(Vendors::VendorType)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Vendors {
    Table,
    VendorType,
}
