use axum::http::StatusCode;
use axum::{
    extract::Path,
    response::IntoResponse,
    Extension,
};
use std::sync::Arc;

use crate::common::events::load_event;
use crate::presenters::events::vendors::images::Presenter as ImagePresenter;

use entities::{vendors, sea_orm::*};

use entities::vendor_inventory_items::Entity as VendorInventoryItems;
use entities::vendors::Entity as Vendors;


pub async fn index(
    Extension(db): Extension<Arc<DatabaseConnection>>,
    Path((event_id, vendor_id)): Path<(i32, i32)>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let database_connection = &*db;

    let event = load_event(event_id, &db).await?;

    if let Some(event) = event {
        let vendor = event
            .find_related(Vendors)
            .filter(vendors::Column::Id.eq(vendor_id))
            .one(database_connection)
            .await
            .unwrap();

        if let Some(vendor) = vendor {
            let inventory = vendor
                .find_related(VendorInventoryItems)
                .all(database_connection)
                .await
                .unwrap();

            //TODO: implement inventory presenter
            //ImagePresenter::new(images).render()
        } else {
            Err((StatusCode::NOT_FOUND, "Vendor not found".to_string()))
        }
    } else {
        Err((StatusCode::NOT_FOUND, "Event not found".to_string()))
    }
}
