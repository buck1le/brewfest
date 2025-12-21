use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(DeviceToken::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(DeviceToken::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(DeviceToken::Token)
                            .string()
                            .not_null()
                            .unique_key(),
                    )
                    .col(ColumnDef::new(DeviceToken::Platform).string().not_null())
                    .col(ColumnDef::new(DeviceToken::DeviceId).string())
                    .col(ColumnDef::new(DeviceToken::UserId).integer())
                    .col(
                        ColumnDef::new(DeviceToken::IsActive)
                            .boolean()
                            .not_null()
                            .default(true),
                    )
                    .col(ColumnDef::new(DeviceToken::LastUsedAt).timestamp())
                    .col(
                        ColumnDef::new(DeviceToken::CreatedAt)
                            .timestamp()
                            .not_null()
                            .default(Expr::current_timestamp()),
                    )
                    .col(
                        ColumnDef::new(DeviceToken::UpdatedAt)
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
                    .name("idx_device_token_user_id")
                    .table(DeviceToken::Table)
                    .col(DeviceToken::UserId)
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .name("idx_device_token_is_active")
                    .table(DeviceToken::Table)
                    .col(DeviceToken::IsActive)
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(DeviceToken::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum DeviceToken {
    Table,
    Id,
    Token,
    Platform,
    DeviceId,
    UserId,
    IsActive,
    LastUsedAt,
    CreatedAt,
    UpdatedAt,
}
