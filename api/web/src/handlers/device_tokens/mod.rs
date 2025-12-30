use axum::{extract::Path, http::StatusCode, response::IntoResponse, Extension, Json};
use entities::*;
use notifications::NotificationService;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tracing::{error, info};

use entities::sea_orm::*;
use entities::device_token::Entity as DeviceToken;

/// Request body for registering a device token
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegisterDeviceTokenRequest {
    /// FCM/APNs token from the mobile device
    pub token: String,
    /// Platform: "ios" or "android"
    pub platform: String,
    /// Optional device identifier (for tracking multiple devices per user)
    pub device_id: Option<String>,
    /// Optional user ID (if user is logged in)
    pub user_id: Option<i32>,
}

/// Response body for device token operations
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeviceTokenResponse {
    pub id: i32,
    pub token: String,
    pub platform: String,
    pub device_id: Option<String>,
    pub user_id: Option<i32>,
    pub is_active: bool,
    pub created_at: String,
}

impl From<device_token::Model> for DeviceTokenResponse {
    fn from(model: device_token::Model) -> Self {
        Self {
            id: model.id,
            token: model.token,
            platform: model.platform,
            device_id: model.device_id,
            user_id: model.user_id,
            is_active: model.is_active,
            created_at: model.created_at.to_string(),
        }
    }
}

/// POST /device-tokens
/// Register a new device token or update existing one
pub async fn register(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Json(payload): Json<RegisterDeviceTokenRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    // Validate platform
    if payload.platform != "ios" && payload.platform != "android" {
        return Err((
            StatusCode::BAD_REQUEST,
            "Platform must be 'ios' or 'android'".to_string(),
        ));
    }

    // Check if token already exists
    let existing_token = DeviceToken::find()
        .filter(device_token::Column::Token.eq(&payload.token))
        .one(database_connection)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database error: {}", e),
            )
        })?;

    let device_token = if let Some(existing) = existing_token {
        // Update existing token (reactivate if needed, update user_id, etc.)
        let mut active_model: device_token::ActiveModel = existing.into();
        active_model.is_active = Set(true);
        active_model.last_used_at = Set(Some(chrono::Utc::now().naive_utc()));
        active_model.updated_at = Set(chrono::Utc::now().naive_utc());

        // Update user_id if provided
        if let Some(user_id) = payload.user_id {
            active_model.user_id = Set(Some(user_id));
        }

        // Update device_id if provided
        if let Some(device_id) = payload.device_id {
            active_model.device_id = Set(Some(device_id));
        }

        active_model.update(database_connection).await.map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to update device token: {}", e),
            )
        })?
    } else {
        // Create new token
        let new_token = device_token::ActiveModel {
            token: Set(payload.token),
            platform: Set(payload.platform),
            device_id: Set(payload.device_id),
            user_id: Set(payload.user_id),
            is_active: Set(true),
            last_used_at: Set(Some(chrono::Utc::now().naive_utc())),
            created_at: Set(chrono::Utc::now().naive_utc()),
            updated_at: Set(chrono::Utc::now().naive_utc()),
            ..Default::default()
        };

        new_token.insert(database_connection).await.map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to insert device token: {}", e),
            )
        })?
    };

    let response: DeviceTokenResponse = device_token.into();
    Ok((StatusCode::CREATED, Json(response)))
}

/// DELETE /device-tokens/:token
/// Deactivate a device token (soft delete)
pub async fn unregister(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path(token): Path<String>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    // Find the token
    let device_token = DeviceToken::find()
        .filter(device_token::Column::Token.eq(&token))
        .one(database_connection)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database error: {}", e),
            )
        })?;

    if let Some(token_model) = device_token {
        // Soft delete by setting is_active to false
        let mut active_model: device_token::ActiveModel = token_model.into();
        active_model.is_active = Set(false);
        active_model.updated_at = Set(chrono::Utc::now().naive_utc());

        active_model.update(database_connection).await.map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to deactivate device token: {}", e),
            )
        })?;

        Ok((StatusCode::NO_CONTENT, ()))
    } else {
        Err((StatusCode::NOT_FOUND, "Device token not found".to_string()))
    }
}

/// Request body for subscribing to an event
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubscribeToEventRequest {
    /// Device token ID (from register endpoint response)
    pub device_token_id: i32,
    /// Event ID to subscribe to
    pub event_id: i32,
}

/// POST /device-tokens/subscribe
/// Subscribe a device to receive notifications for an event
pub async fn subscribe_to_event(
    Extension(notification_service): Extension<Arc<NotificationService>>,
    Json(payload): Json<SubscribeToEventRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    notification_service
        .subscribe_device(payload.device_token_id, payload.event_id)
        .await
        .map_err(|e| {
            error!("Failed to subscribe device: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to subscribe: {}", e),
            )
        })?;

    info!(
        "Device {} subscribed to event {}",
        payload.device_token_id, payload.event_id
    );

    Ok((StatusCode::OK, Json(serde_json::json!({
        "message": "Successfully subscribed to event notifications"
    }))))
}

/// Request body for sending a test notification
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SendTestNotificationRequest {
    /// Event ID to send notification for
    pub event_id: i32,
    /// Notification title
    pub title: String,
    /// Notification body
    pub body: String,
}

/// POST /device-tokens/test-notification
/// Send a test notification to all devices subscribed to an event
pub async fn send_test_notification(
    Extension(notification_service): Extension<Arc<NotificationService>>,
    Json(payload): Json<SendTestNotificationRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    info!(
        "Sending test notification to event {}: {}",
        payload.event_id, payload.title
    );

    let notification = notification_service
        .notify_event_attendees(
            payload.event_id,
            &payload.title,
            &payload.body,
            "test_notification",
            None,
            None,
        )
        .await
        .map_err(|e| {
            error!("Failed to send test notification: {}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to send notification: {}", e),
            )
        })?;

    Ok((StatusCode::OK, Json(serde_json::json!({
        "message": "Test notification sent",
        "notification_id": notification.id
    }))))
}
