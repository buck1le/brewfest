/// Converts an optional S3 key to an optional URL
///
/// Returns None if the input is None, otherwise generates the URL
pub fn key_to_url(key: Option<String>) -> Option<String> {
    key.map(|k| generate_s3_url(&k))
}

/// Generates a public URL for an S3 object key
pub fn generate_s3_url(key: &str) -> String {
    let bucket = std::env::var("S3_BUCKET").unwrap_or_else(|_| "brewfest-dev".to_string());

    if let Ok(endpoint) = std::env::var("AWS_ENDPOINT_URL") {
        // LocalStack: path-style URL
        format!("{}/{}/{}", endpoint, bucket, key)
    } else {
        // Production AWS
        let region = std::env::var("S3_REGION").unwrap_or_else(|_| "us-east-1".to_string());
        format!("https://{}.s3.{}.amazonaws.com/{}", bucket, region, key)
    }
}

