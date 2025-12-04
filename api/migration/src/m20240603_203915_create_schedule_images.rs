use sea_orm_migration::prelude::*;


#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(ScheduleImage::Table)
                    .col(
                        ColumnDef::new(ScheduleImage::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(ScheduleImage::ScheduleItemId)
                            .integer()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(ScheduleImage::Url)
                            .string()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(ScheduleImage::Text)
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
                .from(ScheduleImage::Table, ScheduleImage::ScheduleItemId)
                .to(ScheduleItem::Table, ScheduleItem::Id)
                .on_delete(ForeignKeyAction::Cascade)
                .on_update(ForeignKeyAction::Cascade)
                .to_owned(),
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(ScheduleImage::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum ScheduleImage {
    Table,
    Id,
    ScheduleItemId,
    Url,
    Text,
}

#[derive(DeriveIden)]
enum ScheduleItem {
    Id,
    Table,
}
