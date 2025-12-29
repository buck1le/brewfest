# Firebase Cloud Messaging (FCM) Implementation Guide

This guide walks you through implementing push notifications using Firebase Cloud Messaging in your Brewfest API.

## Overview

We'll create a separate `notifications` crate that handles FCM integration, following the same pattern as your existing `images` crate. This provides:
- Clean separation of concerns
- Reusable notification logic
- Database tracking of all notifications and deliveries
- Automatic invalid token cleanup

---

## Step 1: Firebase Setup (PREREQUISITE)

Before writing any code, you need Firebase credentials:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create or select your project
3. Enable Cloud Messaging (Project Settings → Cloud Messaging)
4. Generate a service account key:
   - Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file
5. Save the JSON file to: `api/config/firebase-service-account.json`
6. Add to `.gitignore`:
   ```
   config/firebase-service-account.json
   ```

---

## Step 2: Create Directory Structure

```bash
cd /Users/joshloesch/projects/brewfest/api
mkdir -p notifications/src
mkdir -p config
```

---

## Step 3: Create `notifications/Cargo.toml`

```toml
[package]
name = "notifications"
version = "0.1.0"
edition = "2021"

[dependencies]
entities = { path = "../entities" }
fcm-client = "0.2"
sea-orm = { version = "1.1", features = ["sqlx-postgres", "runtime-tokio-rustls"] }
tokio = { version = "1", features = ["full"] }
tracing = "0.1"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
anyhow = "1.0"
async-trait = "0.1"

[dev-dependencies]
tracing-test = "0.2.5"

[lib]
path = "src/lib.rs"
```

**Why these dependencies?**
- `fcm-client`: Handles FCM API v1 authentication and message sending
- `entities`: Your database models (device_token, notification, notification_delivery)
- `sea-orm`: Database operations
- `tokio`: Async runtime
- `anyhow`: Error handling

---

## Step 4: Create `notifications/src/lib.rs`

This is the entry point for the crate.

```rust
mod service;

pub use service::NotificationService;

// Re-export types that consumers will need
pub use entities::{device_token, notification, notification_delivery};
```

---

## Step 5: Create `notifications/src/service.rs`

This is the main implementation. Create this file with the following structure:

