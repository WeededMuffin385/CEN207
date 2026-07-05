use crate::app::authentication::Authentication;
use crate::context::Context;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{delete, get, patch, post};
use axum::{Json, Router};
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

/// Shopping cart
pub fn router() -> Router<Context> {
    Router::new()
        .route("/", get(get_carts))
        .route("/", post(create_cart))
        .route("/{cart_id}", delete(remove_cart))
        .route("/{cart_id}/items", post(add_cart_item))
        .route("/{cart_id}/items/{product_id}", patch(patch_cart_item))
        .route("/{cart_id}/items/{product_id}", delete(remove_cart_item))
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
        .await
        .unwrap();

    let data = json!({
        "cart": cart
    });

    Json(data).into_response()
}

async fn remove_cart(
    State(state): State<Context>,
    authentication: Authentication,
    Path(cart_id): Path<Uuid>,
) -> Response {
    state
        .0
        .database
        .remove_cart(authentication.account_id, cart_id)
        .await
        .unwrap();
    
    StatusCode::OK.into_response()
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddCartItemRequest {
    product_id: Uuid,
    quantity: i32,
}

async fn add_cart_item(
    State(state): State<Context>,
    authentication: Authentication,
    Path(cart_id): Path<Uuid>,
    Json(payload): Json<AddCartItemRequest>,
) -> Response {
    state
        .0
        .database
        .cart_add_item(
            authentication.account_id,
            cart_id,
            payload.product_id,
            payload.quantity,
        )
        .await
        .unwrap();
    StatusCode::OK.into_response()
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PatchCartItemRequest {
    quantity: i32,
}
async fn patch_cart_item(
    State(state): State<Context>,
    authentication: Authentication,
    Path((cart_id, product_id)): Path<(Uuid, Uuid)>,
    Json(payload): Json<PatchCartItemRequest>,
) -> Response {
    state
        .0
        .database
        .cart_update_item_quantity(
            authentication.account_id,
            cart_id,
            product_id,
            payload.quantity,
        )
        .await
        .unwrap();
    StatusCode::OK.into_response()
}

async fn remove_cart_item(
    State(state): State<Context>,
    authentication: Authentication,
    Path((cart_id, product_id)): Path<(Uuid, Uuid)>,
) -> Response {
    state
        .0
        .database
        .cart_remove_item(authentication.account_id, cart_id, product_id)
        .await
        .unwrap();
    StatusCode::OK.into_response()
}
