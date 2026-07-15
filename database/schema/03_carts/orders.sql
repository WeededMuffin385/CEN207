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
    id           UUID PRIMARY KEY      DEFAULT gen_random_uuid(),

    created_by   UUID         NOT NULL REFERENCES accounts (id),
    paid_by      UUID         NOT NULL REFERENCES accounts (id),

    status       order_status NOT NULL DEFAULT 'pending_payment',

    address      TEXT         NOT NULL,
    latitude     NUMERIC(9, 6),
    longitude    NUMERIC(9, 6),

    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    cancelled_at TIMESTAMPTZ,

    CHECK (latitude BETWEEN -90 AND 90),
    CHECK (longitude BETWEEN -180 AND 180)
);

CREATE TABLE order_products
(
    order_id   UUID    NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id UUID    NOT NULL REFERENCES products (id),

    quantity   INTEGER NOT NULL CHECK (quantity > 0),

    price      BIGINT  NOT NULL CHECK (price >= 0),
    currency   CHAR(3) NOT NULL,

    PRIMARY KEY (order_id, product_id)
);



CREATE TYPE order_member_role AS enum (
    'owner',
    'viewer'
);

CREATE TABLE order_members
(
    order_id   UUID              NOT NULL REFERENCES orders (id),
    account_id UUID              NOT NULL REFERENCES accounts (id),

    role       order_member_role NOT NULL DEFAULT 'viewer',

    PRIMARY KEY (order_id, account_id)
);