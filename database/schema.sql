-- Generated file. Do not edit manually.
-- Source: database/schema/**/*.sql


-- ==================================================
-- database/schema/accounts/accounts.sql
-- ==================================================
CREATE TABLE accounts
(
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE account_sessions
(
    token      BYTEA PRIMARY KEY,
    account_id BIGINT      NOT NULL REFERENCES accounts (id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '12 hours'
);

CREATE TYPE account_identity_provider AS ENUM (
    'google',
    'guest'
);

CREATE TABLE account_identities
(
    account_id          BIGINT                    NOT NULL REFERENCES accounts (id),
    provider            account_identity_provider NOT NULL,
    provider_account_id TEXT                      NOT NULL,

    created_at          TIMESTAMPTZ               NOT NULL DEFAULT NOW(),

    PRIMARY KEY (account_id, provider),
    UNIQUE (provider, provider_account_id)
);



-- ==================================================
-- database/schema/products/products.sql
-- ==================================================
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