```rust
use anyhow::Result;
use entities::{device_token, notification, notification_delivery};
use fcm_client::{Client as FcmClient, Message, Notification as FcmNotification, AndroidConfig, ApnsConfig};
use sea_orm::*;
use serde_json::Value as JsonValue;
use std::sync::Arc;
use tracing::{error, info, warn};

pub struct NotificationService {
    fcm_client: FcmClient,
    db: Arc<DatabaseConnection>,
}

impl NotificationService {
    /// Create a new NotificationService
    ///
    /// # Arguments
    /// * `project_id` - Your Firebase project ID
    /// * `service_account_key_path` - Path to your Firebase service account JSON
    /// * `db` - Database connection
    pub async fn new(
        project_id: String,
        service_account_key_path: String,
        db: Arc<DatabaseConnection>,
    ) -> Result<Self> {
        let fcm_client = FcmClient::new(&project_id, &service_account_key_path).await?;

        Ok(Self {
            fcm_client,
            db,
        })
    }

    /// Send notification to all devices registered for an event
    ///
    /// # Arguments
    /// * `event_id` - The event ID to target
    /// * `title` - Notification title
    /// * `body` - Notification body text
    /// * `data` - Optional custom data payload
    pub async fn notify_event_attendees(
        &self,
        event_id: i32,
        title: &str,
        body: &str,
        data: Option<JsonValue>,
    ) -> Result<notification::Model, DbErr> {
        // Create notification record
        let notification_record = self
            .create_notification_record(event_id, None, title, body, data.clone())
            .await?;

        // Get all active device tokens for this event
        let tokens = device_token::Entity::find()
            .filter(device_token::Column::EventId.eq(event_id))
            .filter(device_token::Column::IsActive.eq(true))
            .all(&*self.db)
            .await?;

        // Send to all devices
        self.send_to_devices(notification_record.id, &tokens, title, body, data)
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
    ) -> Result<notification::Model, DbErr> {
        let data = serde_json::json!({
            "vendor_id": vendor_id,
            "type": "vendor_update"
        });

        // Create notification record
        let notification_record = self
            .create_notification_record(event_id, Some(vendor_id), title, body, Some(data.clone()))
            .await?;

        // Get all active device tokens for this event
        // TODO: In future, filter by users who favorited this vendor
        let tokens = device_token::Entity::find()
            .filter(device_token::Column::EventId.eq(event_id))
            .filter(device_token::Column::IsActive.eq(true))
            .all(&*self.db)
            .await?;

        // Send to all devices
        self.send_to_devices(notification_record.id, &tokens, title, body, Some(data))
            .await;

        Ok(notification_record)
    }

    /// Create a notification record in the database
    async fn create_notification_record(
        &self,
        event_id: i32,
        vendor_id: Option<i32>,
        title: &str,
        body: &str,
        data: Option<JsonValue>,
    ) -> Result<notification::Model, DbErr> {
        let new_notification = notification::ActiveModel {
            event_id: Set(event_id),
            vendor_id: Set(vendor_id),
            title: Set(title.to_string()),
            body: Set(body.to_string()),
            data: Set(data),
            sent_at: Set(Some(chrono::Utc::now().naive_utc())),
            ..Default::default()
        };

        new_notification.insert(&*self.db).await
    }

    /// Send notifications to a list of device tokens
    async fn send_to_devices(
        &self,
        notification_id: i32,
        tokens: &[device_token::Model],
        title: &str,
        body: &str,
        data: Option<JsonValue>,
    ) {
        for token in tokens {
            let result = self.send_single_notification(&token.token, title, body, data.clone()).await;

            match result {
                Ok(_) => {
                    info!("Sent notification to device token {}", token.id);

                    // Record successful delivery
                    let delivery = notification_delivery::ActiveModel {
                        notification_id: Set(notification_id),
                        device_token_id: Set(token.id),
                        status: Set("sent".to_string()),
                        delivered_at: Set(Some(chrono::Utc::now().naive_utc())),
                        ..Default::default()
                    };

                    if let Err(e) = delivery.insert(&*self.db).await {
                        error!("Failed to record delivery: {}", e);
                    }
                }
                Err(e) => {
                    warn!("Failed to send notification to token {}: {}", token.id, e);

                    // Record failed delivery
                    let delivery = notification_delivery::ActiveModel {
                        notification_id: Set(notification_id),
                        device_token_id: Set(token.id),
                        status: Set("failed".to_string()),
                        error_message: Set(Some(e.to_string())),
                        ..Default::default()
                    };

                    if let Err(e) = delivery.insert(&*self.db).await {
                        error!("Failed to record failed delivery: {}", e);
                    }

                    // Deactivate token if it's invalid/unregistered
                    if e.to_string().contains("UNREGISTERED") || e.to_string().contains("INVALID") {
                        self.deactivate_token(token.id).await;
                    }
                }
            }
        }
    }

    /// Send a single FCM notification
    async fn send_single_notification(
        &self,
        device_token: &str,
        title: &str,
        body: &str,
        data: Option<JsonValue>,
    ) -> Result<()> {
        let mut message = Message {
            token: Some(device_token.to_string()),
            notification: Some(FcmNotification {
                title: Some(title.to_string()),
                body: Some(body.to_string()),
                ..Default::default()
            }),
            android: Some(AndroidConfig {
                priority: Some("high".to_string()),
                ..Default::default()
            }),
            apns: Some(ApnsConfig {
                headers: std::collections::HashMap::from([
                    ("apns-priority".to_string(), "10".to_string()),
                ]),
                ..Default::default()
            }),
            ..Default::default()
        };

        // Add custom data if provided
        if let Some(data) = data {
            if let Some(obj) = data.as_object() {
                message.data = Some(
                    obj.iter()
                        .map(|(k, v)| (k.clone(), v.to_string()))
                        .collect()
                );
            }
        }

        self.fcm_client.send(message).await?;
        Ok(())
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
}
```

---

## Step 6: Update `.mise.toml`

Add FCM configuration to your environment variables:

```toml
# Add these lines to the [env] section
FCM_PROJECT_ID = "your-firebase-project-id"
FCM_SERVICE_ACCOUNT_KEY = "./config/firebase-service-account.json"
```

Replace `"your-firebase-project-id"` with your actual Firebase project ID.

---

## Step 7: Update Workspace `Cargo.toml`

**Note:** I can see this is already done! The workspace members already include "notifications" on line 14.

---

## Step 8: Integrate into Web Server

### 8.1: Add notifications dependency to `web/Cargo.toml`

```toml
[dependencies]
# ... existing dependencies ...
notifications = { path = "../notifications" }
```

### 8.2: Update `web/src/lib.rs`

Initialize the NotificationService and add it to the Extension layer:

```rust
// At the top, add import
use notifications::NotificationService;

// In the start() function, after creating the database connection:
let notification_service = Arc::new(
    NotificationService::new(
        std::env::var("FCM_PROJECT_ID").expect("FCM_PROJECT_ID must be set"),
        std::env::var("FCM_SERVICE_ACCOUNT_KEY").expect("FCM_SERVICE_ACCOUNT_KEY must be set"),
        db.clone(),
    )
    .await
    .expect("Failed to initialize NotificationService")
);

// Add to the router layers:
let routes_all = Router::new()
    .merge(routers::routes())
    .layer(Extension(db))
    .layer(Extension(aws_s3_client))
    .layer(Extension(notification_service)); // Add this line
```

