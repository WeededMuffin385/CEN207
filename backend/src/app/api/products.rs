use crate::app::authentication::Authentication;
use crate::context::Context;
use axum::extract::State;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use chrono::{DateTime, Utc};
use serde::Deserialize;
use std::ops::Not;
use tracing::info;
use uuid::Uuid;
use axum_extra::extract::Query;

pub fn router() -> Router<Context> {
    Router::new().route("/", get(get_products))
}

#[derive(Debug, Deserialize)]
struct GetProductsQuery {
    product_id: Option<Uuid>,
    created_at: Option<DateTime<Utc>>,
    limit: Option<i64>,

    ids: Vec<Uuid>,
}

async fn get_products(
    State(state): State<Context>,
    Query(query): Query<GetProductsQuery>,
) -> Response {
    info!("Received ids: {:?}", query.ids);

    let uses_ids = query.ids.is_empty().not();
    let uses_cursor = query.product_id.is_some() || query.created_at.is_some();

    let limit = query.limit.unwrap_or(24).clamp(1, 48);

    let products = match () {
        _ if uses_ids && uses_cursor.not() => state
            .0
            .database
            .get_products_by_ids(query.ids)
            .await
            .unwrap(),

        _ if uses_cursor && uses_ids.not() => state
            .0
            .database
            .get_products_by_cursor(limit, query.product_id.unwrap(), query.created_at.unwrap())
            .await
            .unwrap(),

        _ if uses_ids.not() && uses_cursor.not() => {
            state.0.database.get_products(limit).await.unwrap()
        }

        _ => {
            return (
                StatusCode::BAD_REQUEST,
                "Use either id filters or cursor pagination, not both",
            )
                .into_response();
        }
    };

    Json(products).into_response()
}
