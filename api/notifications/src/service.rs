use std::sync::Arc;

use anyhow::{Context, Result};
use entities::{device_token, event_subscription, notification, notification_delivery};
use fcm_service::{FcmMessage, FcmNotification, FcmService, Target};
use sea_orm::{prelude::*, sea_query::Expr, *};
use tracing::{error, info, warn};

pub struct NotificationService {
    fcm_service: FcmService,
    db: Arc<DatabaseConnection>,
}

impl NotificationService {
    /// Create a new NotificationService
    ///
    /// # Arguments
    /// * `service_account_path` - Path to Firebase service account JSON file
    /// * `db` - Database connection
    pub async fn new(service_account_path: String, db: Arc<DatabaseConnection>) -> Result<Self> {
        let fcm_service = FcmService::new(&service_account_path);

        Ok(Self { fcm_service, db })
    }

    /// Send notification to all devices subscribed to an event
    ///
    /// # Arguments
    /// * `event_id` - The event ID to send notifications for
    /// * `title` - Notification title
    /// * `body` - Notification body text
    /// * `notification_type` - Type of notification (e.g., "vendor_update", "schedule_change")
    /// * `related_entity_type` - Optional entity type (e.g., "vendor", "schedule_item")
    /// * `related_entity_id` - Optional entity ID
    pub async fn notify_event_attendees(
        &self,
        event_id: i32,
        title: &str,
        body: &str,
        notification_type: &str,
        related_entity_type: Option<&str>,
        related_entity_id: Option<i32>,
    ) -> Result<notification::Model> {
        // Create notification record
        let notification_record = self
            .create_notification_record(
                event_id,
                title,
                body,
                notification_type,
                related_entity_type,
                related_entity_id,
            )
            .await?;

        // Get all device tokens subscribed to this event
        let device_tokens = self.get_subscribed_devices(event_id).await?;

        info!(
            "Sending notification {} to {} devices for event {}",
            notification_record.id,
            device_tokens.len(),
            event_id
        );

        // Send to all subscribed devices (async, non-blocking)
        self.send_to_devices(notification_record.id, &device_tokens, title, body)
            .await;

        Ok(notification_record)
    }

    /// Send notification about a specific vendor update
    ///
    /// # Arguments
    /// * `event_id` - The event ID
    /// * `vendor_id` - The vendor ID that was updated
    /// * `title` - Notification title
    /// * `body` - Notification body text
    pub async fn notify_vendor_update(
        &self,
        event_id: i32,
        vendor_id: i32,
        title: &str,
        body: &str,
    ) -> Result<notification::Model> {
        self.notify_event_attendees(
            event_id,
            title,
            body,
            "vendor_update",
            Some("vendor"),
            Some(vendor_id),
        )
        .await
    }

    /// Get all active device tokens subscribed to an event
    async fn get_subscribed_devices(
        &self,
        event_id: i32,
    ) -> Result<Vec<device_token::Model>> {
        // Query event subscriptions with their related device tokens
        let subscriptions_with_tokens = event_subscription::Entity::find()
            .filter(event_subscription::Column::EventId.eq(event_id))
            .filter(event_subscription::Column::IsActive.eq(true))
            .find_also_related(device_token::Entity)
            .all(&*self.db)
            .await
            .context("Failed to fetch event subscriptions")?;

        // Extract device tokens and filter for active ones
        let active_tokens: Vec<device_token::Model> = subscriptions_with_tokens
            .into_iter()
            .filter_map(|(_subscription, token)| token) // Extract Option<DeviceToken>
            .filter(|token| token.is_active) // Only active device tokens
            .collect();

        Ok(active_tokens)
    }

    /// Create a notification record in the database
    async fn create_notification_record(
        &self,
        event_id: i32,
        title: &str,
        body: &str,
        notification_type: &str,
        related_entity_type: Option<&str>,
        related_entity_id: Option<i32>,
    ) -> Result<notification::Model> {
        let new_notification = notification::ActiveModel {
            event_id: Set(Some(event_id)),
            title: Set(title.to_string()),
            body: Set(body.to_string()),
            notification_type: Set(notification_type.to_string()),
            related_entity_type: Set(related_entity_type.map(String::from)),
            related_entity_id: Set(related_entity_id),
            target_user_id: Set(None),
            status: Set("sending".to_string()),
            sent_at: Set(Some(chrono::Utc::now().naive_utc())),
            failed_reason: Set(None),
            ..Default::default()
        };

        new_notification
            .insert(&*self.db)
            .await
            .context(format!(
                "Failed to create notification record (type: {}, event: {})",
                notification_type, event_id
            ))
    }

