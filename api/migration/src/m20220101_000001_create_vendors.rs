use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Vendor::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Vendor::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Vendor::Name).string().not_null())
                    .col(ColumnDef::new(Vendor::Email).string().not_null())
                    .col(ColumnDef::new(Vendor::Phone).string().not_null())
                    .col(ColumnDef::new(Vendor::CreatedAt).date_time().not_null())
                    .col(ColumnDef::new(Vendor::UpdatedAt).date_time().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Vendor::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Vendor {
    Table,
    Id,
    Name,
    Email,
    Phone,
    CreatedAt,
    UpdatedAt,
}
