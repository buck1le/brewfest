use serde_json::{json, Value};

pub mod index;

pub struct Partial {
    image: entities::schedule_images::Model,
}

impl Partial {
    pub fn new(image: entities::schedule_images::Model) -> Self {
        Self { image }
    }

    pub fn render(&self) -> Value {
        json!({
            "id": self.image.id,
            "schedule_image_id": self.image.schedule_item_id,
            "url": self.image.url,
            "text": self.image.text,
        })
    }
}
