use serde::Serialize;
use serde_json::Value;

pub struct Partial<'a> {
    inventory_item: &'a entities::vendor_inventory_item::Model,
}

pub mod presenter;

pub use presenter::Presenter;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ResourceLink {
    href: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct Resources {
    vendor: ResourceLink,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct VendorInventoryItemResponse {
    id: i32,
    name: String,
    category: String,
    vendor_id: i32,
    thumbnail: Option<String>,
    resources: Resources,
}

impl<'a> Partial<'a> {
    pub fn new(inventory_item: &'a entities::vendor_inventory_item::Model) -> Self {
        Self { inventory_item }
    }

    pub fn render(&self) -> Value {
        let response = VendorInventoryItemResponse {
            id: self.inventory_item.id,
            name: self.inventory_item.name.clone(),
            category: self.inventory_item.category.clone(),
            thumbnail: self.inventory_item.thumbnail.clone(),
            vendor_id: self.inventory_item.vendor_id,
            resources: Resources {
                vendor: ResourceLink {
                    href: format!(
                        "/events/{}/vendors/{}",
                        self.inventory_item.event_id, self.inventory_item.vendor_id
                    ),
                },
            },
        };

        serde_json::to_value(response).unwrap()
    }
}
