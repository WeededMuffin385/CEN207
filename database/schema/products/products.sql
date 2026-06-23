CREATE TABLE products
(
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name           TEXT        NOT NULL,
    description    TEXT,

    -- price is calculated in cents
    price          BIGINT      NOT NULL CHECK (price >= 0),
    currency       CHAR(3)     NOT NULL DEFAULT 'AUD',

    stock_quantity INT         NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active      BOOLEAN     NOT NULL DEFAULT TRUE,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_reservations
(
    product_id BIGINT REFERENCES products (id),
    account_id BIGINT REFERENCES accounts (id),
    quantity   BIGINT      NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '15 minutes',

    PRIMARY KEY (product_id, account_id)
);