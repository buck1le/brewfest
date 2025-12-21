use axum::{http::StatusCode, response::IntoResponse};
use serde::Serialize;

#[derive(Debug)]
enum Status {
    Success,
    Error,
}

#[derive(Debug)]
pub struct Response {
    status: Status,
    message: String,
    status_code: StatusCode,
}

impl Response {
    /// Create a success response with HTTP 200
    pub fn success(message: &str) -> Self {
        Self {
            status: Status::Success,
            message: message.to_string(),
            status_code: StatusCode::OK,
        }
    }

    /// Create an error response with custom HTTP status code
    pub fn error_with_status(message: &str, status_code: StatusCode) -> Self {
        Self {
            status: Status::Error,
            message: message.to_string(),
            status_code,
        }
    }

    /// Create an error response with HTTP 500 (for backwards compatibility)
    pub fn error(message: &str) -> Self {
        Self::error_with_status(message, StatusCode::INTERNAL_SERVER_ERROR)
    }

    /// Create a 400 Bad Request error
    pub fn bad_request(message: &str) -> Self {
        Self::error_with_status(message, StatusCode::BAD_REQUEST)
    }

    /// Create a 404 Not Found error
    pub fn not_found(message: &str) -> Self {
        Self::error_with_status(message, StatusCode::NOT_FOUND)
    }

    /// Create a 401 Unauthorized error
    pub fn unauthorized(message: &str) -> Self {
        Self::error_with_status(message, StatusCode::UNAUTHORIZED)
    }

    /// Create a 403 Forbidden error
    pub fn forbidden(message: &str) -> Self {
        Self::error_with_status(message, StatusCode::FORBIDDEN)
    }
}

#[derive(Serialize)]
struct StandardAPIResponse {
    message: String,
    status: String,
}

impl IntoResponse for Response {
    fn into_response(self) -> axum::http::Response<axum::body::Body> {
        let status_str = match self.status {
            Status::Success => "success",
            Status::Error => "error",
        };

        let response = StandardAPIResponse {
            message: self.message,
            status: status_str.to_string(),
        };

        let json_body = serde_json::to_string(&response).unwrap();

        axum::http::Response::builder()
            .status(self.status_code)
            .header("Content-Type", "application/json")
            .body(json_body.into())
            .unwrap()
    }
}
