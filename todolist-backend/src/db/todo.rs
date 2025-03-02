use super::Db;

use sqlx::Row;

pub struct TodoEntry {
    pub id: u32,
    pub title: String,
    pub done: bool,
    pub created_at: u64,
}

impl TodoEntry {
    pub async fn get_all(db: &Db, user_id: u32) -> sqlx::Result<Vec<Self>> {
        Ok(sqlx::query(
            "select id, title, done, created_at from todo where user_id = ? order by id desc",
        )
        .bind(user_id)
        .map(|row| TodoEntry {
            id: row.get("id"),
            title: row.get("title"),
            done: row.get("done"),
            created_at: row.get("created_at"),
        })
        .fetch_all(&db.pool)
        .await?)
    }
}

pub struct TodoInsert {
    pub user_id: u32,
    pub title: String,
    pub done: bool,
}

impl TodoInsert {
    pub fn new(user_id: u32, title: String, done: bool) -> Self {
        Self {
            user_id,
            title,
            done,
        }
    }

    pub async fn insert(self, db: &Db) -> sqlx::Result<()> {
        sqlx::query("insert into todo (user_id, title, done) values (?, ?, ?)")
            .bind(self.user_id)
            .bind(self.title)
            .bind(self.done)
            .execute(&db.pool)
            .await?;
        Ok(())
    }
}

pub struct TodoUpdateDone {
    pub id: u32,
    pub done: bool,
}

impl TodoUpdateDone {
    pub fn new(id: u32, done: bool) -> Self {
        Self { id, done }
    }

    pub async fn update(self, db: &Db) -> sqlx::Result<()> {
        sqlx::query("update todo set done = ? where id = ?")
            .bind(self.done)
            .bind(self.id)
            .execute(&db.pool)
            .await?;
        Ok(())
    }
}

pub struct TodoDelete {
    pub id: u32,
}

impl TodoDelete {
    pub fn new(id: u32) -> Self {
        Self { id }
    }

    pub async fn delete(self, db: &Db) -> sqlx::Result<()> {
        sqlx::query("delete from todo where id = ?")
            .bind(self.id)
            .execute(&db.pool)
            .await?;
        Ok(())
    }
}
