mod auth;
mod carts;
mod products;
mod orders;

use axum::Router;
use crate::context::Context;

pub fn router() -> Router<Context> {
    Router::new()
        .nest("/auth", auth::router())
        .nest("/carts", carts::router())
        .nest("/orders", orders::router())
        .nest("/products", products::router())
}