use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendor::Table)
                    .add_column(ColumnDef::new(Vendor::Booth).string())
                    .add_column(
                        ColumnDef::new(Vendor::IsFeatured)
                            .boolean()
                            .not_null()
                            .default(false)
                    )
                    .add_column(
                        ColumnDef::new(Vendor::Tags)
                            .array(ColumnType::Text)
                            .not_null()
                            .default(Expr::cust("ARRAY[]::text[]"))
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Vendor::Table)
                    .drop_column(Vendor::Booth)
                    .drop_column(Vendor::IsFeatured)
                    .drop_column(Vendor::Tags)
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum Vendor {
    Table,
    Booth,
    IsFeatured,
    Tags,
}
