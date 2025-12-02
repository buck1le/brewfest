use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Rename all tables from plural to singular
        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("events"), Alias::new("event"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("vendors"), Alias::new("vendor"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("accounts"), Alias::new("account"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("schedule_items"), Alias::new("schedule_item"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("vendor_inventory_items"), Alias::new("vendor_inventory_item"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("vendor_images"), Alias::new("vendor_image"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("schedule_images"), Alias::new("schedule_image"))
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Rename all tables back to plural
        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("event"), Alias::new("events"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("vendor"), Alias::new("vendors"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("account"), Alias::new("accounts"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("schedule_item"), Alias::new("schedule_items"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("vendor_inventory_item"), Alias::new("vendor_inventory_items"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("vendor_image"), Alias::new("vendor_images"))
                    .to_owned(),
            )
            .await?;

        manager
            .rename_table(
                Table::rename()
                    .table(Alias::new("schedule_image"), Alias::new("schedule_images"))
                    .to_owned(),
            )
            .await?;

        Ok(())
    }
}
