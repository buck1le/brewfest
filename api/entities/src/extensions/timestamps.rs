use sea_orm::*;

/// Trait for entities that have created_at and updated_at timestamp fields
///
/// This provides automatic timestamp management without needing to duplicate
/// the ActiveModelBehavior implementation across all entities.
pub trait TimestampBehavior {
    /// Set created_at and updated_at on insert, only updated_at on update
    fn apply_timestamps<C>(self, _db: &C, insert: bool) -> Result<Self, DbErr>
    where
        Self: Sized,
        C: ConnectionTrait;
}

/// Macro to implement TimestampBehavior for entities with created_at and updated_at fields
///
/// Usage:
/// ```
/// use entities::extensions::impl_timestamp_behavior;
///
/// impl_timestamp_behavior!(vendor::ActiveModel, created_at, updated_at);
/// ```
#[macro_export]
macro_rules! impl_timestamp_behavior {
    ($active_model:ty, $created_field:ident, $updated_field:ident) => {
        impl $crate::extensions::timestamps::TimestampBehavior for $active_model {
            fn apply_timestamps<C>(
                mut self,
                _db: &C,
                insert: bool,
            ) -> Result<Self, sea_orm::DbErr>
            where
                C: sea_orm::ConnectionTrait,
            {
                let now = chrono::Utc::now().naive_utc();
                if insert {
                    self.$created_field = sea_orm::Set(now);
                }
                self.$updated_field = sea_orm::Set(now);
                Ok(self)
            }
        }

        #[sea_orm::prelude::async_trait::async_trait]
        impl sea_orm::ActiveModelBehavior for $active_model {
            async fn before_save<C>(
                self,
                db: &C,
                insert: bool,
            ) -> Result<Self, sea_orm::DbErr>
            where
                C: sea_orm::ConnectionTrait,
            {
                $crate::extensions::timestamps::TimestampBehavior::apply_timestamps(
                    self, db, insert,
                )
            }
        }
    };
}

// Re-export for convenience
pub use impl_timestamp_behavior;
