use serde::Serialize;
use serde_json::Value;

pub struct Partial<'a> {
    inventory_item: &'a entities::vendor_inventory_items::Model,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct VendorInventoryItemResponse {
    id: i32,
    name: String,
    category: String,
    vendor_id: i32,
    thumbnail: Option<String>,
}

impl<'a> Partial<'a> {
    pub fn new(inventory_item: &'a entities::vendor_inventory_items::Model) -> Self {
        Self { inventory_item }
    }

    pub fn render(&self) -> Value {
        let response = VendorInventoryItemResponse {
            id: self.inventory_item.id,
            name: self.inventory_item.name.clone(),
            category: self.inventory_item.category.clone(),
            thumbnail: self.inventory_item.thumbnail.clone(),
            vendor_id: self.inventory_item.vendor_id,
        };

        serde_json::to_value(response).unwrap()
    }
}
