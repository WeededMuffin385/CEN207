mod api;
mod authentication;

use axum::Router;
use crate::context::Context;

pub fn router() -> Router<Context> {
    Router::new()
        .nest("/api", api::router())
}