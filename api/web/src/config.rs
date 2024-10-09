use std::env;

pub struct DatabaseConfig {
    pub url: String,
}

impl DatabaseConfig {
    pub fn new() -> Self {
        Self {
            url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
        }
    }
}
