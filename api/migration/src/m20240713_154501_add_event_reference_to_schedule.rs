use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // add the foreign key column to the Events table
        manager
            .alter_table(
                sea_query::Table::alter()
                    .table(ScheduleItems::Table)
                    .add_column(ColumnDef::new(ScheduleItems::EventId).integer().not_null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_foreign_key(
                ForeignKey::create()
                    .name("FK_schedule_events")
                    .from(ScheduleItems::Table, ScheduleItems::EventId)
                    .to(Events::Table, Events::Id)
                    .on_delete(ForeignKeyAction::Cascade)
                    .on_update(ForeignKeyAction::Cascade)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let foreign_key_drop = ForeignKey::drop()
            .name("FK_schedule_events")
            .table(ScheduleItems::Table)
            .to_owned();

        manager.drop_foreign_key(foreign_key_drop).await
    }
}

#[derive(DeriveIden)]
enum ScheduleItems {
    Table,
    EventId,
}

#[derive(DeriveIden)]
enum Events {
    Id,
    Table,
}
