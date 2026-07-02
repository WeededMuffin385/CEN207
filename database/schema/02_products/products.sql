CREATE TABLE products
(
    id             UUID PRIMARY KEY     DEFAULT gen_random_uuid(),

    name           TEXT        NOT NULL,
    description    TEXT,

    -- price is calculated in cents
    price          BIGINT      NOT NULL CHECK (price >= 0),
    currency       CHAR(3)     NOT NULL DEFAULT 'AUD',

    stock_quantity INT         NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active      BOOLEAN     NOT NULL DEFAULT TRUE,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_reservations
(
    product_id UUID REFERENCES products (id),
    account_id BIGINT REFERENCES accounts (id),
    quantity   BIGINT      NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '15 minutes',

    PRIMARY KEY (product_id, account_id)
);