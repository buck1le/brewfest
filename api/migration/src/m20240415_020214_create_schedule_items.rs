use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(ScheduleItem::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(ScheduleItem::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(ScheduleItem::Title).string().not_null())
                    .col(ColumnDef::new(ScheduleItem::Description).string().not_null())
                    .col(ColumnDef::new(ScheduleItem::StartDate).date_time().not_null())
                    .col(ColumnDef::new(ScheduleItem::EndDate).date_time().not_null())
                    .col(ColumnDef::new(ScheduleItem::CreatedAt).date_time().not_null())
                    .col(ColumnDef::new(ScheduleItem::UpdatedAt).date_time().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(ScheduleItem::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum ScheduleItem {
    Table,
    Id,
    Title,
    Description,
    StartDate,
    EndDate,
    CreatedAt,
    UpdatedAt,
}
