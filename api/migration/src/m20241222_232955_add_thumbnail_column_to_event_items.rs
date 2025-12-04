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
                    .add_column(ColumnDef::new(Vendor::Thumbnail).string())
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItem::Table)
                    .add_column(ColumnDef::new(ScheduleItem::Thumbnail).string())
                    .to_owned(),
            )
            .await?;

        // Remove the image field on Vendor and ScheduleItem

        manager
            .alter_table(
                Table::alter()
                    .table(Vendor::Table)
                    .drop_column(Vendor::Image)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItem::Table)
                    .drop_column(ScheduleItem::Image)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItem::Table)
                    .drop_column(ScheduleItem::Thumbnail)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItem::Table)
                    .drop_column(ScheduleItem::Thumbnail)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(Vendor::Table)
                    .add_column(ColumnDef::new(Vendor::Image).string())
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItem::Table)
                    .add_column(ColumnDef::new(ScheduleItem::Image).string())
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Vendor {
    Table,
    Image,
    Thumbnail,
}

#[derive(DeriveIden)]
enum ScheduleItem {
    Table,
    Image,
    Thumbnail,
}
