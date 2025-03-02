use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
};

pub struct ServerError(anyhow::Error);

impl<E: Into<anyhow::Error>> From<E> for ServerError {
    fn from(value: E) -> Self {
        Self(value.into())
    }
}

impl IntoResponse for ServerError {
    fn into_response(self) -> Response {
        tracing::warn!("internal server error: {:?}", self.0);
        StatusCode::INTERNAL_SERVER_ERROR.into_response()
    }
}
