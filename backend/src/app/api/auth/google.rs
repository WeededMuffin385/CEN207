use crate::app::authentication::SESSION_TOKEN_COOKIE_NAME;
use crate::context::Context;
use axum::extract::{Query, State};
use axum::response::{IntoResponse, Redirect, Response};
use axum::routing::get;
use axum::Router;
use axum_extra::extract::cookie::{Cookie, SameSite};
use axum_extra::extract::CookieJar;
use axum_extra::headers::HeaderMap;
use rand::distr::Alphanumeric;
use rand::RngExt;
use serde::Deserialize;
use tracing::info;

pub const GOOGLE_OAUTH_STATE_COOKIE_NAME: &str = "google_oauth_state";

pub fn router() -> Router<Context> {
    Router::new()
        .route("/", get(auth_google))
        .route("/callback", get(auth_google_callback))
}

async fn auth_google(State(state): State<Context>, jar: CookieJar) -> Response {
    let oauth_state: String = rand::rng()
        .sample_iter(Alphanumeric)
        .take(32)
        .map(char::from)
        .collect();

    info!("auth state: {}", oauth_state);

    let auth_url = state.0.google.get_auth_url(&oauth_state).await;

    let jar = jar.add(
        Cookie::build((GOOGLE_OAUTH_STATE_COOKIE_NAME, oauth_state))
            .path("/")
            .http_only(true)
            .secure(false)
            .same_site(SameSite::Lax)
            .max_age(time::Duration::minutes(30)),
    );

    (jar, Redirect::temporary(auth_url.as_str())).into_response()
}

#[derive(Deserialize)]
struct AuthCallbackQuery {
    code: String,
    state: String,
}

async fn auth_google_callback(
    State(state): State<Context>,
    Query(params): Query<AuthCallbackQuery>,
    headers: HeaderMap,
    jar: CookieJar,
) -> Response {
    let stored_state = jar
        .get(GOOGLE_OAUTH_STATE_COOKIE_NAME)
        .unwrap()
        .value()
        .to_string();

    if stored_state != params.state {
        panic!("OAuth state mismatch");
    }

    let response = state.0.google.exchange_code(params.code).await;
    let token = response.id_token;

    let claims = state.0.google.verify(&token).unwrap();
    let google_account_id = claims.sub;
    let google_account_name = claims.name;

    let account_id = state
        .0
        .database
        .google_auth(
            &google_account_id,
            &google_account_name.unwrap_or_else(|| "noname".to_string()),
        )
        .await;
    let session_token = state.0.database.create_session_token(account_id).await;

    let jar = jar.add(
        Cookie::build((SESSION_TOKEN_COOKIE_NAME, session_token))
            .path("/")
            .http_only(true)
            .secure(true)
            .same_site(SameSite::Lax)
            .max_age(time::Duration::days(14)),
    );

    let jar = jar.remove(Cookie::build(GOOGLE_OAUTH_STATE_COOKIE_NAME).path("/"));

    (jar, Redirect::temporary("/")).into_response()
}
