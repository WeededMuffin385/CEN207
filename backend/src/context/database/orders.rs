use crate::context::database::Database;
use rust_decimal::Decimal;
use serde::Serialize;
use sqlx::FromRow;
use uuid::Uuid;

impl Database {
    pub async fn get_orders(&self, account_id: Uuid) -> sqlx::Result<Vec<Order>> {
        sqlx::query_as!(
            Order,
            r#"
        SELECT
            o.id,
            o.created_by,
            o.paid_by,
            o.status AS "status: OrderStatus",

            o.address,
            o.latitude AS "latitude!: Decimal",
            o.longitude AS "longitude!: Decimal",
            o.created_at,
            o.updated_at,
            o.cancelled_at
        FROM orders AS o
        WHERE
            o.created_by = $1
            OR o.paid_by = $1
            OR EXISTS (
                SELECT 1
                FROM order_members AS om
                WHERE om.order_id = o.id
                  AND om.account_id = $1
            )
        ORDER BY o.created_at DESC, o.id DESC
        "#,
            account_id,
        )
        .fetch_all(&self.pool)
        .await
    }

    pub async fn cancel_order(&self, account_id: Uuid, order_id: Uuid) -> sqlx::Result<Option<CancelledOrder>> {
        let result = sqlx::query_as!(
            CancelledOrder,
            r#"
        UPDATE orders AS o
        SET
            status = 'cancelled',
            cancelled_at = now(),
            updated_at = now()
        WHERE
            o.id = $1
            AND o.status IN ('pending_payment', 'paid')
            AND (
                o.created_by = $2
                OR EXISTS (
                    SELECT 1
                    FROM order_members AS om
                    WHERE om.order_id = o.id
                      AND om.account_id = $2
                      AND om.role = 'owner'
                )
            )
        RETURNING
            o.id,
            o.status AS "status: OrderStatus",
            o.cancelled_at AS "cancelled_at!"
        "#,
            order_id,
            account_id,
        )
        .fetch_optional(&self.pool)
        .await;

        result
    }
}

#[derive(Debug, Serialize, FromRow)]
pub struct Order {
    id: Uuid,
    created_by: Uuid,
    paid_by: Uuid,
    status: OrderStatus,

    address: String,

    latitude: Decimal,
    longitude: Decimal,

    created_at: chrono::DateTime<chrono::Utc>,
    updated_at: chrono::DateTime<chrono::Utc>,
    cancelled_at: Option<chrono::DateTime<chrono::Utc>>,
}

#[derive(Debug, Serialize, sqlx::Type)]
#[sqlx(type_name = "order_status", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum OrderStatus {
    PendingPayment,
    Paid,
    Processing,
    Delivered,
    PartiallyShipped,
    Shipped,
    Cancelled,
    Refunded,
}

#[derive(Debug, FromRow, Serialize)]
pub struct CancelledOrder {
    id: Uuid,
    status: OrderStatus,
    cancelled_at: chrono::DateTime<chrono::Utc>,
}
