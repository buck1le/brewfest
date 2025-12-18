use aws_sdk_s3::Client as S3Client;
use aws_sdk_s3::{
    error::SdkError,
    operation::put_object::{PutObjectError, PutObjectOutput},
    primitives::ByteStream,
};
use image::{ImageFormat, ImageReader};
use std::error::Error;
use std::fmt;
use std::io::Cursor;
use std::pin::Pin;
use std::sync::Arc;
use tracing::info;

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

    let max_image_width = std::env::var("MAX_IMAGE_WIDTH")
        .map(|s| s.parse().unwrap())
        .unwrap_or(800);

    let max_image_height = std::env::var("MAX_IMAGE_HEIGHT")
        .map(|s| s.parse().unwrap())
        .unwrap_or(600);

    let image = ImageReader::new(Cursor::new(&file_data))
        .with_guessed_format()
        .expect("Failed to guess image format")
        .decode()
        .expect("Failed to decode image");

    let resized_image = image.resize(
        max_image_width,
        max_image_height,
        image::imageops::FilterType::Lanczos3,
    );

    let mut buffer = Vec::new();
    resized_image
        .write_to(&mut Cursor::new(&mut buffer), ImageFormat::Png)
        .expect("Failed to write resized image");

    let body = ByteStream::from(buffer);
    let s3_key = format!("{}/{}.{}", s3.folder_name(), object_name, "png");

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
        Self: Sized,
    {
        Box::pin(async {
            // Support custom endpoints for LocalStack/MinIO
            let config_loader = aws_config::defaults(aws_config::BehaviorVersion::latest());

            let config_loader = if let Ok(endpoint) = std::env::var("AWS_ENDPOINT_URL") {
                info!("Using custom S3 endpoint: {}", endpoint);
                config_loader.endpoint_url(endpoint)
            } else {
                config_loader
            };

            let s3_config = config_loader.load().await;

            // Configure S3 client with path-style URLs for LocalStack
            let mut s3_config_builder = aws_sdk_s3::config::Builder::from(&s3_config);

            if std::env::var("AWS_S3_FORCE_PATH_STYLE").unwrap_or_default() == "true" {
                info!("Using path-style S3 URLs");
                s3_config_builder = s3_config_builder.force_path_style(true);
            }

            let client = Arc::new(S3Client::from_conf(s3_config_builder.build()));

            let bucket_name = std::env::var("S3_BUCKET")
                .map_err(|_| UploadError::EnvVarMissing("S3_BUCKET".to_string()))?;
            let folder_name = std::env::var("S3_FOLDER")
                .map_err(|_| UploadError::EnvVarMissing("S3_FOLDER".to_string()))?;

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
