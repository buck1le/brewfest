use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Notification::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Notification::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Notification::Title).string().not_null())
                    .col(ColumnDef::new(Notification::Body).text().not_null())
                    .col(ColumnDef::new(Notification::NotificationType).string().not_null())
                    .col(ColumnDef::new(Notification::RelatedEntityType).string())
                    .col(ColumnDef::new(Notification::RelatedEntityId).integer())
                    .col(ColumnDef::new(Notification::EventId).integer())
                    .col(ColumnDef::new(Notification::TargetUserId).integer())
                    .col(
                        ColumnDef::new(Notification::Status)
                            .string()
                            .not_null()
                            .default("pending"),
                    )
                    .col(ColumnDef::new(Notification::SentAt).timestamp())
                    .col(ColumnDef::new(Notification::FailedReason).text())
                    .col(
                        ColumnDef::new(Notification::CreatedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(Notification::UpdatedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        // Create indexes
        manager
            .create_index(
                Index::create()
                    .name("idx_notification_event_id")
                    .table(Notification::Table)
                    .col(Notification::EventId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_notification_type")
                    .table(Notification::Table)
                    .col(Notification::NotificationType)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_notification_status")
                    .table(Notification::Table)
                    .col(Notification::Status)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Notification::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Notification {
    Table,
    Id,
    Title,
    Body,
    NotificationType,
    RelatedEntityType,
    RelatedEntityId,
    EventId,
    TargetUserId,
    Status,
    SentAt,
    FailedReason,
    CreatedAt,
    UpdatedAt,
}
