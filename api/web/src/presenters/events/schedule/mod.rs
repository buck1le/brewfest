use serde_json::{json, Value};

pub mod index;

pub struct Partial {
    schedule_item: entities::schedule_items::Model,
}

impl Partial {
    pub fn new(schedule_item: entities::schedule_items::Model) -> Self {
        Self { schedule_item }
    }

    pub fn render(&self) -> Value {
        json!({
            "id": self.schedule_item.id,
            "title": self.schedule_item.title,
            "description": self.schedule_item.description,
            "start_date": self.schedule_item.start_date,
            "end_date": self.schedule_item.end_date,
            "created_at": self.schedule_item.created_at,
            "updated_at": self.schedule_item.updated_at,
            "event_id": self.schedule_item.event_id,
            "resources": {
                "images": {
                    "href": format!("/events/{}/schedule_items/{}/images",
                        self.schedule_item.event_id,
                        self.schedule_item.id
                        ),
                },
            }
        })
    }
}
