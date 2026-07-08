mod google;

use axum::extract::State;
use axum::{Json, Router};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Redirect, Response};
use axum::routing::{get, post};
use axum_extra::extract::cookie::{Cookie, SameSite};
use axum_extra::extract::CookieJar;
use serde::Deserialize;
use serde_json::json;
use time::Duration;
use crate::app::authentication::{Authentication, SESSION_TOKEN_COOKIE_NAME};
use crate::context::Context;

/// User authentication
pub fn router() -> Router<Context> {
    Router::new()
        .route("/session", get(check_session))
        .route("/guest", post(auth_guest))
        .nest("/google", google::router())
}

async fn check_session(
    State(state): State<Context>,
    authentication: Authentication,
) -> Response {
    let data = json!({
        "user": {
            "id": authentication.account_id,
            "name": "noname"
        }
    });
    
    Json(data).into_response()
}


async fn auth_guest(
    State(state): State<Context>,
    jar: CookieJar,
) -> Response {
    let mut tx = state.0.database.pool.begin().await.unwrap();
    let account_id = state.0.database.create_account(&mut tx, "guest").await;
    tx.commit().await.unwrap();
    
    let session_token = state.0.database.create_session_token(account_id).await;

    let jar = jar.add(
        // TODO: fix the problem with local environment and secure=false
        Cookie::build((SESSION_TOKEN_COOKIE_NAME, session_token))
            .path("/")
            .secure(false)
            .http_only(true)
            .same_site(SameSite::Lax)
            .max_age(Duration::days(30))
    );

    (jar, StatusCode::OK).into_response()
}