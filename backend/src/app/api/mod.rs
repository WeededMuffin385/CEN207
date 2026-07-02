mod auth;
mod carts;

use axum::Router;
use crate::context::Context;

pub fn router() -> Router<Context> {
    Router::new()
        .nest("/auth", auth::router())
        .nest("/carts", carts::router())
}