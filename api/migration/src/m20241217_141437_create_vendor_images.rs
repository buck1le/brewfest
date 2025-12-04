use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .create_table(
                Table::create()
                    .table(VendorImage::Table)
                    .col(
                        ColumnDef::new(VendorImage::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(VendorImage::VendorId)
                            .integer()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(VendorImage::Url)
                            .string()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(VendorImage::Text)
                            .string()
                            .not_null()
                            .default("".to_string())
                    )
                    .if_not_exists()
                    .to_owned(),
            )
            .await?;

        manager.create_foreign_key(
            ForeignKey::create()
                .name("FK_vendor_images_vendor")
                .from(VendorImage::Table, VendorImage::VendorId)
                .to(Vendor::Table, Vendor::Id)
                .on_delete(ForeignKeyAction::Cascade)
                .on_update(ForeignKeyAction::Cascade)
                .to_owned(),
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(VendorImage::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Vendor {
    Table,
    Id,
}


#[derive(DeriveIden)]
enum VendorImage {
    Table,
    Id,
    VendorId,
    Url,
    Text,
}
