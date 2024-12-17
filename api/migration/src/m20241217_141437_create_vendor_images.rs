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
                    .table(VendorImages::Table)
                    .col(
                        ColumnDef::new(VendorImages::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(VendorImages::VendorId)
                            .integer()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(VendorImages::Url)
                            .string()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(VendorImages::Text)
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
                .from(VendorImages::Table, VendorImages::VendorId)
                .to(Vendors::Table, Vendors::Id)
                .on_delete(ForeignKeyAction::Cascade)
                .on_update(ForeignKeyAction::Cascade)
                .to_owned(),
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(VendorImages::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Vendors {
    Table,
    Id,
}


#[derive(DeriveIden)]
enum VendorImages {
    Table,
    Id,
    VendorId,
    Url,
    Text,
}
