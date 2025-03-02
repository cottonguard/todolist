pub mod db;
mod error;
pub mod handler;

pub use error::*;

use std::{env, sync::Arc};

use axum::{
    Router,
    routing::{delete, get, post, put},
};
use db::Db;
use tower::ServiceBuilder;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    _ = dotenvy::dotenv();

    let db = Arc::new(
        Db::new(
            env::var("DATABASE_URL")
                .as_deref()
                .unwrap_or("sqlite::memory:"),
        )
        .await?,
    );

    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/todo", get(handler::todo::todo_get_all))
        .route("/todo", post(handler::todo::todo_add))
        .route("/todo", delete(handler::todo::todo_delete))
        .route("/todo/done", put(handler::todo::done::update_done))
        .with_state(db.clone())
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(CorsLayer::new()),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}
