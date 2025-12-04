use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(VendorInventoryItem::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(VendorInventoryItem::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(VendorInventoryItem::Name)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(VendorInventoryItem::Category)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(VendorInventoryItem::VendorId)
                            .integer()
                            .not_null(),
                    )
                    .col(ColumnDef::new(VendorInventoryItem::Thumbnail).string())
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("FK_vendor_inventory_items_vendors")
                    .from(VendorInventoryItem::Table, VendorInventoryItem::VendorId)
                    .to(Vendor::Table, Vendor::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .on_update(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(VendorInventoryItem::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum VendorInventoryItem {
    Table,
    Id,
    Name,
    Category,
    Thumbnail,
    VendorId,
}

#[derive(DeriveIden)]
enum Vendor {
    Table,
    Id,
}
