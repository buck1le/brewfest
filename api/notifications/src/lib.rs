mod service;

pub use service::NotificationService;

// Re-export entities for convenience
pub use entities::{device_token, event_subscription, notification, notification_delivery};
