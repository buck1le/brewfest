use axum::{http::StatusCode, response::IntoResponse};

#[derive(Debug)]
enum Status {
    Success,
    Error,
}

#[derive(Debug)]
pub struct Response {
    status: Status,
    message: String,
}

impl Response {
    pub fn success(message: &str) -> Self {
        Self {
            status: Status::Success,
            message: message.to_string(),
        }
    }

    pub fn error(message: &str) -> Self {
        Self {
            status: Status::Error,
            message: message.to_string(),
        }
    }
}


impl IntoResponse for Response {
    fn into_response(self) -> axum::http::Response<axum::body::Body> {
        match self.status {
            Status::Success => {
                axum::http::Response::builder()
                    .status(StatusCode::OK)
                    .header("Content-Type", "application/json")
                    .body(self.message.into())
                    .unwrap()
            }
            Status::Error => {
                axum::http::Response::builder()
                    .status(StatusCode::INTERNAL_SERVER_ERROR)
                    .header("Content-Type", "application/json")
                    .body(self.message.into())
                    .unwrap()
            }
        }
    }
}
