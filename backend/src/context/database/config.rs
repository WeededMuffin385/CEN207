use anyhow::Context;
use aws_config::BehaviorVersion;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseCredentials {
    pub username: String,
    pub password: String,
}

impl DatabaseCredentials {
    pub async fn aws() -> anyhow::Result<Self> {
        let secret_name = std::env::var("DATABASE_CREDENTIALS_SECRET_NAME")?;

        let config = aws_config::load_defaults(BehaviorVersion::latest()).await;
        let client = aws_sdk_secretsmanager::Client::new(&config);

        let response = client
            .get_secret_value()
            .secret_id(secret_name)
            .send()
            .await?;

        let secret = response.secret_string().context("failed to get secret string")?;
        let secret: Self = serde_json::from_str(&secret).context("failed to parse secret string")?;

        Ok(secret)
    }

    pub fn local() -> Self {
        Self {
            username: "admin".to_string(),
            password: "secret".to_string(),
        }
    }
}





#[derive(Debug, Serialize, Deserialize)]
pub struct DatabaseConfig {
    pub credentials: DatabaseCredentials,
    pub database: String,
    pub host: String,
    pub port: u16,

    pub require_ssl: bool,
}

const DATABASE: &str = "postgres";
const HOST: &str = "database.cl8ay62k4lui.ap-southeast-2.rds.amazonaws.com";

impl DatabaseConfig {
    pub async fn aws() -> anyhow::Result<Self> {
        Ok(Self {
            credentials: DatabaseCredentials::aws().await?,

            database: DATABASE.to_string(),
            host: HOST.to_string(),
            port: 5432,
            require_ssl: true,
        })
    }

    pub fn local() -> Self {
        Self {
            credentials: DatabaseCredentials::local(),
            database: "postgres".to_string(),
            host: "postgres".to_string(),
            port: 5432,
            require_ssl: false,
        }
    }

    pub async fn local_aws() -> anyhow::Result<Self> {
        Ok(Self {
            credentials: DatabaseCredentials::aws().await?,
            database: "postgres".to_string(),
            host: "localhost".to_string(),
            port: 5433,
            require_ssl: true,
        })
    }
}