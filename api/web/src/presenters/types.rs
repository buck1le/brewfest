use axum::response::IntoResponse;
use entities::sea_orm::ModelTrait;

pub trait Presenter {
    fn format<M: ModelTrait>(&self, data: M) -> impl IntoResponse;
    fn format_many<M: ModelTrait>(&self, data: Vec<M>) -> impl IntoResponse;
}
