use axum::http::StatusCode;
use axum::Json;
use axum::response::{IntoResponse, Response};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AuthRejectionCode {
    MissingSession,
    SessionExpired,
    DatabaseError,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AuthRejection {
    pub code: AuthRejectionCode,
    pub message: String,
}

impl IntoResponse for AuthRejectionCode {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AuthRejectionCode::MissingSession => {
                (StatusCode::UNAUTHORIZED, "Session cookie is missing")
            }
            AuthRejectionCode::SessionExpired => (StatusCode::UNAUTHORIZED, "Session expired"),
            AuthRejectionCode::DatabaseError => {
                (StatusCode::INTERNAL_SERVER_ERROR, "Database error")
            }
        };

        let body = Json(AuthRejection {
            code: self,
            message: message.to_string(),
        });

        (status, body).into_response()
    }
}
