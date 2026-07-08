CREATE TYPE order_status AS enum (
    'pending_payment',   -- order has been created, but payment has not been completed yet
    'paid',              -- payment has been successfully completed
    'processing',        -- order is being prepared for fulfillment
    'delivered',         -- order has been delivered to the customer

    'partially_shipped', -- some items have been shipped, but the order is not fully shipped yet
    'shipped',           -- all items have been shipped

    'cancelled',         -- order was canceled before completion
    'refunded'           -- order payment has been refunded
);

CREATE TABLE orders
(
    id         UUID PRIMARY KEY      DEFAULT gen_random_uuid(),

    created_by UUID         NOT NULL REFERENCES accounts (id),
    paid_by    UUID         NOT NULL REFERENCES accounts (id),

    status     order_status NOT NULL DEFAULT 'pending_payment'
);



CREATE TYPE order_member_role AS enum (
    'owner',
    'viewer'
);

CREATE TABLE order_members
(
    order_id   UUID              NOT NULL REFERENCES orders (id),
    account_id UUID              NOT NULL REFERENCES accounts (id),

    role       order_member_role NOT NULL DEFAULT 'viewer'
);