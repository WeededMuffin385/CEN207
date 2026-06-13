mod auth;
mod cart;

use axum::Router;
use crate::context::Context;

pub fn router() -> Router<Context> {
    Router::new()
        .nest("/auth", auth::router())
        .nest("/cart", cart::router())
}