use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(NotificationDelivery::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(NotificationDelivery::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(NotificationDelivery::NotificationId).integer().not_null())
                    .col(ColumnDef::new(NotificationDelivery::DeviceTokenId).integer().not_null())
                    .col(
                        ColumnDef::new(NotificationDelivery::Status)
                            .string()
                            .not_null()
                            .default("pending"),
                    )
                    .col(ColumnDef::new(NotificationDelivery::DeliveredAt).timestamp())
                    .col(ColumnDef::new(NotificationDelivery::ClickedAt).timestamp())
                    .col(ColumnDef::new(NotificationDelivery::FcmMessageId).string())
                    .col(ColumnDef::new(NotificationDelivery::ErrorCode).string())
                    .col(ColumnDef::new(NotificationDelivery::ErrorMessage).text())
                    .col(
                        ColumnDef::new(NotificationDelivery::CreatedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(NotificationDelivery::UpdatedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .to_owned(),
            )
            .await?;

        // Create unique constraint on notification_id + device_token_id
        manager
            .create_index(
                Index::create()
                    .name("idx_notification_delivery_unique")
                    .table(NotificationDelivery::Table)
                    .col(NotificationDelivery::NotificationId)
                    .col(NotificationDelivery::DeviceTokenId)
                    .unique()
                    .to_owned(),
            )
            .await?;

        // Create index on notification_id for queries
        manager
            .create_index(
                Index::create()
                    .name("idx_notification_delivery_notification_id")
                    .table(NotificationDelivery::Table)
                    .col(NotificationDelivery::NotificationId)
                    .to_owned(),
            )
            .await?;

        // Create index on status for filtering
        manager
            .create_index(
                Index::create()
                    .name("idx_notification_delivery_status")
                    .table(NotificationDelivery::Table)
                    .col(NotificationDelivery::Status)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(NotificationDelivery::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum NotificationDelivery {
    Table,
    Id,
    NotificationId,
    DeviceTokenId,
    Status,
    DeliveredAt,
    ClickedAt,
    FcmMessageId,
    ErrorCode,
    ErrorMessage,
    CreatedAt,
    UpdatedAt,
}
