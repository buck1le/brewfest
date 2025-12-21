use crate::schedule_image::{self, Entity as ScheduleImage, ActiveModel};
use crate::{event, schedule_item};
use sea_orm::*;

/// Extension trait for ScheduleImage entity
/// Contains custom business logic that won't be overwritten by entity generation
#[async_trait::async_trait]
pub trait ScheduleImageExt {
    /// Create a new ActiveModel for schedule image
    fn new_active_model(schedule_item_id: i32, key: &str, text: &str) -> ActiveModel;

    /// Create a schedule image with validation
    async fn create_schedule_image(
        db: &DatabaseConnection,
        event_id: i32,
        schedule_item_id: i32,
        key: &str,
        text: &str,
    ) -> Result<schedule_image::Model, DbErr>;
}

#[async_trait::async_trait]
impl ScheduleImageExt for ScheduleImage {
    fn new_active_model(schedule_item_id: i32, key: &str, text: &str) -> ActiveModel {
        ActiveModel {
            schedule_item_id: Set(schedule_item_id),
            url: Set(key.to_string()),
            text: Set(text.to_string()),
            ..Default::default()
        }
    }

    async fn create_schedule_image(
        db: &DatabaseConnection,
        event_id: i32,
        schedule_item_id: i32,
        key: &str,
        text: &str,
    ) -> Result<schedule_image::Model, DbErr> {
        // Validate that event exists and schedule item belongs to that event
        event::Entity::find_by_id(event_id)
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound(String::from("Event not found")))?
            .find_related(schedule_item::Entity)
            .filter(schedule_item::Column::Id.eq(schedule_item_id))
            .one(db)
            .await?
            .ok_or(DbErr::RecordNotFound(String::from("Schedule item not found")))?;

        // Create and insert the new image, returning the full model
        let new_image = Self::new_active_model(schedule_item_id, key, text);
        new_image.insert(db).await
    }
}
