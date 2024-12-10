use std::env;

pub struct S3Config {
    pub bucket: String,
    pub folder: String,
    pub region: String,
    pub access_key: String,
    pub secret_key: String,
}

impl Default for S3Config {
    fn default() -> Self {
        Self {
            bucket: env::var("S3_BUCKET").expect("S3_BUCKET must be set"),
            folder: env::var("S3_FOLDER").expect("S3_FOLDER must be set"),
            region: env::var("S3_REGION").expect("S3_REGION must be set"),
            access_key: env::var("S3_ACCESS_KEY").expect("S3_ACCESS_KEY must be set"),
            secret_key: env::var("S3_SECRET_KEY").expect("S3_SECRET_KEY must be set"),
        }
    }
}

