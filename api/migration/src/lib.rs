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
mod m20241222_232955_add_thumbnail_column_to_event_items;
mod m20241225_040709_add_thumbnail_column_to_events;
mod m20241225_200857_operating_out_of_to_vendor;
mod m20241225_201805_add_missing_vendor_fields;
mod m20241227_163654_create_vendor_inventory;
mod m20241231_223437_add_coordinates_to_event;
mod m20250113_003852_add_type_to_vendor;
mod m20250118_034811_add_event_id_to_inventory_item;
mod m20251206_035118_add_location_attributes_to_event;
mod m20251206_155509_add_vendor_fields;
mod m20251212_023114_add_subcat_to_inventory_item;
mod m20251215_010039_rename_subcategory_to_inventory_item_type;
mod m20251221_160401_create_device_token_table;
mod m20251221_160431_create_notification_table;
mod m20251221_160458_create_notification_delivery_table;
mod m20251230_144835_create_event_subscription_table;

pub struct Migrator;

// Seeds module (used by ExtendedMigrator)
pub mod seeds;

// Extended migrator with seed data support (safe from CLI overwrites)
pub mod migrator_extended;
pub use migrator_extended::ExtendedMigrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
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
            Box::new(m20241222_232955_add_thumbnail_column_to_event_items::Migration),
            Box::new(m20241225_040709_add_thumbnail_column_to_events::Migration),
            Box::new(m20241225_200857_operating_out_of_to_vendor::Migration),
            Box::new(m20241225_201805_add_missing_vendor_fields::Migration),
            Box::new(m20241227_163654_create_vendor_inventory::Migration),
            Box::new(m20241231_223437_add_coordinates_to_event::Migration),
            Box::new(m20250113_003852_add_type_to_vendor::Migration),
            Box::new(m20250118_034811_add_event_id_to_inventory_item::Migration),
            Box::new(m20251206_035118_add_location_attributes_to_event::Migration),
            Box::new(m20251206_155509_add_vendor_fields::Migration),
            Box::new(m20251212_023114_add_subcat_to_inventory_item::Migration),
            Box::new(m20251215_010039_rename_subcategory_to_inventory_item_type::Migration),
            Box::new(m20251221_160401_create_device_token_table::Migration),
            Box::new(m20251221_160431_create_notification_table::Migration),
            Box::new(m20251221_160458_create_notification_delivery_table::Migration),
            Box::new(m20251230_144835_create_event_subscription_table::Migration),
        ]
    }
}
