use serde_json::{json, Value};

pub mod schedule;
pub mod index;

pub struct Partial {
    event: entities::events::Model,
}

impl Partial {
    pub fn new(event: entities::events::Model) -> Self {
        Self { event }
    }

    pub fn render(&self) -> Value {
        json!({
            "id": self.event.id,
            "name": self.event.name,
            "description": self.event.description,
            "start_date": self.event.start_date,
            "end_date": self.event.end_date,
            "resources": {
                "schedule_items": {
                    "href": format!("/events/{}/schedule_items", self.event.id),
                },
            }
        })
    }
}
