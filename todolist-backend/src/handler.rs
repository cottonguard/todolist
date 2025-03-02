pub mod todo;

#[derive(Debug, serde::Serialize)]
pub struct ResultResponse {
    pub succsess: bool,
}
