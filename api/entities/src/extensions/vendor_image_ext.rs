use crate::vendor_image::{self, Entity as VendorImage, ActiveModel};
use crate::{event, vendor};
use sea_orm::*;

/// Extension trait for VendorImage entity
/// Contains custom business logic that won't be overwritten by entity generation
#[async_trait::async_trait]
pub trait VendorImageExt {
    /// Create a new ActiveModel for vendor image
    fn new_active_model(vendor_id: i32, key: &str, text: &str) -> ActiveModel;

    /// Create a vendor image with validation
    async fn create_vendor_image(
        db: &DatabaseConnection,
        event_id: i32,
        vendor_id: i32,
        key: &str,
        text: &str,
    ) -> Result<vendor_image::Model, DbErr>;
}

#[async_trait::async_trait]
impl VendorImageExt for VendorImage {
    fn new_active_model(vendor_id: i32, key: &str, text: &str) -> ActiveModel {
        ActiveModel {
            vendor_id: Set(vendor_id),
            url: Set(key.to_string()),
            text: Set(text.to_string()),
            ..Default::default()
        }
    }

    async fn create_vendor_image(
        db: &DatabaseConnection,
        event_id: i32,
        vendor_id: i32,
        key: &str,
        text: &str,
    ) -> Result<vendor_image::Model, DbErr> {
        // Validate that event exists and vendor belongs to that event
        event::Entity::find_by_id(event_id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound(String::from("Event not found")))?
            .find_related(vendor::Entity)
            .filter(vendor::Column::Id.eq(vendor_id))
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound(String::from("Vendor not found")))?;

        // Create and insert the new image, returning the full model
        let new_image = Self::new_active_model(vendor_id, key, text);
        new_image.insert(db).await
    }
}
