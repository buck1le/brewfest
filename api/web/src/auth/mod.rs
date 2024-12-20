use axum::{
    async_trait,
    extract::{FromRequest, Request},
    http::StatusCode,
};

struct ApiKey;

#[async_trait]
impl<S> FromRequest<S> for ApiKey {
    type Rejection = (StatusCode, &'static str);

    async fn from_request(req: Request, _state: &S) -> Result<Self, Self::Rejection> {
        let api_key = req
            .headers()
            .get("x-api-key")
            .and_then(|value| value.to_str().ok());

        match api_key {
            Some(key) if key == std::env::var("API_KEY").expect("API_KEY must be set") => {
                Ok(ApiKey)
            }
            _ => Err((StatusCode::UNAUTHORIZED, "Invalid or missing API key")),
        }
    }
}
