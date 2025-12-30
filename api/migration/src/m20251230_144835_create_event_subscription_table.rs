use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(EventSubscription::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(EventSubscription::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(EventSubscription::DeviceTokenId)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(EventSubscription::EventId)
                            .integer()
                            .not_null(),
                    )
                    .col(
                        ColumnDef::new(EventSubscription::IsActive)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(
                        ColumnDef::new(EventSubscription::SubscribedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(ColumnDef::new(EventSubscription::UnsubscribedAt).timestamp())
                    .col(
                        ColumnDef::new(EventSubscription::CreatedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(EventSubscription::UpdatedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_event_subscription_device_token")
                            .from(EventSubscription::Table, EventSubscription::DeviceTokenId)
                            .to(DeviceToken::Table, DeviceToken::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_event_subscription_event")
                            .from(EventSubscription::Table, EventSubscription::EventId)
                            .to(Event::Table, Event::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        // Create composite unique index to prevent duplicate subscriptions
        manager
            .create_index(
                Index::create()
                    .name("idx_event_subscription_unique")
                    .table(EventSubscription::Table)
                    .col(EventSubscription::DeviceTokenId)
                    .col(EventSubscription::EventId)
                    .unique()
                    .to_owned(),
            )
            .await?;

        // Create index for querying by event
        manager
            .create_index(
                Index::create()
                    .name("idx_event_subscription_event")
                    .table(EventSubscription::Table)
                    .col(EventSubscription::EventId)
                    .to_owned(),
            )
            .await?;

        // Create index for querying by device token
        manager
            .create_index(
                Index::create()
                    .name("idx_event_subscription_device")
                    .table(EventSubscription::Table)
                    .col(EventSubscription::DeviceTokenId)
                    .to_owned(),
            )
            .await?;

        // Create index for querying active subscriptions by event (most common query)
        manager
            .create_index(
                Index::create()
                    .name("idx_event_subscription_active")
                    .table(EventSubscription::Table)
                    .col(EventSubscription::EventId)
                    .col(EventSubscription::IsActive)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(EventSubscription::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum EventSubscription {
    Table,
    Id,
    DeviceTokenId,
    EventId,
    IsActive,
    SubscribedAt,
    UnsubscribedAt,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum DeviceToken {
    Table,
    Id,
}

#[derive(DeriveIden)]
enum Event {
    Table,
    Id,
}
