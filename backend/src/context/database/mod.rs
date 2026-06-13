pub mod config;

use crate::context::database::config::DatabaseConfig;
use rand::Rng;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use sqlx::{PgPool, Postgres, Transaction};
use sqlx::postgres::{PgConnectOptions, PgPoolOptions, PgSslMode};
use std::time::Duration;
use tokio::time::sleep;
use tracing::info;

pub struct Database {
    pub pool: PgPool,
}

impl Database {
    pub async fn new(config: DatabaseConfig) -> Self {
        let ssl_mode = match config.require_ssl {
            true => PgSslMode::Require,
            false => PgSslMode::Disable,
        };

        let options = PgConnectOptions::new()
            .username(config.credentials.username.as_str())
            .password(config.credentials.password.as_str())
            .database(config.database.as_str())
            .host(config.host.as_str())
            .port(config.port)
            .ssl_mode(ssl_mode);

        let pool = loop {
            match PgPoolOptions::new()
                .max_connections(2)
                .connect_with(options.clone())
                .await
            {
                Ok(pool) => break pool,
                Err(err) => {
                    info!("Failed to connect to postgres. Retry...: {err:?}");
                    sleep(Duration::from_secs(5)).await;
                }
            }
        };

        info!("Connected to Postgres");
        Self { pool }
    }
}

#[derive(sqlx::Type, Debug, Clone, Copy, PartialEq, Eq)]
#[sqlx(type_name = "account_identity_provider", rename_all = "lowercase")]
pub enum AccountIdentityProvider {
    Google,
    Steam,
    Guest,
}

impl Database {
    pub async fn google_authenticate(&self, id: &str, name: &str) -> i64 {
        let mut tx = self.pool.begin().await.unwrap();

        let account_id = sqlx::query_scalar!(
            r#"
            SELECT account_id
            FROM account_identities
            WHERE provider = $1
            AND provider_account_id = $2
        "#,
            AccountIdentityProvider::Google as AccountIdentityProvider,
            id
        )
        .fetch_optional(&mut *tx)
        .await
        .unwrap();

        let account_id = match account_id {
            Some(account_id) => account_id,
            None => {
                let account_id = self.create_account(&mut tx, name).await;

                sqlx::query!(
                    r#"
                    INSERT INTO account_identities (
                        account_id,
                        provider,
                        provider_account_id
                    )
                    VALUES ($1, $2, $3)
                "#,
                    account_id,
                    AccountIdentityProvider::Google as AccountIdentityProvider,
                    id
                )
                .execute(&mut *tx)
                .await
                .unwrap();

                account_id
            }
        };

        tx.commit().await.unwrap();

        account_id
    }

    pub async fn create_account(&self, tx: &mut Transaction<'_, Postgres>, name: &str) -> i64 {
        let account_id = sqlx::query_scalar!(
                    r#"
                    INSERT INTO accounts (name)
                    VALUES ($1)
                    RETURNING id
                "#,
                    name
                )
            .fetch_one(&mut **tx)
            .await
            .unwrap();

        account_id
    }

    pub async fn create_session_token(&self, account_id: i64) -> String {
        let mut session_token_bytes = [0; 32];
        rand::rngs::ThreadRng::default().fill_bytes(&mut session_token_bytes);

        let session_token_string = base64_url::encode(&session_token_bytes);
        let session_token = Sha256::digest(&session_token_bytes).to_vec();

        sqlx::query!(
            r#"
            INSERT INTO account_sessions (
                token,
                account_id,
                expires_at
            )
            VALUES (
                $1,
                $2,
                NOW() + INTERVAL '30 days'
            )
        "#,
            session_token,
            account_id
        )
        .execute(&self.pool)
        .await
        .unwrap();

        session_token_string
    }

    pub async fn get_account_id_by_session_token(
        &self,
        session_token: Vec<u8>,
    ) -> Result<Option<i64>, sqlx::Error> {
        let account_id = sqlx::query_scalar!(
            r#"
            SELECT account_id
            FROM account_sessions
            WHERE token = $1
            AND expires_at > NOW()
        "#,
            &session_token
        )
            .fetch_optional(&self.pool)
            .await?;

        Ok(account_id)
    }
}
