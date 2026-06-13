use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, TokenData, Validation};
use jsonwebtoken::dangerous::insecure_decode;
use jsonwebtoken::jwk::JwkSet;
use serde::Deserialize;
use tracing::info;

const GOOGLE_JWK_SET_URL: &str = "https://www.googleapis.com/oauth2/v3/certs";

const WEB_CLIENT_ID: &str = "TODO!";
const DESKTOP_CLIENT_ID: &str = "TODO!";

pub struct Google {
    jwk_set: JwkSet
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
    pub async fn new() -> Self {
        let jwk_set: JwkSet = reqwest::get(GOOGLE_JWK_SET_URL).await.unwrap().json().await.unwrap();
        Self {
            jwk_set
        }
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
        validation.set_audience(&[
            WEB_CLIENT_ID,
            DESKTOP_CLIENT_ID
        ]);
        validation.set_issuer(&[
            "https://accounts.google.com",
            "accounts.google.com",
        ]);

        let data: TokenData<GoogleClaims> = decode(&token, &decoding_key, &validation)?;
        info!("audience: {} | issuer: {}",
            data.claims.aud,
            data.claims.iss
        );

        Ok(data.claims)
    }
}