    /// Send notifications to a list of device tokens
    async fn send_to_devices(
        &self,
        notification_id: i32,
        tokens: &[device_token::Model],
        title: &str,
        body: &str,
    ) {
        let mut success_count = 0;
        let mut failure_count = 0;

        for token in tokens {
            let result = self
                .send_single_notification(&token.token, title, body)
                .await;

            match result {
                Ok(fcm_message_id) => {
                    success_count += 1;
                    info!(
                        "Sent notification to device token {} (FCM ID: {})",
                        token.id, fcm_message_id
                    );

                    // Record successful delivery
                    let delivery = notification_delivery::ActiveModel {
                        notification_id: Set(notification_id),
                        device_token_id: Set(token.id),
                        status: Set("sent".to_string()),
                        delivered_at: Set(Some(chrono::Utc::now().naive_utc())),
                        fcm_message_id: Set(Some(fcm_message_id)),
                        error_code: Set(None),
                        error_message: Set(None),
                        clicked_at: Set(None),
                        ..Default::default()
                    };

                    if let Err(e) = delivery.insert(&*self.db).await {
                        error!("Failed to record delivery: {}", e);
                    }
                }
                Err(e) => {
                    failure_count += 1;
                    warn!("Failed to send notification to token {}: {}", token.id, e);

                    let error_str = e.to_string();

                    // Record failed delivery
                    let delivery = notification_delivery::ActiveModel {
                        notification_id: Set(notification_id),
                        device_token_id: Set(token.id),
                        status: Set("failed".to_string()),
                        delivered_at: Set(None),
                        fcm_message_id: Set(None),
                        error_code: Set(Some("FCM_ERROR".to_string())),
                        error_message: Set(Some(error_str.clone())),
                        clicked_at: Set(None),
                        ..Default::default()
                    };

                    if let Err(e) = delivery.insert(&*self.db).await {
                        error!("Failed to record failed delivery: {}", e);
                    }

                    // Deactivate token if it's invalid/unregistered
                    if error_str.contains("UNREGISTERED")
                        || error_str.contains("INVALID")
                        || error_str.contains("NotFound")
                    {
                        self.deactivate_token(token.id).await;
                    }
                }
            }
        }

        info!(
            "Notification {} complete: {} sent, {} failed",
            notification_id, success_count, failure_count
        );

        // Update notification status
        if failure_count == 0 {
            self.update_notification_status(notification_id, "sent", None)
                .await;
        } else if success_count == 0 {
            self.update_notification_status(
                notification_id,
                "failed",
                Some("All deliveries failed"),
            )
            .await;
        } else {
            self.update_notification_status(
                notification_id,
                "partial",
                Some(&format!(
                    "{} sent, {} failed",
                    success_count, failure_count
                )),
            )
            .await;
        }
    }

    /// Send a single FCM notification
    async fn send_single_notification(
        &self,
        device_token: &str,
        title: &str,
        body: &str,
    ) -> Result<String> {
        let mut message = FcmMessage::new();
        let mut notification = FcmNotification::new();

        notification.set_title(title.to_string());
        notification.set_body(body.to_string());

        message.set_notification(Some(notification));
        message.set_target(Target::Token(device_token.to_string()));

        // Send via FCM
        self.fcm_service
            .send_notification(message)
            .await
            .map_err(|e| anyhow::anyhow!("Failed to send FCM notification: {}", e))?;

        // fcm-service doesn't return a message ID, so generate a placeholder
        // In production you might want to extract this from FCM response if available
        Ok(format!("fcm_{}", chrono::Utc::now().timestamp_millis()))
    }

    /// Deactivate an invalid device token
    async fn deactivate_token(&self, token_id: i32) {
        let update = device_token::ActiveModel {
            id: Set(token_id),
            is_active: Set(false),
            ..Default::default()
        };

        match update.update(&*self.db).await {
            Ok(_) => info!("Deactivated invalid token {}", token_id),
            Err(e) => error!("Failed to deactivate token {}: {}", token_id, e),
        }
    }

    /// Update notification status
    async fn update_notification_status(
        &self,
        notification_id: i32,
        status: &str,
        failed_reason: Option<&str>,
    ) {
        let update = notification::ActiveModel {
            id: Set(notification_id),
            status: Set(status.to_string()),
            failed_reason: Set(failed_reason.map(String::from)),
            ..Default::default()
        };

        if let Err(e) = update.update(&*self.db).await {
            error!("Failed to update notification status: {}", e);
        }
    }

    /// Subscribe a device to an event
    ///
    /// # Arguments
    /// * `device_token_id` - The device token ID to subscribe
    /// * `event_id` - The event ID to subscribe to
    pub async fn subscribe_device(
        &self,
        device_token_id: i32,
        event_id: i32,
    ) -> Result<event_subscription::Model> {
        let subscription = event_subscription::ActiveModel {
            device_token_id: Set(device_token_id),
            event_id: Set(event_id),
            is_active: Set(true),
            subscribed_at: Set(chrono::Utc::now().naive_utc()),
            unsubscribed_at: Set(None),
            ..Default::default()
        };

        subscription
            .insert(&*self.db)
            .await
            .context("Failed to create event subscription")
    }

    /// Unsubscribe a device from an event
    ///
    /// # Arguments
    /// * `device_token_id` - The device token ID to unsubscribe
    /// * `event_id` - The event ID to unsubscribe from
    pub async fn unsubscribe_device(
        &self,
        device_token_id: i32,
        event_id: i32,
    ) -> Result<()> {
        event_subscription::Entity::update_many()
            .filter(event_subscription::Column::DeviceTokenId.eq(device_token_id))
            .filter(event_subscription::Column::EventId.eq(event_id))
            .col_expr(event_subscription::Column::IsActive, Expr::value(false))
            .col_expr(
                event_subscription::Column::UnsubscribedAt,
                Expr::value(chrono::Utc::now().naive_utc()),
            )
            .exec(&*self.db)
            .await
            .context("Failed to unsubscribe device")?;

        Ok(())
    }
}
