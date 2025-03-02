pub mod todo;

use sqlx::SqlitePool;

pub struct Db {
    pub(crate) pool: SqlitePool,
}

impl Db {
    pub async fn new(url: &str) -> sqlx::Result<Self> {
        Ok(Db {
            pool: SqlitePool::connect(url).await?,
        })
    }
}
