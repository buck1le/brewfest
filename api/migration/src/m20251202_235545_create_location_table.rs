use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Location::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Location::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(
                        ColumnDef::new(Location::City)
                            .string()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(Location::Address)
                            .string()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(Location::State)
                            .string()
                            .not_null()
                    )
                    .col(ColumnDef::new(Location::Latitude).double())
                    .col(ColumnDef::new(Location::Longitude).double())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Location::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Location {
    Table,
    Id,
    City,
    Address,
    State,
    Latitude,
    Longitude,
}
