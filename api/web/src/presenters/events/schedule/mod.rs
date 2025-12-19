use serde::Serialize;
use serde_json::Value;

use crate::utils::s3_url;

pub mod images;
pub mod presenter;

pub use presenter::Presenter;

pub struct Partial<'a> {
    schedule_item: &'a entities::schedule_item::Model,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ScheduleItemResponse {
    id: i32,
    title: String,
    description: String,
    start_date: String,
    end_date: String,
    created_at: String,
    updated_at: String,
    event_id: i32,
    thumbnail: Option<String>,
    resources: Resources,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Resources {
    images: ResourceLink,
    thumbnail: ResourceLink,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ResourceLink {
    href: String,
}

impl<'a> Partial<'a> {
    pub fn new(schedule_item: &'a entities::schedule_item::Model) -> Self {
        Self { schedule_item }
    }

    pub fn render(&self) -> Value {
        let response = ScheduleItemResponse {
            id: self.schedule_item.id,
            title: self.schedule_item.title.clone(),
            description: self.schedule_item.description.clone(),
            start_date: self.schedule_item.start_date.to_string(),
            end_date: self.schedule_item.end_date.to_string(),
            created_at: self.schedule_item.created_at.to_string(),
            updated_at: self.schedule_item.updated_at.to_string(),
            event_id: self.schedule_item.event_id,
            thumbnail: s3_url::key_to_url(self.schedule_item.thumbnail.clone()),
            resources: Resources {
                images: ResourceLink {
                    href: format!(
                        "/events/{}/schedule/{}/images",
                        self.schedule_item.event_id, self.schedule_item.id
                    ),
                },
                thumbnail: ResourceLink {
                    href: format!(
                        "/events/{}/schedule/{}/thumbnail",
                        self.schedule_item.event_id, self.schedule_item.id
                    ),
                },
            },
        };

        serde_json::to_value(response).unwrap()
    }
}
