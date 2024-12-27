use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(VendorInventoryItems::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(VendorInventoryItems::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(VendorInventoryItems::Name)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(VendorInventoryItems::Category)
                            .string()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(VendorInventoryItems::VendorId)
                            .integer()
                            .not_null(),
                    )
                    .col(ColumnDef::new(VendorInventoryItems::Thumbnail).string())
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("FK_vendor_inventory_items_vendors")
                    .from(VendorInventoryItems::Table, VendorInventoryItems::VendorId)
                    .to(Vendors::Table, Vendors::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .on_update(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(VendorInventoryItems::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum VendorInventoryItems {
    Table,
    Id,
    Name,
    Category,
    Thumbnail,
    VendorId,
}

#[derive(DeriveIden)]
enum Vendors {
    Table,
    Id,
}
