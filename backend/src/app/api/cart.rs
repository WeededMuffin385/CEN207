use axum::extract::{Path, State};
use axum::response::Response;
use axum::Router;
use axum::routing::{delete, get, patch, post};
use crate::app::authentication::Authentication;
use crate::context::Context;

/// Shopping cart
pub fn router() -> Router<Context> {
    Router::new()
        .route("/", get(get_cart))
        .route("/items", post(post_cart_item))
        .route("/items/{product_id}", patch(patch_cart_item))
        .route("/items/{product_id}", delete(delete_cart_item))
}


async fn get_cart(
    State(state): State<Context>,
    authentication: Authentication,
) -> Response {
    todo!()
}

async fn post_cart_item(
    State(state): State<Context>,
    authentication: Authentication,
) -> Response {
    todo!()
}

async fn patch_cart_item(
    State(state): State<Context>,
    authentication: Authentication,
    Path(product_id): Path<i64>,
) -> Response {
    todo!()
}

async fn delete_cart_item(
    State(state): State<Context>,
    authentication: Authentication,
    Path(product_id): Path<i64>,
) -> Response {
    todo!()
}