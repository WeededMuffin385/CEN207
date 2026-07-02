use crate::app::authentication::Authentication;
use crate::context::Context;
use axum::extract::{Path, State};
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, get, patch, post};
use axum::{Json, Router};
use serde::Deserialize;
use serde_json::json;

/// Shopping cart
pub fn router() -> Router<Context> {
    Router::new()
        .route("/", get(get_carts))
        .route("/", post(create_cart))
        .route("/{cart_id}", delete(remove_cart))
        .route("/items", post(post_cart_item))
        .route("/items/{product_id}", patch(patch_cart_item))
        .route("/items/{product_id}", delete(delete_cart_item))
}

async fn get_carts(State(state): State<Context>, authentication: Authentication) -> Response {
    let carts = state
        .0
        .database
        .get_carts(authentication.account_id)
        .await
        .unwrap();

    let data = json!({
        "carts": carts
    });

    Json(data).into_response()
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct CreateCartRequest {
    cart_name: String,
}

async fn create_cart(
    State(state): State<Context>,
    authentication: Authentication,
    Json(payload): Json<CreateCartRequest>,
) -> Response {
    let cart = state
        .0
        .database
        .create_cart(authentication.account_id, &payload.cart_name)
        .await;

    let data = json!({
        "cart": cart
    });

    Json(data).into_response()
}

async fn remove_cart(State(state): State<Context>, authentication: Authentication) -> Response {
    todo!()
}

async fn post_cart_item(State(state): State<Context>, authentication: Authentication) -> Response {
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
