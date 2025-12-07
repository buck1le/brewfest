use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        // Vendor data: (name, email, phone, operating_out_of, vendor_type, description,
        //               latitude, longitude, event_name, category, booth, is_featured, tags)
        let vendors_data = vec![
            // Vendors for Portland Spring Brewfest 2025
            (
                "Hopworks Urban Brewery",
                "contact@hopworksbeer.com",
                "503-232-4677",
                "Portland, OR",
                "brewery",
                "Award-winning organic craft brewery specializing in IPAs, lagers, and seasonal beers. Sustainability-focused with 100% renewable energy.",
                45.5231,
                -122.6765,
                "Portland Spring Brewfest 2025",
                "beverage",
                Some("A12"),
                true,
                vec!["IPA", "Organic", "Sustainable"],
            ),
            (
                "Deschutes Brewery",
                "info@deschutesbrewery.com",
                "541-385-8606",
                "Bend, OR",
                "brewery",
                "One of Oregon's premier craft breweries, known for Black Butte Porter and Fresh Squeezed IPA.",
                45.5231,
                -122.6766,
                "Portland Spring Brewfest 2025",
                "beverage",
                Some("A15"),
                true,
                vec!["Porter", "IPA", "Lager"],
            ),
            (
                "The Rolling Pin Food Truck",
                "orders@rollingpinpdx.com",
                "503-555-0100",
                "Portland, OR",
                "food_truck",
                "Gourmet sandwiches and craft beer pairings. Local ingredients, bold flavors.",
                45.5232,
                -122.6764,
                "Portland Spring Brewfest 2025",
                "food",
                Some("F01"),
                false,
                vec!["Sandwiches", "Local", "Beer Pairing"],
            ),
            (
                "BrewGear Co",
                "sales@brewgear.com",
                "503-555-0200",
                "Portland, OR",
                "merchandise",
                "Premium craft beer merchandise, glassware, and brewing equipment.",
                45.5230,
                -122.6767,
                "Portland Spring Brewfest 2025",
                "merchandise",
                Some("M05"),
                false,
                vec!["Glassware", "Apparel", "Brewing Gear"],
            ),

            // Vendors for Seattle Summer Beer Festival 2025
            (
                "Fremont Brewing",
                "hello@fremontbrewing.com",
                "206-420-2407",
                "Seattle, WA",
                "brewery",
                "Urban brewery with a focus on balanced, easy-drinking beers. Famous for Summer Ale and seasonal releases.",
                47.6062,
                -122.3321,
                "Seattle Summer Beer Festival 2025",
                "beverage",
                Some("B10"),
                true,
                vec!["Pale Ale", "Seasonal", "Local"],
            ),
            (
                "Pike Brewing Company",
                "info@pikebrewing.com",
                "206-622-6044",
                "Seattle, WA",
                "brewery",
                "Seattle's original craft brewery since 1989. Pioneers of the Northwest brewing scene.",
                47.6063,
                -122.3320,
                "Seattle Summer Beer Festival 2025",
                "beverage",
                Some("B12"),
                true,
                vec!["Stout", "IPA", "Historic"],
            ),
            (
                "Pacific Pretzels",
                "info@pacificpretzels.com",
                "206-555-0300",
                "Seattle, WA",
                "food_truck",
                "Authentic Bavarian-style soft pretzels with artisan dipping sauces.",
                47.6064,
                -122.3319,
                "Seattle Summer Beer Festival 2025",
                "food",
                Some("F08"),
                false,
                vec!["Bavarian", "Pretzels", "Artisan"],
            ),

            // Vendors for Oregon Fall Harvest Brewfest 2025
            (
                "Ninkasi Brewing Company",
                "info@ninkasibrewing.com",
                "541-344-2739",
                "Eugene, OR",
                "brewery",
                "Innovative craft brewery known for experimental fresh hop beers and award-winning year-round offerings.",
                44.0521,
                -123.0868,
                "Oregon Fall Harvest Brewfest 2025",
                "beverage",
                Some("C20"),
                true,
                vec!["Fresh Hop", "IPA", "Experimental"],
            ),
            (
                "Oakshire Brewing",
                "hello@oakbrew.com",
                "541-688-4555",
                "Eugene, OR",
                "brewery",
                "European-inspired ales and lagers with a Pacific Northwest twist. Specializing in small-batch seasonal beers.",
                44.0522,
                -123.0869,
                "Oregon Fall Harvest Brewfest 2025",
                "beverage",
                Some("C22"),
                true,
                vec!["Lager", "Seasonal", "Small Batch"],
            ),
            (
                "Farm Fresh Bites",
                "contact@farmfreshbites.com",
                "541-555-0400",
                "Eugene, OR",
                "food_truck",
                "Seasonal farm-to-table cuisine featuring local Oregon produce and meats.",
                44.0520,
                -123.0870,
                "Oregon Fall Harvest Brewfest 2025",
                "food",
                Some("F12"),
                false,
                vec!["Farm to Table", "Seasonal", "Local"],
            ),

            // Vendors for Vancouver Winter Ale Festival 2025
            (
                "33 Acres Brewing Company",
                "info@33acresbrewing.com",
                "604-620-4589",
                "Vancouver, BC",
                "brewery",
                "Modern brewery and tasting room specializing in clean, approachable beers with exceptional quality.",
                49.2827,
                -123.1207,
                "Vancouver Winter Ale Festival 2025",
                "beverage",
                Some("D30"),
                true,
                vec!["Clean", "Modern", "Quality"],
            ),
            (
                "Parallel 49 Brewing",
                "hello@parallel49brewing.com",
                "604-558-2739",
                "Vancouver, BC",
                "brewery",
                "Creative craft brewery pushing boundaries with bold flavors and innovative brewing techniques.",
                49.2828,
                -123.1206,
                "Vancouver Winter Ale Festival 2025",
                "beverage",
                Some("D32"),
                true,
                vec!["Bold", "Innovative", "Craft"],
            ),
        ];

        for (name, email, phone, operating_out_of, vendor_type, description, latitude, longitude,
             event_name, category, booth, is_featured, tags) in vendors_data {

            // First, get the event_id for this vendor
            let event_id_sql = r#"
                SELECT id FROM event WHERE name = $1
            "#;

            let event_id_stmt = sea_orm::Statement::from_sql_and_values(
                sea_orm::DatabaseBackend::Postgres,
                event_id_sql,
                vec![sea_orm::Value::String(Some(Box::new(event_name.to_owned())))],
            );

            let event_result = db.query_one(event_id_stmt).await?;
            let event_id: i32 = match event_result {
                Some(row) => row.try_get("", "id")?,
                None => continue, // Skip if event not found
            };

            // Insert the vendor
            let insert_sql = r#"
                INSERT INTO vendor (
                    name, email, phone, operating_out_of, vendor_type, description,
                    latitude, longitude, event_id, category, booth, is_featured, tags,
                    created_at, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
            "#;

            let mut values = vec![
                sea_orm::Value::String(Some(Box::new(name.to_owned()))),
                sea_orm::Value::String(Some(Box::new(email.to_owned()))),
                sea_orm::Value::String(Some(Box::new(phone.to_owned()))),
                sea_orm::Value::String(Some(Box::new(operating_out_of.to_owned()))),
                sea_orm::Value::String(Some(Box::new(vendor_type.to_owned()))),
                sea_orm::Value::String(Some(Box::new(description.to_owned()))),
                sea_orm::Value::Double(Some(latitude)),
                sea_orm::Value::Double(Some(longitude)),
                sea_orm::Value::Int(Some(event_id)),
                sea_orm::Value::String(Some(Box::new(category.to_owned()))),
            ];

            // Handle optional booth
            if let Some(b) = booth {
                values.push(sea_orm::Value::String(Some(Box::new(b.to_owned()))));
            } else {
                values.push(sea_orm::Value::String(None));
            }

            values.push(sea_orm::Value::Bool(Some(is_featured)));

            // Convert tags Vec<&str> to PostgreSQL array
            let tags_vec: Vec<sea_orm::Value> = tags.into_iter()
                .map(|tag| sea_orm::Value::String(Some(Box::new(tag.to_string()))))
                .collect();
            values.push(sea_orm::Value::Array(
                sea_orm::sea_query::ArrayType::String,
                Some(Box::new(tags_vec))
            ));

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

        // Delete all seeded vendors
        let vendor_names = vec![
            "Hopworks Urban Brewery",
            "Deschutes Brewery",
            "The Rolling Pin Food Truck",
            "BrewGear Co",
            "Fremont Brewing",
            "Pike Brewing Company",
            "Pacific Pretzels",
            "Ninkasi Brewing Company",
            "Oakshire Brewing",
            "Farm Fresh Bites",
            "33 Acres Brewing Company",
            "Parallel 49 Brewing",
        ];

        for name in vendor_names {
            let delete_sql = r#"
                DELETE FROM vendor
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
