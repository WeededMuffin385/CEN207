mod app;
mod context;

use crate::context::Context;
use axum::extract::DefaultBodyLimit;
use axum::http::header::*;
use tower_http::sensitive_headers::SetSensitiveHeadersLayer;
use tower_http::trace::TraceLayer;
use tracing::info;
use tracing_subscriber::EnvFilter;

const GLOBAL_BODY_LIMIT: usize = 2_usize.pow(16);

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    info!("Hello, World!");

    let context = Context::new().await;

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    axum::serve(
        listener,
        app::router()
            .with_state(context)
            .layer(SetSensitiveHeadersLayer::new([
                AUTHORIZATION,
                SET_COOKIE,
                COOKIE,
            ]))
            .layer(TraceLayer::new_for_http())
            .layer(DefaultBodyLimit::max(GLOBAL_BODY_LIMIT)),
    )
    .await
    .unwrap();
}
