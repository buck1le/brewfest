use aws_config::BehaviorVersion;
use aws_sdk_s3::Client as S3Client;
use aws_sdk_s3::{
    error::SdkError,
    operation::put_object::{PutObjectError, PutObjectOutput},
    primitives::ByteStream,
};

use std::error::Error;
use std::sync::Arc;
use tracing::info;

#[allow(unused_imports)]
use mockall::automock;

#[cfg_attr(test, automock)]
pub trait S3Interface {
    fn new() -> impl std::future::Future<Output = Self>;
    fn upload(
        &self,
        file_data: Vec<u8>,
        object_name: &str,
    ) -> impl std::future::Future<Output = Result<String, Box<dyn Error>>>;
    fn upload_object(
        &self,
        key: &str,
        body: ByteStream,
    ) -> impl std::future::Future<Output = Result<PutObjectOutput, SdkError<PutObjectError>>>;
}

pub struct S3Impl {
    client: Arc<S3Client>,
    bucket_name: String,
    folder_name: String,
}

#[cfg_attr(test, automock)]
impl S3Interface for S3Impl {
    async fn new() -> Self {
        let s3_config = aws_config::load_defaults(BehaviorVersion::latest()).await;

        let client = Arc::new(S3Client::new(&s3_config));
        let bucket_name = std::env::var("S3_BUCKET").expect("S3_BUCKET must be set");
        let folder_name = std::env::var("S3_FOLDER").expect("S3_FOLDER must be set");

        Self {
            client,
            bucket_name,
            folder_name,
        }
    }

    async fn upload(
        &self,
        file_data: Vec<u8>,
        object_name: &str,
    ) -> Result<String, Box<dyn Error>> {
        if file_data.is_empty() {
            return Err("File data is empty".into());
        }

        info!("Uploading image to S3");

        let body = ByteStream::from(file_data);
        let s3_key = format!("{}/{}", self.folder_name, object_name);

        match self.upload_object(&s3_key, body).await {
            Ok(_) => Ok(s3_key),
            Err(_) => Err("Failed to upload image to S3".into()),
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

mod tests {
    use mockall::predicate::*;

    #[tokio::test]
    async fn test_upload() {
        let mut mock = MockS3Impl::new();
        mock.expect_upload()
            .with(eq(vec![1, 2, 3]), eq("test.jpg"))
            .times(1)
            .returning(|_, _| Ok("test.jpg".to_string()));

        let result = mock.upload(vec![1, 2, 3], "test.jpg").await;
        assert_eq!(result.unwrap(), "test.jpg");
    }
}
