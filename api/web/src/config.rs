use std::env;

pub struct DatabaseConfig {
    pub url: String,
    pub host: String,
    pub port: String,
}

impl DatabaseConfig {
    pub fn new() -> Self {
        Self {
            url: env::var("DATABASE_URL").expect("DATABASE_URL must be set"),
            host: env::var("BREW_FEST_DATABASE_HOST").expect("BREW_FEST_DATABASE_HOST must be set"),
            port: env::var("BREW_FEST_DATABASE_PORT").expect("BREW_FEST_DATABASE_PORT must be set"),
        }
    }
}
