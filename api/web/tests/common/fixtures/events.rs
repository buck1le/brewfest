use migration::sea_orm::{DatabaseConnection, Set};
use entities::events;

/// Seed a default test event
pub async fn seed_default_event(db: &DatabaseConnection) -> events::Model {
    let event = events::ActiveModel {
        name: Set("Test Brewfest 2025".to_string()),
        description: Set("Annual test brewing festival".to_string()),
        start_date: Set(chrono::NaiveDate::from_ymd_opt(2025, 6, 1).unwrap()),
        end_date: Set(chrono::NaiveDate::from_ymd_opt(2025, 6, 3).unwrap()),
        latitude: Set(45.5231),
        longitude: Set(-122.6765),
        ..Default::default()
    };

    event.insert(db).await.expect("Failed to seed event")
}

/// Seed multiple test events
pub async fn seed_events(db: &DatabaseConnection) -> Vec<events::Model> {
    let events_data = vec![
        ("Spring Brewfest 2025", "2025-03-15", "2025-03-17"),
        ("Summer Brewfest 2025", "2025-06-20", "2025-06-22"),
        ("Fall Brewfest 2025", "2025-09-10", "2025-09-12"),
    ];

    let mut results = Vec::new();

    for (name, start, end) in events_data {
        let event = events::ActiveModel {
            name: Set(name.to_string()),
            description: Set(format!("{} - A great brewing festival", name)),
            start_date: Set(chrono::NaiveDate::parse_from_str(start, "%Y-%m-%d").unwrap()),
            end_date: Set(chrono::NaiveDate::parse_from_str(end, "%Y-%m-%d").unwrap()),
            latitude: Set(45.5231),
            longitude: Set(-122.6765),
            ..Default::default()
        };

        results.push(event.insert(db).await.expect("Failed to seed event"));
    }

    results
}
