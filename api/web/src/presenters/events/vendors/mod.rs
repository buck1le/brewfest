use serde::Serialize;
use serde_json::Value;

pub mod presenter;
pub mod images;
pub use presenter::Presenter;

pub struct Partial<'a> {
    vendor: &'a entities::vendors::Model,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct VendorResponse {
    id: i32,
    name: String,
    email: String,
    phone: String,
    created_at: String,
    updated_at: String,
    event_id: i32,
    coordinates: Coordinates,
    image: Option<String>,
    category: Option<String>,
    resources: Resources,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Coordinates {
    latitude: f64,
    longitude: f64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Resources {
    images: ResourceLink,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ResourceLink {
    href: String,
}

impl<'a> Partial<'a> {
    pub fn new(vendor: &'a entities::vendors::Model) -> Self {
        Self { vendor }
    }

    pub fn render(&self) -> Value {
        let response = VendorResponse {
            id: self.vendor.id,
            name: self.vendor.name.clone(),
            email: self.vendor.email.clone(),
            phone: self.vendor.phone.clone(),
            created_at: self.vendor.created_at.to_string(),
            updated_at: self.vendor.updated_at.to_string(),
            category: self.vendor.category.clone(),
            event_id: self.vendor.event_id,
            image: self.vendor.image.clone(),
            coordinates: Coordinates {
                latitude: self.vendor.latitude,
                longitude: self.vendor.longitude,
            },
            resources: Resources {
                images: ResourceLink {
                    href: format!(
                        "/events/{}/vendors/{}/images",
                        self.vendor.event_id, self.vendor.id
                    ),
                },
            },
        };

        serde_json::to_value(response).unwrap()
    }
}
