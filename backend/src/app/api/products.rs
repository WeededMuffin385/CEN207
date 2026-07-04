
use axum::extract::{Query, State};
use axum::response::{IntoResponse, Response};
use axum::{Json, Router};
use axum::routing::get;
use chrono::{DateTime, Utc};
use serde::Deserialize;
use uuid::Uuid;
use crate::app::authentication::Authentication;
use crate::context::Context;

pub fn router() -> Router<Context> {
    Router::new()
        .route("/", get(get_products))
}

#[derive(Debug, Deserialize)]
struct GetProductsQuery {
    product_id: Option<Uuid>,
    created_at: Option<DateTime<Utc>>,
    limit: Option<i64>,
}

async fn get_products(
    State(state): State<Context>,
    Query(query): Query<GetProductsQuery>,
) -> Response {
    let limit = query.limit.unwrap_or(24).clamp(1, 48);
    
    let products = state.0.database.get_products(
        limit,
        query.product_id,
        query.created_at,
    ).await.unwrap();

    Json(products).into_response()
}