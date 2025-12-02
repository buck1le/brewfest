use migration::sea_orm::{DatabaseConnection, Set, ActiveModelTrait};
use entities::event;

// seed event data 
pub async fn seed_events(db: &DatabaseConnection) -> anyhow::Result<()> {
    let events_data = vec![
        ("Spring Brewfest 2025", "2025-03-15", "2025-03-17"),
        ("Summer Brewfest 2025", "2025-06-20", "2025-06-22"),
        ("Fall Brewfest 2025", "2025-09-10", "2025-09-12"),
    ];

    let mut results = Vec::new();

    for (name, start, end) in events_data {
        let event = event::ActiveModel {
            name: Set(name.to_string()),
            description: Set(format!("{} - A great brewing festival", name)),
            start_date: Set(chrono::NaiveDate::parse_from_str(start, "%Y-%m-%d").unwrap()),
            end_date: Set(chrono::NaiveDate::parse_from_str(end, "%Y-%m-%d").unwrap()),
            latitude: Set(45.5231),
            longitude: Set(-122.6765),
            ..Default::default()
        };

        results.push(event.insert(db).await.expect("Failed to seed event"));
    };

    Ok(())
}
