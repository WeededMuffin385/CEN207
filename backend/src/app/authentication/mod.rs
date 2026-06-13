mod rejection_code;

use axum::extract::FromRequestParts;
use axum::http::request::Parts;
use axum::http::StatusCode;
use axum::Json;
use axum::response::{IntoResponse, Response};
use axum_extra::extract::CookieJar;
use serde::Serialize;
use sha2::{Digest, Sha256};
use tracing::info;
use crate::app::authentication::rejection_code::AuthRejectionCode;
use crate::context::Context;

pub const SESSION_TOKEN_COOKIE_NAME: &str = "session_token";

pub struct Authentication {
    pub account_id: i64,
}

impl FromRequestParts<Context> for Authentication {
    type Rejection = AuthRejectionCode;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &Context
    ) -> Result<Self, Self::Rejection> {
        let jar = CookieJar::from_request_parts(parts, state).await.unwrap();

        let Some(session_token_string) = jar.get(SESSION_TOKEN_COOKIE_NAME) else {
            return Err(AuthRejectionCode::MissingSession)
        };

        let session_token_bytes = base64_url::decode(session_token_string.value()).unwrap();
        let session_token_hash = Sha256::digest(session_token_bytes).to_vec();

        let Ok(account_id) = state.0.database.get_account_id_by_session_token(session_token_hash).await else {
            return Err(AuthRejectionCode::DatabaseError)
        };

        let Some(account_id) = account_id else {
            return Err(AuthRejectionCode::SessionExpired)
        };

        Ok(Authentication { account_id })
    }
}
