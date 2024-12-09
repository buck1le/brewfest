use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendors::Table)
                    .add_column(
                        ColumnDef::new(Vendors::Category)
                            .string()
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendors::Table)
                    .drop_column(Vendors::Category)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Vendors {
    Table,
    Category,
}
