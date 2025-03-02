use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    ServerError,
    db::{self, Db},
    handler::ResultResponse,
};

pub async fn update_done(
    State(db): State<Arc<Db>>,
    Json(value): Json<DoneRequest>,
) -> Result<Json<ResultResponse>, ServerError> {
    // FIXME: check id is owned by user_id
    db::todo::TodoUpdateDone::new(value.id, value.done)
        .update(&db)
        .await?;
    Ok(Json(ResultResponse { succsess: true }))
}

#[derive(Debug, serde::Deserialize)]
pub struct DoneRequest {
    pub id: u32,
    pub done: bool,
}
