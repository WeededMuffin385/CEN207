use crate::context::database::{Cart, CartItem, Database};
use std::collections::HashMap;
use uuid::Uuid;

impl Database {
    pub async fn get_carts(&self, account_id: Uuid) -> sqlx::Result<Vec<Cart>> {
        let rows = sqlx::query!(
            r#"
        SELECT
            c.id,
            c.name,
            cp.product_id AS "product_id?",
            cp.quantity AS "quantity?"
        FROM cart_members AS cm
        JOIN carts AS c
            ON c.id = cm.cart_id
        LEFT JOIN cart_products AS cp
            ON cp.cart_id = c.id
        WHERE cm.account_id = $1
        ORDER BY c.created_at, cp.created_at
        "#,
            account_id
        )
        .fetch_all(&self.pool)
        .await?;

        let mut carts_by_id: HashMap<Uuid, Cart> = HashMap::new();

        for row in rows {
            let cart = carts_by_id.entry(row.id).or_insert_with(|| Cart {
                id: row.id,
                name: row.name,
                items: Vec::new(),
            });

            if let (Some(product_id), Some(quantity)) = (row.product_id, row.quantity) {
                cart.items.push(CartItem {
                    product_id,
                    quantity,
                });
            }
        }

        Ok(carts_by_id.into_values().collect())
    }

    pub async fn create_cart(&self, account_id: Uuid, cart_name: &str) -> sqlx::Result<Cart> {
        let mut tx = self.pool.begin().await?;

        let row = sqlx::query!(
            r#"
        INSERT INTO carts (
            created_by,
            name
        )
        VALUES ($1, $2)
        RETURNING
            id,
            name
        "#,
            account_id,
            cart_name
        )
        .fetch_one(&mut *tx)
        .await?;

        sqlx::query!(
            r#"
        INSERT INTO cart_members (
            cart_id,
            account_id,
            role
        )
        VALUES (
            $1,
            $2,
            'owner'::cart_member_role
        )
        "#,
            row.id,
            account_id
        )
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;

        Ok(Cart {
            id: row.id,
            name: row.name,
            items: Vec::new(),
        })
    }

    pub async fn remove_cart(&self, account_id: Uuid, cart_id: Uuid) -> Result<(), sqlx::Error> {
        let result = sqlx::query!(
            r#"
        DELETE FROM carts AS c
        USING cart_members AS cm
        WHERE c.id = $2
          AND cm.cart_id = c.id
          AND cm.account_id = $1
          AND cm.role = 'owner'::cart_member_role
        "#,
            account_id,
            cart_id,
        )
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            panic!("failed to remove cart: cart_id={cart_id}, account_id={account_id}");
        }

        Ok(())
    }

    pub async fn cart_update_item_quantity(
        &self,
        account_id: Uuid,
        cart_id: Uuid,
        product_id: Uuid,
        quantity: i32,
    ) -> Result<(), sqlx::Error> {
        if quantity < 1 {
            panic!("quantity must be greater than 0");
        }

        let result = sqlx::query!(
            r#"
            UPDATE cart_products AS cp
            SET
                quantity = $4,
                updated_by = $1,
                updated_at = now()
            FROM cart_members AS cm
            WHERE cp.cart_id = $2
              AND cp.product_id = $3
              AND cm.cart_id = cp.cart_id
              AND cm.account_id = $1
              AND cm.role IN ('owner', 'editor')
        "#,
            account_id,
            cart_id,
            product_id,
            quantity,
        )
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            panic!(
                "cart product was not updated: cart_id={cart_id}, product_id={product_id}, account_id={account_id}"
            );
        }

        Ok(())
    }

    pub async fn cart_remove_item(
        &self,
        account_id: Uuid,
        cart_id: Uuid,
        product_id: Uuid,
    ) -> Result<(), sqlx::Error> {
        let result = sqlx::query!(
            r#"
        DELETE FROM cart_products AS cp
        USING cart_members AS cm
        WHERE cp.cart_id = $2
          AND cp.product_id = $3
          AND cm.cart_id = cp.cart_id
          AND cm.account_id = $1
          AND cm.role IN (
              'owner'::cart_member_role,
              'editor'::cart_member_role
          )
        "#,
            account_id,
            cart_id,
            product_id,
        )
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            panic!(
                "failed to remove cart item: account_id={account_id}, cart_id={cart_id}, product_id={product_id}"
            );
        }

        Ok(())
    }

    pub async fn cart_add_item(
        &self,
        account_id: Uuid,
        cart_id: Uuid,
        product_id: Uuid,
        quantity: i32,
    ) -> Result<(), sqlx::Error> {
        if quantity < 1 {
            panic!("quantity must be greater than 0");
        }

        let result = sqlx::query!(
            r#"
        INSERT INTO cart_products (
            cart_id,
            product_id,
            quantity,
            added_by,
            updated_by
        )
        SELECT
            $2,
            $3,
            $4,
            $1,
            $1
        FROM cart_members AS cm
        WHERE cm.cart_id = $2
          AND cm.account_id = $1
          AND cm.role IN (
              'owner'::cart_member_role,
              'editor'::cart_member_role
          )
        ON CONFLICT (cart_id, product_id)
        DO UPDATE SET
            quantity = cart_products.quantity + EXCLUDED.quantity,
            updated_by = EXCLUDED.updated_by,
            updated_at = now()
        "#,
            account_id,
            cart_id,
            product_id,
            quantity,
        )
        .execute(&self.pool)
        .await?;

        if result.rows_affected() == 0 {
            panic!(
                "failed to add product to cart: cart_id={cart_id}, product_id={product_id}, account_id={account_id}"
            );
        }

        Ok(())
    }
}
