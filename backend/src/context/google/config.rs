use std::fs::read_to_string;
use std::path::Path;
use serde_json::Value;

const LOCAL_URL: &str = "http://localhost:5173";
const PRODUCTION_URL: &str = "https://cen207.zagoruiko.dev";
const REDIRECT_URL: &str = "api/auth/google/callback";

pub struct GoogleConfig {
    pub client_id: String,
    pub redirect_url: String,
    pub client_secret: String,
}

impl GoogleConfig {
    pub fn local() -> Self {
        const CLIENT_SECRET_PATH: &str = "/assets/google/client_secret_736684389094-to6nttrhqpsnmtnlu4m26m1mt3kead65.apps.googleusercontent.com.json";
        let secret = read_to_string(CLIENT_SECRET_PATH).unwrap();
        let secret: Value = serde_json::from_str(&secret).unwrap();
        let client_secret = secret["web"]["client_secret"].as_str().unwrap().to_string();
        let client_id = secret["web"]["client_id"].as_str().unwrap().to_string();

        Self {
            redirect_url: format!("{LOCAL_URL}/{REDIRECT_URL}"),

            client_id,
            client_secret,
        }
    }

    pub async fn aws() -> Self {
        let secret: String = todo!("read client secret from the AWS Secret Manager");
        let secret: Value = serde_json::from_str(&secret).unwrap();
        let client_secret = secret["web"]["client_secret"].as_str().unwrap().to_string();
        let client_id = secret["web"]["client_id"].as_str().unwrap().to_string();

        Self {
            redirect_url: format!("{PRODUCTION_URL}/{REDIRECT_URL}"),

            client_id,
            client_secret,
        }
    }
}