---

## Step 9: Using Notifications in Handlers

Here's an example of how to trigger notifications when a vendor creates inventory:

### Example: `web/src/handlers/events/vendor/inventory.rs`

```rust
use notifications::NotificationService;

pub async fn create(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Extension(notification_service): Extension<Arc<NotificationService>>,
    Path((event_id, vendor_id)): Path<(i32, i32)>,
    Json(payload): Json<CreateInventoryRequest>,
) -> impl IntoResponse {
    // ... create inventory item ...

    // Send notification asynchronously (don't block the response)
    let ns = notification_service.clone();
    let item_name = payload.name.clone();
    tokio::spawn(async move {
        let title = "New Item Available!";
        let body = format!("Check out the new {} at this vendor", item_name);

        if let Err(e) = ns.notify_vendor_update(event_id, vendor_id, title, &body).await {
            error!("Failed to send notification: {}", e);
        }
    });

    // Return response immediately
    Response::success("Item created").into_response()
}
```

---

## Step 10: Build and Test

```bash
# From the api directory
mise run dev

# Or manually:
cargo build
cargo run
```

---

## When to Send Notifications

Here are suggested triggers throughout your app:

| Event | Title | Body | Target |
|-------|-------|------|--------|
| Vendor adds inventory | "New Item Available!" | "{item_name} just added" | Event attendees |
| Vendor updates image | "Vendor Updated" | "Check out new photos" | Event attendees (or vendor followers) |
| Schedule change | "Schedule Update" | "{item} time changed" | Event attendees |
| Vendor location change | "Vendor Moved" | "{vendor} relocated to {location}" | Event attendees |

---

## Testing Checklist

- [ ] Firebase project created and service account key downloaded
- [ ] Service account key saved to `config/firebase-service-account.json`
- [ ] Environment variables set in `.mise.toml`
- [ ] `notifications` crate builds successfully
- [ ] Web server starts with NotificationService initialized
- [ ] Test device token registered in database
- [ ] Send test notification and verify receipt on device
- [ ] Check `notification` and `notification_delivery` tables for records
- [ ] Verify invalid tokens are deactivated

---

## Architecture Summary

```
┌─────────────────────────────────────────────┐
│           HTTP Handler Layer                │
│   (web/src/handlers/events/vendor/...)      │
└───────────────┬─────────────────────────────┘
                │ Extension(NotificationService)
                ▼
┌─────────────────────────────────────────────┐
│      NotificationService                    │
│   (notifications/src/service.rs)            │
│                                             │
│  • notify_event_attendees()                 │
│  • notify_vendor_update()                   │
│  • Database tracking                        │
│  • Token lifecycle management               │
└───────────────┬─────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────┐
│         FCM Client (fcm-client crate)       │
│   • OAuth authentication                    │
│   • Message sending                         │
│   • Error handling                          │
└─────────────────────────────────────────────┘
```

---

## Key Design Decisions

1. **Separate Crate**: Follows your existing pattern (`images` crate), enables future CLI/worker usage
2. **Non-blocking Sends**: Uses `tokio::spawn()` to avoid blocking HTTP responses
3. **Database Tracking**: Every notification and delivery is recorded for analytics
4. **Token Cleanup**: Automatically deactivates invalid/unregistered tokens
5. **Platform Configs**: Sets high priority for both Android and iOS

---

## Next Steps After Basic Implementation

1. Add notification preferences (users can mute certain types)
2. Implement vendor "favorites" so users only get updates for vendors they care about
3. Add scheduled notifications (e.g., "Event starts in 1 hour")
4. Create admin dashboard to view notification analytics
5. Add notification history endpoint for users to see past notifications

---

## Troubleshooting

### "Failed to initialize NotificationService"
- Check that `FCM_PROJECT_ID` and `FCM_SERVICE_ACCOUNT_KEY` are set in `.mise.toml`
- Verify the service account JSON file exists at the specified path
- Ensure the JSON file has correct permissions (readable by your user)

### "Authentication failed"
- Verify your Firebase service account key is valid
- Check that Cloud Messaging API is enabled in Firebase Console
- Ensure the service account has the "Firebase Cloud Messaging Admin" role

### Messages not arriving on device
- Verify the device token is registered and active in the database
- Check that the token is valid (test with Firebase Console)
- Look at `notification_delivery` table for error messages
- Ensure your app has notification permissions on the device

---

Good luck with your implementation! 🚀
