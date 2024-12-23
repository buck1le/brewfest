use axum::http::StatusCode;
use axum::response::IntoResponse;
use entities::sea_orm::{DatabaseConnection, ModelTrait};

// TODO: Implement this function
// I will most likely need to combine the image table into one, and add an enum column of the
// "type" of association I am qurying for.. since I want to make this generic for any model and
// they may have the same foriegn key column value, but different table names.
//
async fn fetch_thumbnail<M>(
    model: M,
    db: DatabaseConnection,
) -> Result<impl IntoResponse, (StatusCode, String)>
where
    M: ModelTrait,
{
    let database_connection = &*db;

    let image = model.find_related(entities::

    if let Some(image) = image {
        Ok(Json(image.thumbnail).into_response())
    } else {
        Err((StatusCode::NOT_FOUND, "Image not found".to_string()))
    }
}
