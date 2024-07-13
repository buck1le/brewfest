use axum::{response::IntoResponse, Extension, Json};
use entities::{prelude::*, *};

use std::sync::Arc;

use entities::sea_orm::*;

pub struct Query;

pub async fn index(Extension(db): Extension<Arc<DatabaseConnection>>) -> impl IntoResponse {
    let database_connection = &*db;

    let vendors = vendors::Entity::find()
        .all(database_connection)
        .await
        .unwrap();

    Json(vendors)
}

pub async fn create(Extension(db): Extension<Arc<DatabaseConnection>>) -> impl IntoResponse {
    let database_connection = &*db;

    let vendor = vendors::ActiveModel {
        name: Set("Test Vendor".to_string()),
        ..Default::default()
    };

    let vendor = vendor.insert(database_connection).await.unwrap();

    Json(vendor)
}
