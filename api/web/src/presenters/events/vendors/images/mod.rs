use serde_json::{json, Value};

pub mod presenter;

pub use presenter::Presenter;

pub struct Partial {
    image: entities::vendor_images::Model,
}

impl Partial {
    pub fn new(image: entities::vendor_images::Model) -> Self {
        Self { image }
    }

    pub fn render(&self) -> Value {
        json!({
            "id": self.image.id,
            "vendor_id": self.image.vendor_id,
            "url": self.image.url,
            "text": self.image.text,
        })
    }
}
