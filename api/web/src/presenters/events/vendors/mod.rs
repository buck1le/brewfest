use serde::Serialize;
use serde_json::Value;

pub mod images;
pub mod inventory;
pub mod presenter;

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
    description: String,
    created_at: String,
    updated_at: String,
    event_id: i32,
    thumbnail: Option<String>,
    operating_out_of: String,
    coordinates: Coordinates,
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
    thumbnail: ResourceLink,
    inventory: ResourceLink,
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
            description: self.vendor.description.clone(),
            phone: self.vendor.phone.clone(),
            created_at: self.vendor.created_at.to_string(),
            updated_at: self.vendor.updated_at.to_string(),
            thumbnail: self.vendor.thumbnail.clone(),
            category: self.vendor.category.clone(),
            event_id: self.vendor.event_id,
            operating_out_of: self.vendor.operating_out_of.clone(),
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
                thumbnail: ResourceLink {
                    href: format!(
                        "/events/{}/vendors/{}/thumbnail",
                        self.vendor.event_id, self.vendor.id
                    ),
                },
                inventory: ResourceLink {
                    href: format!(
                        "/events/{}/vendors/{}/inventory",
                        self.vendor.event_id, self.vendor.id
                    ),
                },
            },
        };

        serde_json::to_value(response).unwrap()
    }
}
