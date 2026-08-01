use crate::app::authentication::Authentication;
use crate::context::Context;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::{Json, Router};
use uuid::Uuid;

pub fn router() -> Router<Context> {
    Router::new()
        .route("/", get(get_orders))
        .route("/{order_id}/cancel", post(cancel_order))
}

async fn get_orders(State(state): State<Context>, authentication: Authentication) -> Response {
    let orders = state
        .0
        .database
        .get_orders(authentication.account_id)
        .await
        .unwrap();
    Json(orders).into_response()
}

async fn cancel_order(
    State(state): State<Context>,
    Path(order_id): Path<Uuid>,
    authentication: Authentication,
) -> Response {
    let result = state.0.database.cancel_order(authentication.account_id, order_id).await.unwrap();

    match result {
        None => StatusCode::NOT_FOUND.into_response(),
        Some(order) => Json(order).into_response(),
    }
}