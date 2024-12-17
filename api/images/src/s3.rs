use aws_config::BehaviorVersion;
use aws_sdk_s3::Client as S3Client;
use aws_sdk_s3::{
    error::SdkError,
    operation::put_object::{PutObjectError, PutObjectOutput},
    primitives::ByteStream,
};
use std::error::Error;
use std::fmt;
use std::sync::Arc;
use tracing::info;
use std::pin::Pin;

#[cfg(test)]
use mockall::automock;

#[derive(Debug)]
pub enum UploadError {
    EmptyFileData,
    S3UploadFailed,
    EnvVarMissing(String),
}

impl fmt::Display for UploadError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            UploadError::EmptyFileData => write!(f, "File data is empty"),
            UploadError::S3UploadFailed => write!(f, "Failed to upload image to S3"),
            UploadError::EnvVarMissing(var) => {
                write!(f, "Environment variable {} must be set", var)
            }   
        }
    }
}

impl Error for UploadError {}

pub async fn upload(
    file_data: Vec<u8>,
    object_name: &str,
    s3: &impl S3Interface,
) -> Result<String, UploadError> {
    info!("Uploading image");

    if file_data.is_empty() {
        return Err(UploadError::EmptyFileData);
    }

    let body = ByteStream::from(file_data);
    let s3_key = format!("{}/{}", s3.folder_name(), object_name);

    info!("Uploading image to S3");

    s3.upload_object(&s3_key, body)
        .await
        .map_err(|_| UploadError::S3UploadFailed)?;

    Ok(s3_key)
}

pub struct S3 {
    client: Arc<S3Client>,
    bucket_name: String,
    folder_name: String,
}

#[cfg_attr(test, automock)]
pub trait S3Interface {
    fn folder_name(&self) -> &str;
    fn upload_object(
        &self,
        key: &str,
        body: ByteStream,
    ) -> impl std::future::Future<Output = Result<PutObjectOutput, SdkError<PutObjectError>>>;
}

impl S3 {
    pub fn new() -> Pin<Box<dyn std::future::Future<Output = Result<Self, UploadError>>>>
        where
            Self: Sized
    {
        Box::pin(async {
            let s3_config = aws_config::load_defaults(BehaviorVersion::latest()).await;

            let client = Arc::new(S3Client::new(&s3_config));
            let bucket_name = std::env::var("S3_BUCKET")
                .map_err(|_| UploadError::EnvVarMissing("S3_BUCKET".to_string()))
                .unwrap();
            let folder_name = std::env::var("S3_FOLDER")
                .map_err(|_| UploadError::EnvVarMissing("S3_FOLDER".to_string()))
                .unwrap();

            Ok(Self {
                client,
                bucket_name,
                folder_name,
            })
        })
    }
}

#[cfg_attr(test, automock)]
impl S3Interface for S3 {
    fn folder_name(&self) -> &str {
        &self.folder_name
    }

    async fn upload_object(
        &self,
        key: &str,
        body: ByteStream,
    ) -> Result<PutObjectOutput, SdkError<PutObjectError>> {
        info!("Uploading object with key: {}", key);

        self.client
            .put_object()
            .bucket(&self.bucket_name)
            .key(key)
            .body(body)
            .send()
            .await
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockall::predicate::*;
    use tracing_test::traced_test;

    #[tokio::test]
    #[traced_test]
    async fn test_upload() {
        let mut mock = MockS3Interface::default();

        let expected_key = "my_folder/my_key.jpg";

        mock.expect_folder_name()
            .times(1)
            .return_const("my_folder".to_string());

        mock.expect_upload_object()
            .with(eq(expected_key), always())
            .times(1)
            .returning(|_, _| Box::pin(async { Ok(PutObjectOutput::builder().build()) }));

        let result = upload(vec![0, 1, 2, 3], "my_key.jpg", &mock).await;

        assert_eq!(result.unwrap(), expected_key);
    }
}
