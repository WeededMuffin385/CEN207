CREATE TABLE carts
(
    id         UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    name       TEXT        NOT NULL,
    created_by UUID        NOT NULL REFERENCES accounts (id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE cart_member_role AS enum (
    'owner',
    'editor',
    'viewer'
);

CREATE TABLE cart_members
(
    cart_id    UUID             NOT NULL REFERENCES carts (id),
    account_id UUID             NOT NULL REFERENCES accounts (id),

    role       cart_member_role NOT NULL DEFAULT 'editor',
    joined_at  TIMESTAMPTZ      NOT NULL DEFAULT now(),

    primary key (cart_id, account_id)
);

CREATE TABLE cart_products
(
    cart_id    UUID        NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
    product_id UUID        NOT NULL REFERENCES products (id) ON DELETE CASCADE,

    quantity   INTEGER     NOT NULL CHECK ( quantity > 0 ),

    added_by   uuid references accounts (id),
    updated_by uuid references accounts (id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (cart_id, product_id)
);