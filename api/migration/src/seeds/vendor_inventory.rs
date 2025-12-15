use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        // Inventory items: (name, category, vendor_name, event_name, thumbnail)
        let inventory_items = vec![
            // Hopworks Urban Brewery (Portland Spring Brewfest)
            ("Hopworks IPA", "drink", "Hopworks Urban Brewery", "Portland Spring Brewfest 2025", Some("https://example.com/hopworks-ipa.jpg")),
            ("Velvet ESB", "drink", "Hopworks Urban Brewery", "Portland Spring Brewfest 2025", Some("https://example.com/velvet-esb.jpg")),
            ("Totally Radler", "drink", "Hopworks Urban Brewery", "Portland Spring Brewfest 2025", None),
            ("Organic Pale Ale", "drink", "Hopworks Urban Brewery", "Portland Spring Brewfest 2025", None),

            // Deschutes Brewery (Portland Spring Brewfest)
            ("Black Butte Porter", "drink", "Deschutes Brewery", "Portland Spring Brewfest 2025", Some("https://example.com/black-butte.jpg")),
            ("Fresh Squeezed IPA", "drink", "Deschutes Brewery", "Portland Spring Brewfest 2025", Some("https://example.com/fresh-squeezed.jpg")),
            ("Mirror Pond Pale Ale", "drink", "Deschutes Brewery", "Portland Spring Brewfest 2025", None),
            ("Obsidian Stout", "drink", "Deschutes Brewery", "Portland Spring Brewfest 2025", None),

            // The Rolling Pin Food Truck (Portland Spring Brewfest)
            ("Pastrami Sandwich", "food", "The Rolling Pin Food Truck", "Portland Spring Brewfest 2025", Some("https://example.com/pastrami.jpg")),
            ("Grilled Cheese Deluxe", "food", "The Rolling Pin Food Truck", "Portland Spring Brewfest 2025", None),
            ("Craft Beer Bratwurst", "food", "The Rolling Pin Food Truck", "Portland Spring Brewfest 2025", None),

            // BrewGear Co (Portland Spring Brewfest)
            ("Pint Glass Set", "merchandise", "BrewGear Co", "Portland Spring Brewfest 2025", Some("https://example.com/pint-glass.jpg")),
            ("Brewfest T-Shirt", "merchandise", "BrewGear Co", "Portland Spring Brewfest 2025", None),
            ("Bottle Opener Keychain", "merchandise", "BrewGear Co", "Portland Spring Brewfest 2025", None),

            // Fremont Brewing (Seattle Summer Beer Festival)
            ("Summer Ale", "drink", "Fremont Brewing", "Seattle Summer Beer Festival 2025", Some("https://example.com/summer-ale.jpg")),
            ("Universale Pale Ale", "drink", "Fremont Brewing", "Seattle Summer Beer Festival 2025", None),
            ("Lush IPA", "drink", "Fremont Brewing", "Seattle Summer Beer Festival 2025", Some("https://example.com/lush-ipa.jpg")),
            ("B-Bomb", "drink", "Fremont Brewing", "Seattle Summer Beer Festival 2025", None),

            // Pike Brewing Company (Seattle Summer Beer Festival)
            ("Pike IPA", "drink", "Pike Brewing Company", "Seattle Summer Beer Festival 2025", Some("https://example.com/pike-ipa.jpg")),
            ("Kilt Lifter", "drink", "Pike Brewing Company", "Seattle Summer Beer Festival 2025", None),
            ("Naughty Nellie", "drink", "Pike Brewing Company", "Seattle Summer Beer Festival 2025", None),
            ("Space Needle Golden Ale", "drink", "Pike Brewing Company", "Seattle Summer Beer Festival 2025", None),

            // Pacific Pretzels (Seattle Summer Beer Festival)
            ("Traditional Bavarian Pretzel", "food", "Pacific Pretzels", "Seattle Summer Beer Festival 2025", Some("https://example.com/bavarian-pretzel.jpg")),
            ("Cheese Stuffed Pretzel", "food", "Pacific Pretzels", "Seattle Summer Beer Festival 2025", None),
            ("Cinnamon Sugar Pretzel", "food", "Pacific Pretzels", "Seattle Summer Beer Festival 2025", None),

            // Ninkasi Brewing Company (Oregon Fall Harvest Brewfest)
            ("Tricerahops IPA", "drink", "Ninkasi Brewing Company", "Oregon Fall Harvest Brewfest 2025", Some("https://example.com/tricerahops.jpg")),
            ("Total Domination IPA", "drink", "Ninkasi Brewing Company", "Oregon Fall Harvest Brewfest 2025", Some("https://example.com/total-dom.jpg")),
            ("Fresh Hop IPA", "drink", "Ninkasi Brewing Company", "Oregon Fall Harvest Brewfest 2025", None),
            ("Oktoberfest Lager", "drink", "Ninkasi Brewing Company", "Oregon Fall Harvest Brewfest 2025", None),

            // Oakshire Brewing (Oregon Fall Harvest Brewfest)
            ("Amber Ale", "drink", "Oakshire Brewing", "Oregon Fall Harvest Brewfest 2025", Some("https://example.com/amber-ale.jpg")),
            ("Watershed IPA", "drink", "Oakshire Brewing", "Oregon Fall Harvest Brewfest 2025", None),
            ("Hellshire I", "drink", "Oakshire Brewing", "Oregon Fall Harvest Brewfest 2025", None),
            ("Overcast Espresso Stout", "drink", "Oakshire Brewing", "Oregon Fall Harvest Brewfest 2025", Some("https://example.com/overcast.jpg")),

            // Farm Fresh Bites (Oregon Fall Harvest Brewfest)
            ("Farm Burger with Fries", "food", "Farm Fresh Bites", "Oregon Fall Harvest Brewfest 2025", Some("https://example.com/farm-burger.jpg")),
            ("Seasonal Veggie Bowl", "food", "Farm Fresh Bites", "Oregon Fall Harvest Brewfest 2025", None),
            ("Oregon Apple Crisp", "food", "Farm Fresh Bites", "Oregon Fall Harvest Brewfest 2025", None),

            // 33 Acres Brewing Company (Vancouver Winter Ale Festival)
            ("33 Acres of Darkness", "drink", "33 Acres Brewing Company", "Vancouver Winter Ale Festival 2025", Some("https://example.com/darkness.jpg")),
            ("33 Acres of Ocean", "drink", "33 Acres Brewing Company", "Vancouver Winter Ale Festival 2025", None),
            ("33 Acres of Life", "drink", "33 Acres Brewing Company", "Vancouver Winter Ale Festival 2025", None),
            ("33 Acres of Sunshine", "drink", "33 Acres Brewing Company", "Vancouver Winter Ale Festival 2025", None),

            // Parallel 49 Brewing (Vancouver Winter Ale Festival)
            ("Tricycle Radler", "drink", "Parallel 49 Brewing", "Vancouver Winter Ale Festival 2025", Some("https://example.com/tricycle.jpg")),
            ("Filthy Dirty IPA", "drink", "Parallel 49 Brewing", "Vancouver Winter Ale Festival 2025", None),
            ("Craft Lager", "drink", "Parallel 49 Brewing", "Vancouver Winter Ale Festival 2025", None),
            ("Russian Imperial Stout", "drink", "Parallel 49 Brewing", "Vancouver Winter Ale Festival 2025", Some("https://example.com/russian-stout.jpg")),
        ];

        for (name, category, vendor_name, event_name, thumbnail) in inventory_items {
            // Get vendor_id and event_id
            let vendor_query_sql = r#"
                SELECT v.id as vendor_id, v.event_id
                FROM vendor v
                JOIN event e ON v.event_id = e.id
                WHERE v.name = $1 AND e.name = $2
            "#;

            let vendor_stmt = sea_orm::Statement::from_sql_and_values(
                sea_orm::DatabaseBackend::Postgres,
                vendor_query_sql,
                vec![
                    sea_orm::Value::String(Some(Box::new(vendor_name.to_owned()))),
                    sea_orm::Value::String(Some(Box::new(event_name.to_owned()))),
                ],
            );

            let vendor_result = db.query_one(vendor_stmt).await?;

            let (vendor_id, event_id) = match vendor_result {
                Some(row) => {
                    let vendor_id: i32 = row.try_get("", "vendor_id")?;
                    let event_id: i32 = row.try_get("", "event_id")?;
                    (vendor_id, event_id)
                }
                None => continue, // Skip if vendor/event not found
            };

            // Insert the inventory item
            let insert_sql = r#"
                INSERT INTO vendor_inventory_item (name, category, vendor_id, event_id, thumbnail)
                VALUES ($1, $2, $3, $4, $5)
            "#;

            let mut values = vec![
                sea_orm::Value::String(Some(Box::new(name.to_owned()))),
                sea_orm::Value::String(Some(Box::new(category.to_owned()))),
                sea_orm::Value::Int(Some(vendor_id)),
                sea_orm::Value::Int(Some(event_id)),
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

        // Delete all seeded inventory items by matching vendor names
        let delete_sql = r#"
            DELETE FROM vendor_inventory_item
            WHERE vendor_id IN (
                SELECT id FROM vendor
                WHERE name IN (
                    'Hopworks Urban Brewery',
                    'Deschutes Brewery',
                    'The Rolling Pin Food Truck',
                    'BrewGear Co',
                    'Fremont Brewing',
                    'Pike Brewing Company',
                    'Pacific Pretzels',
                    'Ninkasi Brewing Company',
                    'Oakshire Brewing',
                    'Farm Fresh Bites',
                    '33 Acres Brewing Company',
                    'Parallel 49 Brewing'
                )
            )
        "#;

        let stmt = sea_orm::Statement::from_sql_and_values(
            sea_orm::DatabaseBackend::Postgres,
            delete_sql,
            vec![],
        );

        let _ = db.execute(stmt).await?;

        Ok(())
    }
}
