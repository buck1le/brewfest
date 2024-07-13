use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Vendors::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Vendors::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Vendors::Name).string().not_null())
                    .col(ColumnDef::new(Vendors::Email).string().not_null())
                    .col(ColumnDef::new(Vendors::Phone).string().not_null())
                    .col(ColumnDef::new(Vendors::CreatedAt).date_time().not_null())
                    .col(ColumnDef::new(Vendors::UpdatedAt).date_time().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Vendors::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Vendors {
    Table,
    Id,
    Name,
    Email,
    Phone,
    CreatedAt,
    UpdatedAt,
}
