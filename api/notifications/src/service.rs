use std::sync::Arc;

use anyhow::{Context, Result};

use chrono::{DateTime, Utc};
use entities::{device_token, notification, notification_delivery};
use fcm_service::{FcmMessage, FcmService};
use sea_orm::*;
use sea_orm::{DatabaseConnection, Set};
use serde_json::Value as JsonValue;

pub struct NotificationsService {
    fcm_service: FcmService,
    db: Arc<DatabaseConnection>,
}

impl NotificationsService {
    pub async fn new(db: Arc<DatabaseConnection>) -> Result<Self> {
        let fcm_service = FcmService::new("config/firebase-service-account.json".to_string());

        Ok(Self { fcm_service, db })
    }

    pub async fn notify_event_attendees(
        &self,
        event_id: i32,
        title: &str,
        body: &str,
        data: Option<JsonValue>,
    ) -> Result<notification::Model, anyhow::Error> {
        let notification_recode = self
            .create_notification_record(event_id, None, title, body, data.clone())
            .await?;
    }

    async fn create_notification_record(
        &self,
        event_id: i32,
        vendor_id: Option<i32>,
        title: &str,
        body: &str,
        data: Option<JsonValue>,
    ) -> Result<notification::Model> {
        let new_notification = notification::ActiveModel {
            event_id: Set(Some(event_id)),
            title: Set(title.to_string()),
            body: Set(body.to_string()),
            sent_at: Set(Some(chrono::Utc::now().naive_utc())),
            ..Default::default()
        };

        new_notification.insert(&*self.db).await.context(format!(
            "Failed to create notification for event {}",
            event_id
        ))
    }
}
