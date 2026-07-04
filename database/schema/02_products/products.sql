CREATE TABLE products
(
    id          UUID PRIMARY KEY     DEFAULT gen_random_uuid(),

    title       TEXT        NOT NULL,
    description TEXT        NOT NULL,

    -- price is calculated in cents
    price       BIGINT      NOT NULL CHECK (price >= 0),
    currency    CHAR(3)     NOT NULL DEFAULT 'AUD',

    rating      REAL        NOT NULL DEFAULT 0 CHECK ( rating >= 0 AND rating <= 5 ),
    reviews     INTEGER     NOT NULL DEFAULT 0,

    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,

    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE product_reviews
(
    id         UUID PRIMARY KEY     DEFAULT gen_random_uuid(),

    product_id UUID        NOT NULL REFERENCES products (id),
    account_id UUID        NOT NULL REFERENCES accounts (id),

    rating     REAL        NOT NULL CHECK ( rating BETWEEN 0 AND 5),
    title      TEXT,
    body       TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    unique (product_id, account_id)
);