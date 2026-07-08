mod auth;
mod carts;
mod products;

use axum::Router;
use crate::context::Context;

pub fn router() -> Router<Context> {
    Router::new()
        .nest("/auth", auth::router())
        .nest("/carts", carts::router())
        .nest("/products", products::router())
}