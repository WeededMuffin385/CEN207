CREATE TABLE account_carts
(
    id         UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    name       TEXT        NOT NULL,
    account_id BIGINT      NOT NULL REFERENCES accounts (id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE account_cart_items
(
    cart_id    UUID        NOT NULL REFERENCES account_carts (id) ON DELETE CASCADE,
    product_id UUID        NOT NULL REFERENCES products (id) ON DELETE CASCADE,

    quantity   INTEGER     NOT NULL CHECK ( quantity > 0 ),


    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (cart_id, product_id)
);