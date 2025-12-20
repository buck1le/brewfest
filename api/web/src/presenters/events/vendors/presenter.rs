use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::Value;
use std::collections::HashMap;

use crate::presenters::events::vendors::Partial as VendorPartial;
use entities::vendor::Model as Vendor;
use entities::vendor_image::Model as VendorImage;

pub struct Presenter {
    vendors: Vec<Vendor>,
    images_by_vendor: HashMap<i32, Vec<VendorImage>>,
}

impl Presenter {
    pub fn new(vendors: Vec<Vendor>, images_by_vendor: HashMap<i32, Vec<VendorImage>>) -> Self {
        Self { vendors, images_by_vendor }
    }

    pub fn render(self) -> Result<impl IntoResponse, (StatusCode, String)> {
        let item_json: Vec<Value> = self.vendors
            .into_iter()
            .map(|vendor| {
                let images = self.images_by_vendor
                    .get(&vendor.id)
                    .cloned()
                    .unwrap_or_default();
                VendorPartial::new(vendor, images).render()
            })
            .collect();

        Ok(Json(item_json).into_response())
    }
}


