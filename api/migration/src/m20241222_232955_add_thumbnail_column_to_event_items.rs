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
                    .add_column(ColumnDef::new(Vendors::Thumbnail).string())
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItems::Table)
                    .add_column(ColumnDef::new(ScheduleItems::Thumbnail).string())
                    .to_owned(),
            )
            .await?;

        // Remove the image field on Vendor and ScheduleItems

        manager
            .alter_table(
                Table::alter()
                    .table(Vendors::Table)
                    .drop_column(Vendors::Image)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItems::Table)
                    .drop_column(ScheduleItems::Image)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItems::Table)
                    .drop_column(ScheduleItems::Thumbnail)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItems::Table)
                    .drop_column(ScheduleItems::Thumbnail)
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(Vendors::Table)
                    .add_column(ColumnDef::new(Vendors::Image).string())
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItems::Table)
                    .add_column(ColumnDef::new(ScheduleItems::Image).string())
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Vendors {
    Table,
    Image,
    Thumbnail,
}

#[derive(DeriveIden)]
enum ScheduleItems {
    Table,
    Image,
    Thumbnail,
}
