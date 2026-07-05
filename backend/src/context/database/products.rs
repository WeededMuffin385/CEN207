use crate::context::database::{Database, Product};
use chrono::{DateTime, Utc};
use uuid::Uuid;

impl Database {
    pub async fn get_products(&self, limit: i64) -> sqlx::Result<Vec<Product>> {
        let rows = sqlx::query!(
            r#"
            SELECT *
            FROM products
            WHERE is_active = true
            ORDER BY created_at DESC, id DESC
            LIMIT $1
        "#,
            limit
        )
        .fetch_all(&self.pool)
        .await?;

        let products: Vec<_> = rows
            .into_iter()
            .map(|record| Product {
                id: record.id,
                title: record.title,
                description: record.description,
                price: record.price,
                currency: record.currency,
                rating: record.rating,
                reviews: record.reviews,
                created_at: record.created_at,
                image_url: "".to_string(),
            })
            .collect();

        Ok(products)
    }

    pub async fn get_products_by_cursor(
        &self,
        limit: i64,
        product_id: Uuid,
        created_at: DateTime<Utc>,
    ) -> sqlx::Result<Vec<Product>> {
        let rows = sqlx::query!(
            r#"
            SELECT *
            FROM products
            WHERE
                (created_at, id) < ($1, $2)
                AND is_active = true
            ORDER BY created_at DESC, id DESC
            LIMIT $3
        "#,
            created_at,
            product_id,
            limit
        )
        .fetch_all(&self.pool)
        .await?;

        let products: Vec<_> = rows
            .into_iter()
            .map(|record| Product {
                id: record.id,
                title: record.title,
                description: record.description,
                price: record.price,
                currency: record.currency,
                rating: record.rating,
                reviews: record.reviews,
                created_at: record.created_at,
                image_url: "".to_string(),
            })
            .collect();

        Ok(products)
    }

    pub async fn get_products_by_ids(&self, ids: Vec<Uuid>) -> sqlx::Result<Vec<Product>> {
        let rows = sqlx::query!(
            r#"
            SELECT *
            FROM products
            WHERE id = ANY($1)
            ORDER BY created_at DESC, id DESC
        "#,
            &ids
        )
        .fetch_all(&self.pool)
        .await?;

        let products: Vec<_> = rows
            .into_iter()
            .map(|record| Product {
                id: record.id,
                title: record.title,
                description: record.description,
                price: record.price,
                currency: record.currency,
                rating: record.rating,
                reviews: record.reviews,
                created_at: record.created_at,
                image_url: "".to_string(),
            })
            .collect();

        Ok(products)
    }
}
