CREATE TABLE products
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name        TEXT    NOT NULL,
    description TEXT,

    price_cents BIGINT  NOT NULL CHECK (price_cents >= 0),
    currency    CHAR(3) NOT NULL DEFAULT 'AUD',

    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_reservations
(
    
);