use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        // Insert multiple events with realistic data
        let events_data = vec![
            (
                "Portland Spring Brewfest 2025",
                "Join us for Portland's premier spring craft beer festival featuring over 100 local and regional breweries, live music, and food trucks.",
                "2025-03-15",
                "2025-03-17",
                45.5231,
                -122.6765,
                "Portland",
                "OR",
                "1234 Waterfront Park, Portland, OR 97204",
                Some("https://example.com/thumbnails/spring-brewfest.jpg"),
            ),
            (
                "Seattle Summer Beer Festival 2025",
                "Experience the best of Pacific Northwest brewing at this annual summer celebration. Three days of craft beer, cider, and culinary delights.",
                "2025-06-20",
                "2025-06-22",
                47.6062,
                -122.3321,
                "Seattle",
                "WA",
                "401 5th Ave N, Seattle, WA 98109",
                Some("https://example.com/thumbnails/summer-beer-fest.jpg"),
            ),
            (
                "Oregon Fall Harvest Brewfest 2025",
                "Celebrate fall with fresh hop beers, pumpkin ales, and seasonal brews from Oregon's finest breweries. Family-friendly atmosphere.",
                "2025-09-10",
                "2025-09-12",
                44.0521,
                -123.0868,
                "Eugene",
                "OR",
                "200 W Park Ave, Eugene, OR 97401",
                Some("https://example.com/thumbnails/fall-harvest.jpg"),
            ),
            (
                "Vancouver Winter Ale Festival 2025",
                "Warm up with robust stouts, porters, and winter warmers from BC's top craft breweries. Indoor venue with cozy atmosphere.",
                "2025-12-05",
                "2025-12-07",
                49.2827,
                -123.1207,
                "Vancouver",
                "BC",
                "88 Pacific Blvd, Vancouver, BC V6Z 2V9",
                None,
            ),
        ];

        for (name, description, start_date, end_date, latitude, longitude, city, state, address, thumbnail) in events_data {
            let insert_sql = r#"
                INSERT INTO event (name, description, start_date, end_date, latitude, longitude, city, state, address, thumbnail)
                VALUES ($1, $2, $3::date, $4::date, $5, $6, $7, $8, $9, $10)
            "#;

            let mut values = vec![
                sea_orm::Value::String(Some(Box::new(name.to_owned()))),
                sea_orm::Value::String(Some(Box::new(description.to_owned()))),
                sea_orm::Value::String(Some(Box::new(start_date.to_owned()))),
                sea_orm::Value::String(Some(Box::new(end_date.to_owned()))),
                sea_orm::Value::Double(Some(latitude)),
                sea_orm::Value::Double(Some(longitude)),
                sea_orm::Value::String(Some(Box::new(city.to_owned()))),
                sea_orm::Value::String(Some(Box::new(state.to_owned()))),
                sea_orm::Value::String(Some(Box::new(address.to_owned()))),
            ];

            // Handle optional thumbnail
            if let Some(thumb) = thumbnail {
                values.push(sea_orm::Value::String(Some(Box::new(thumb.to_owned()))));
            } else {
                values.push(sea_orm::Value::String(None));
            }

            let stmt = sea_orm::Statement::from_sql_and_values(
                sea_orm::DatabaseBackend::Postgres,
                insert_sql,
                values,
            );

            let _ = db.execute(stmt).await?;
        }

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        // Delete all seeded events
        let event_names = vec![
            "Portland Spring Brewfest 2025",
            "Seattle Summer Beer Festival 2025",
            "Oregon Fall Harvest Brewfest 2025",
            "Vancouver Winter Ale Festival 2025",
        ];

        for name in event_names {
            let delete_sql = r#"
                DELETE FROM event
                WHERE name = $1
            "#;

            let values = vec![sea_orm::Value::String(Some(Box::new(name.to_owned())))];

            let stmt = sea_orm::Statement::from_sql_and_values(
                sea_orm::DatabaseBackend::Postgres,
                delete_sql,
                values,
            );

            let _ = db.execute(stmt).await?;
        }

        Ok(())
    }
}
