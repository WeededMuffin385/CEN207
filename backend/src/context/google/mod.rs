pub mod config;

use crate::context::google::config::GoogleConfig;
use jsonwebtoken::jwk::JwkSet;
use jsonwebtoken::{Algorithm, DecodingKey, TokenData, Validation, decode, decode_header};
use serde::Deserialize;
use tracing::info;
use url::Url;

const GOOGLE_JWK_SET_URL: &str = "https://www.googleapis.com/oauth2/v3/certs";

pub struct Google {
    client_secret: String,
    client_id: String,

    redirect_url: String,
    jwk_set: JwkSet,
    client: reqwest::Client,
}

#[derive(Debug, Deserialize)]
pub struct GoogleClaims {
    pub iss: String,
    pub aud: String,
    pub sub: String,
    pub email: Option<String>,
    pub email_verified: Option<bool>,
    pub name: Option<String>,
    pub picture: Option<String>,
    pub exp: usize,
    pub iat: usize,
}

impl Google {
    pub async fn new(config: GoogleConfig) -> Self {
        let client = reqwest::Client::new();

        let jwk_set = client
            .get(GOOGLE_JWK_SET_URL)
            .send()
            .await
            .unwrap()
            .json()
            .await
            .unwrap();

        Self {
            client_secret: config.client_secret,
            redirect_url: config.redirect_url,
            client_id: config.client_id,
            jwk_set,
            client,
        }
    }

    pub async fn get_auth_url(&self, state: &str) -> Url {
        let mut auth_url = Url::parse("https://accounts.google.com/o/oauth2/v2/auth").unwrap();
        auth_url
            .query_pairs_mut()
            .append_pair("client_id", self.client_id.as_str())
            .append_pair("redirect_uri", self.redirect_url.as_str())
            .append_pair("response_type", "code")
            .append_pair("scope", "openid profile")
            .append_pair("state", state)
            .append_pair("access_type", "offline")
            .append_pair("prompt", "consent");
        auth_url
    }

    pub fn verify(&self, token: &str) -> jsonwebtoken::errors::Result<GoogleClaims> {
        let header = decode_header(token)?;

        let kid = header.kid.ok_or_else(|| {
            jsonwebtoken::errors::Error::from(jsonwebtoken::errors::ErrorKind::InvalidToken)
        })?;

        let jwk = self.jwk_set.find(&kid).ok_or_else(|| {
            jsonwebtoken::errors::Error::from(jsonwebtoken::errors::ErrorKind::InvalidKeyFormat)
        })?;

        let decoding_key = DecodingKey::from_jwk(jwk)?;

        let mut validation = Validation::new(Algorithm::RS256);
        validation.set_audience(&[self.client_id.as_str()]);
        validation.set_issuer(&["https://accounts.google.com", "accounts.google.com"]);

        let data: TokenData<GoogleClaims> = decode(&token, &decoding_key, &validation)?;
        info!(
            "audience: {} | issuer: {}",
            data.claims.aud, data.claims.iss
        );

        Ok(data.claims)
    }

    pub async fn exchange_code(&self, code: String) -> GoogleOauthResponse {
        let response = self
            .client
            .post("https://oauth2.googleapis.com/token")
            .form(&[
                ("client_id", self.client_id.as_str()),
                ("client_secret", self.client_secret.as_str()),
                ("code", &code),
                ("grant_type", "authorization_code"),
                ("redirect_uri", self.redirect_url.as_str()),
            ])
            .send()
            .await
            .unwrap();

        let payload = response.text().await.unwrap();
        info!("payload: {payload}");
        serde_json::from_str(&payload).expect(format!("failed to deserialize: {payload}").as_str())
    }
}

#[derive(Deserialize)]
pub struct GoogleOauthResponse {
    pub access_token: String, // A token that can be sent to a Google API.
    pub expires_in: i64,      // The remaining lifetime of the access token in seconds.
    pub id_token: String, // A JWT that contains identity information about the user that is digitally signed by Google.
    pub scope: String, // The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.
    pub token_type: String, // Identifies the type of token returned. At this time, this field always has the value Bearer.
    pub refresh_token: Option<String>, // (optional)
}
