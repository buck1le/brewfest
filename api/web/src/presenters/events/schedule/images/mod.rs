use serde_json::{json, Value};

pub mod presenter;

pub use presenter::Presenter;

pub struct Partial {
    image: entities::schedule_image::Model,
}

impl Partial {
    pub fn new(image: entities::schedule_image::Model) -> Self {
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
