use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(VendorInventoryItems::Table)
                    .add_column(ColumnDef::new(VendorInventoryItems::EventId).integer().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(VendorInventoryItems::Table)
                    .drop_column(VendorInventoryItems::EventId)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum VendorInventoryItems {
    Table,
    EventId,
}
