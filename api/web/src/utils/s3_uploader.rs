use aws_sdk_s3::Client as S3Client;
use aws_sdk_s3::{
    error::SdkError,
    operation::put_object::{PutObjectError, PutObjectOutput},
    primitives::ByteStream,
};
use uuid::Uuid;

use axum::http::StatusCode;
use axum::response::IntoResponse;
use std::sync::Arc;
use tracing::info;

pub struct S3Uploader {
    client: Arc<S3Client>,
    bucket_name: String,
    folder_name: String,
}

impl S3Uploader {
    pub fn new(client: Arc<S3Client>, bucket_name: String, folder_name: String) -> Self {
        Self {
            client,
            bucket_name,
            folder_name,
        }
    }

    pub async fn upload(&self, file_data: Vec<u8>, object_name: &str) -> Result<String, (StatusCode, String)> {
        if file_data.is_empty() {
            return Err((StatusCode::BAD_REQUEST, "File is empty".into()));
        }

        info!("Uploading image to S3");

        let body = ByteStream::from(file_data);
        let s3_key = format!("{}/{}", self.folder_name, object_name);

        match self.upload_object(&s3_key, body).await {
            Ok(_) => Ok(s3_key),
            Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to upload the image to S3".into())),
        }
    }

    async fn upload_object(
        &self,
        key: &str,
        body: ByteStream,
    ) -> Result<PutObjectOutput, SdkError<PutObjectError>> {
        self.client
            .put_object()
            .bucket(&self.bucket_name)
            .key(key)
            .body(body)
            .send()
            .await
    }
}

