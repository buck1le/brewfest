// Custom entity extensions
// This module contains traits and implementations that extend the generated entities
// These files are safe from regeneration

pub mod timestamps;
pub mod schedule_image_ext;
pub mod vendor_image_ext;

// Re-export for convenience
pub use timestamps::TimestampBehavior;
pub use schedule_image_ext::ScheduleImageExt;
pub use vendor_image_ext::VendorImageExt;
