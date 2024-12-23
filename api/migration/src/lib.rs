pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_vendors;
mod m20240415_020214_create_schedule_items;
mod m20240415_223417_create_events;
mod m20240415_233255_create_accounts;
mod m20240415_233815_add_reference_from_vendors_to_events;
mod m20240603_203915_create_schedule_images;
mod m20240704_151504_add_location_to_vendors;
mod m20240713_154501_add_event_reference_to_schedule;
mod m20241020_233000_add_image_to_events;
mod m20241209_205735_add_category_to_vendor;
mod m20241209_211320_add_image_to_vendors;
mod m20241210_005959_add_image_to_schedule_item;
mod m20241217_141437_create_vendor_images;
mod m20241222_232955_add_thumbnail_column_to_images;

pub struct Migrator;

mod seeds;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        let mut base_migrations: Vec<Box<dyn MigrationTrait>> = vec![
            Box::new(m20220101_000001_create_vendors::Migration),
            Box::new(m20240415_020214_create_schedule_items::Migration),
            Box::new(m20240415_223417_create_events::Migration),
            Box::new(m20240415_233255_create_accounts::Migration),
            Box::new(m20240415_233815_add_reference_from_vendors_to_events::Migration),
            Box::new(m20240603_203915_create_schedule_images::Migration),
            Box::new(m20240704_151504_add_location_to_vendors::Migration),
            Box::new(m20240713_154501_add_event_reference_to_schedule::Migration),
            Box::new(m20241020_233000_add_image_to_events::Migration),
            Box::new(m20241209_205735_add_category_to_vendor::Migration),
            Box::new(m20241209_211320_add_image_to_vendors::Migration),
            Box::new(m20241210_005959_add_image_to_schedule_item::Migration),
            Box::new(m20241217_141437_create_vendor_images::Migration),
            Box::new(m20241222_232955_add_thumbnail_column_to_images::Migration),
        ];
        // Migrations for development database here
        base_migrations.push(Box::new(seeds::accounts::Migration));

        base_migrations
    }
}
