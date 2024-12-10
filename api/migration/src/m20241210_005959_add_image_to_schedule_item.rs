use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItems::Table)
                    .add_column(
                        ColumnDef::new(ScheduleItems::Image)
                            .string()
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItems::Table)
                    .drop_column(ScheduleItems::Image)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum ScheduleItems {
    Table,
    Image
}
