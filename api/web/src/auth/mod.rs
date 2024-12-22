use axum::{
    async_trait,
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
};

pub struct ExtractApiKey(pub String);

#[async_trait]
impl<S> FromRequestParts<S> for ExtractApiKey
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, &'static str);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let api_key = parts
            .headers
            .get("x-api-key")
            .and_then(|value| value.to_str().ok());

        let expected_api_key = std::env::var("API_KEY").map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Missing environment variable",
            )
        })?;

        match api_key {
            Some(key) if key == expected_api_key.as_str() => Ok(ExtractApiKey(key.to_string())),
            _ => Err((StatusCode::UNAUTHORIZED, "Not authorized for this resource")),
        }
    }
}
