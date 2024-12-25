use serde::Serialize;
use serde_json::Value;

pub mod presenter;
pub mod schedule;
pub mod vendors;

pub use presenter::Presenter;

pub struct Partial<'a> {
    event: &'a entities::events::Model,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct EventResponse {
    id: i32,
    name: String,
    description: String,
    start_date: String,
    end_date: String,
    thumbnail: Option<String>,
    resources: Resources,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Resources {
    schedule_items: ResourceLink,
    vendors: ResourceLink,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ResourceLink {
    href: String,
}

impl<'a> Partial<'a> {
    pub fn new(event: &'a entities::events::Model) -> Self {
        Self { event }
    }

    pub fn render(&self) -> Value {
        let response = EventResponse {
            id: self.event.id,
            name: self.event.name.clone(),
            description: self.event.description.clone(),
            start_date: self.event.start_date.to_string(),
            end_date: self.event.end_date.to_string(),
            thumbnail: self.event.thumbnail.clone(),
            resources: Resources {
                schedule_items: ResourceLink {
                    href: format!("/events/{}/schedule_items", self.event.id),
                },
                vendors: ResourceLink {
                    href: format!("/events/{}/vendors", self.event.id),
                }
            },
        };

        serde_json::to_value(response).unwrap()
    }
}
