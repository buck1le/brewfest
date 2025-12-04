use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(ScheduleItem::Table)
                    .add_column(
                        ColumnDef::new(ScheduleItem::Image)
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
                    .table(ScheduleItem::Table)
                    .drop_column(ScheduleItem::Image)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum ScheduleItem {
    Table,
    Image
}
