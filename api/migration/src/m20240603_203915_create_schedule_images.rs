use sea_orm_migration::prelude::*;


#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(ScheduleImages::Table)
                    .col(
                        ColumnDef::new(ScheduleImages::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(ScheduleImages::ScheduleItemId)
                            .integer()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(ScheduleImages::Url)
                            .string()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(ScheduleImages::Text)
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
                .name("FK_schedule_images_schedule_items")
                .from(ScheduleImages::Table, ScheduleImages::ScheduleItemId)
                .to(ScheduleItems::Table, ScheduleItems::Id)
                .on_delete(ForeignKeyAction::Cascade)
                .on_update(ForeignKeyAction::Cascade)
                .to_owned(),
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(ScheduleImages::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum ScheduleImages {
    Table,
    Id,
    ScheduleItemId,
    Url,
    Text,
}

#[derive(DeriveIden)]
enum ScheduleItems {
    Id,
    Table,
}
