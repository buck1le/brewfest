pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_vendors;
mod m20240415_020214_create_schedule_items;
mod m20240415_223417_create_events;
mod m20240415_233255_create_accounts;
mod m20240415_233815_add_reference_from_vendors_to_events;
mod m20240603_203915_create_schedule_images;
mod m20240704_151504_add_location_to_vendors;
mod m20240713_154501_add_event_reference_to_schedule;

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
        ];

        println!("Running dev migrations");
        // Migrations for development database here
        base_migrations.push(Box::new(seeds::accounts::Migration));

        base_migrations
    }
}
