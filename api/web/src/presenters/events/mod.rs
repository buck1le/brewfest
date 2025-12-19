use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::utils::s3_url;

pub mod presenter;
pub mod schedule;
pub mod vendors;

pub use presenter::Presenter;

pub struct Partial<'a> {
    event: &'a entities::event::Model,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct EventResponse {
    id: i32,
    name: String,
    description: String,
    start_date: String,
    end_date: String,
    location: Location,
    thumbnail: Option<String>,
    resources: Resources,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Resources {
    #[serde(rename = "self")]
    self_link: String,
    schedule: String,
    vendors: String,
    inventory: String,
    drinks: String,
    map: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Location {
    city: String,
    state: String,
    address: String,
    coordinates: Coordinates,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Coordinates {
    pub latitude: f64,
    pub longitude: f64,
}

impl<'a> Partial<'a> {
    pub fn new(event: &'a entities::event::Model) -> Self {
        Self { event }
    }

    pub fn render(&self) -> Value {
        let response = EventResponse {
            id: self.event.id,
            name: self.event.name.clone(),
            description: self.event.description.clone(),
            start_date: self.event.start_date.to_string(),
            end_date: self.event.end_date.to_string(),
            location: Location {
                city: self.event.city.clone(),
                state: self.event.state.clone(),
                address: self.event.address.clone(),
                coordinates: Coordinates {
                    latitude: self.event.latitude,
                    longitude: self.event.longitude,
                },
            },
            thumbnail: s3_url::key_to_url(self.event.thumbnail.clone()),
            resources: Resources {
                self_link: format!("/api/v1/events/{}", self.event.id),
                vendors: format!("/api/v1/events/{}/vendors", self.event.id),
                inventory: format!("/api/v1/events/{}/inventory", self.event.id),
                drinks: format!("/api/v1/events/{}/inventory?vendor_type=brewery", self.event.id),
                schedule: format!("/api/v1/events/{}/schedule", self.event.id),
                map: format!("/api/v1/events/{}/map", self.event.id),
            },
        };

        serde_json::to_value(response).unwrap()
    }
}
