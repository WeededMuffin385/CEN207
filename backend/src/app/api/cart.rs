use axum::Router;
use crate::context::Context;

/// Shopping cart
pub fn router() -> Router<Context> {
    Router::new()
}