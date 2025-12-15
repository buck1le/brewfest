use serde::Serialize;
use serde_json::Value;

pub mod images;
pub mod inventory;
pub mod presenter;

pub use presenter::Presenter;

use entities::vendor_image::Model as VendorImage;
use entities::vendor::Model as Vendor;

pub struct Partial {
    vendor: Vendor,
    images: Option<Vec<VendorImage>>,
}

impl Partial {
    pub fn with_images(vendor: Vendor, images: Vec<VendorImage>) -> Self {
        Self {
            vendor,
            images: Some(images),
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct VendorResponse {
    id: i32,
    name: String,
    #[serde(rename = "type")]
    vendor_type: Option<String>,
    category: Option<String>,
    booth: Option<String>,
    description: String,
    location: String,
    thumbnail: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    images: Option<Vec<String>>,
    tags: Vec<String>,
    is_featured: bool,
    resources: Resources,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Resources {
    #[serde(rename = "self")]
    self_link: String,
    inventory: String,
}

impl Partial {
    pub fn new(vendor: entities::vendor::Model) -> Self {
        Self { 
            vendor,
            images: None
        }
    }

    pub fn render(self) -> Value {
        let image_urls = self.images.map(|images| {
            images.into_iter().map(|image| image.url).collect()
        });

        let response = VendorResponse {
            id: self.vendor.id,
            name: self.vendor.name,
            vendor_type: self.vendor.vendor_type,
            booth: self.vendor.booth,
            description: self.vendor.description,
            category: self.vendor.category,
            location: self.vendor.operating_out_of,
            thumbnail: self.vendor.thumbnail,
            images: image_urls,
            tags: self.vendor.tags,
            is_featured: self.vendor.is_featured,
            resources: Resources {
                self_link: format!("/api/v1/events/{}/vendors/{}", self.vendor.event_id, self.vendor.id),
                inventory: format!("/api/v1/events/{}/vendors/{}/inventory", self.vendor.event_id, self.vendor.id),
            },
        };

        serde_json::to_value(response).unwrap()
    }
}
