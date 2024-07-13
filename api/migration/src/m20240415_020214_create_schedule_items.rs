use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(ScheduleItems::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(ScheduleItems::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(ScheduleItems::Title).string().not_null())
                    .col(ColumnDef::new(ScheduleItems::Description).string().not_null())
                    .col(ColumnDef::new(ScheduleItems::StartDate).date_time().not_null())
                    .col(ColumnDef::new(ScheduleItems::EndDate).date_time().not_null())
                    .col(ColumnDef::new(ScheduleItems::CreatedAt).date_time().not_null())
                    .col(ColumnDef::new(ScheduleItems::UpdatedAt).date_time().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(ScheduleItems::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum ScheduleItems {
    Table,
    Id,
    Title,
    Description,
    StartDate,
    EndDate,
    CreatedAt,
    UpdatedAt,
}
