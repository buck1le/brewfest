use serde::Serialize;
use serde_json::Value;

use crate::utils::s3_url;

pub mod images;
pub mod inventory;
pub mod presenter;

pub use presenter::Presenter;

use entities::vendor::Model as Vendor;
use entities::vendor_image::Model as VendorImage;

pub struct Partial {
    vendor: Vendor,
    images: Vec<VendorImage>,
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
    images: Vec<String>,
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
    pub fn new(vendor: Vendor, images: Vec<VendorImage>) -> Self {
        Self { vendor, images }
    }

    pub fn render(self) -> Value {
        let image_urls: Vec<String> = self.images
            .into_iter()
            .map(|image| s3_url::generate_s3_url(&image.url))
            .collect();

        let response = VendorResponse {
            id: self.vendor.id,
            name: self.vendor.name,
            vendor_type: self.vendor.vendor_type,
            booth: self.vendor.booth,
            description: self.vendor.description,
            category: self.vendor.category,
            location: self.vendor.operating_out_of,
            thumbnail: s3_url::key_to_url(self.vendor.thumbnail),
            images: image_urls,
            tags: self.vendor.tags,
            is_featured: self.vendor.is_featured,
            resources: Resources {
                self_link: format!(
                    "/api/v1/events/{}/vendors/{}",
                    self.vendor.event_id, self.vendor.id
                ),
                inventory: format!(
                    "/api/v1/events/{}/vendors/{}/inventory",
                    self.vendor.event_id, self.vendor.id
                ),
            },
        };

        serde_json::to_value(response).unwrap()
    }
}
