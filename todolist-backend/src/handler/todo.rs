pub mod done;

use std::sync::Arc;

use axum::{Json, extract::State};

use crate::{
    ServerError,
    db::{
        Db,
        todo::{TodoDelete, TodoEntry, TodoInsert},
    },
};

use super::ResultResponse;

pub async fn todo_get_all(State(db): State<Arc<Db>>) -> Result<Json<TodoGetAll>, ServerError> {
    let entries = TodoEntry::get_all(&db, 0).await?;

    Ok(Json(TodoGetAll {
        todos: entries
            .into_iter()
            .map(|e| Todo {
                id: e.id,
                title: e.title,
                done: e.done,
                created_at: e.created_at,
            })
            .collect(),
    }))
}

#[derive(Debug, serde::Serialize)]
pub struct TodoGetAll {
    todos: Vec<Todo>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Todo {
    pub id: u32,
    pub title: String,
    pub done: bool,
    pub created_at: u64,
}

pub async fn todo_add(
    State(db): State<Arc<Db>>,
    Json(req): Json<TodoAddRequest>,
) -> Result<Json<ResultResponse>, ServerError> {
    TodoInsert::new(0, req.title, false).insert(&db).await?;
    Ok(Json(ResultResponse { succsess: true }))
}

#[derive(Debug, serde::Deserialize)]
pub struct TodoAddRequest {
    pub title: String,
}

pub async fn todo_delete(
    State(db): State<Arc<Db>>,
    Json(req): Json<TodoDeleteRequest>,
) -> Result<Json<ResultResponse>, ServerError> {
    TodoDelete::new(req.id).delete(&db).await?;
    Ok(Json(ResultResponse { succsess: true }))
}

#[derive(Debug, serde::Deserialize)]
pub struct TodoDeleteRequest {
    pub id: u32,
}
