use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(VendorInventoryItem::Table)
                    .add_column(ColumnDef::new(VendorInventoryItem::EventId).integer().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(VendorInventoryItem::Table)
                    .drop_column(VendorInventoryItem::EventId)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum VendorInventoryItem {
    Table,
    EventId,
}
