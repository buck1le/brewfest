use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(VendorImages::Table)
                    .add_column(
                        ColumnDef::new(VendorImages::Thumbnail)
                            .boolean()
                            .default(false),
                    )
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleImages::Table)
                    .add_column(
                        ColumnDef::new(ScheduleImages::Thumbnail)
                            .boolean()
                            .default(false),
                    )
                    .to_owned(),
            )
            .await?;

        // Remove the image field on Vendor and ScheduleItems
        
        manager.alter_table(
            Table::alter()
                .table(Vendors::Table)
                .drop_column(Vendors::Image)
                .to_owned(),
        ).await?;

        manager.alter_table(
            Table::alter()
                .table(ScheduleItems::Table)
                .drop_column(ScheduleItems::Image)
                .to_owned(),
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(VendorImages::Table)
                    .drop_column(VendorImages::Thumbnail)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleImages::Table)
                    .drop_column(ScheduleImages::Thumbnail)
                    .to_owned(),
            )
            .await?;
        
        manager.alter_table(
            Table::alter()
                .table(Vendors::Table)
                .add_column(
                    ColumnDef::new(Vendors::Image)
                        .string()
                )
                .to_owned(),
        ).await?;

        manager.alter_table(
            Table::alter()
                .table(ScheduleItems::Table)
                .add_column(
                    ColumnDef::new(ScheduleItems::Image)
                        .string()
                )
                .to_owned(),
        ).await
    }
}

#[derive(DeriveIden)]
enum VendorImages {
    Table,
    Thumbnail,
}

#[derive(DeriveIden)]
enum Vendors {
    Table,
    Image
}

#[derive(DeriveIden)]
enum ScheduleImages {
    Table,
    Thumbnail,
}

#[derive(DeriveIden)]
enum ScheduleItems {
    Table,
    Image
}
