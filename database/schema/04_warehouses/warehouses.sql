CREATE TABLE warehouses
(
    id             UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    name           TEXT        NOT NULL,

    address_line_1 TEXT,
    address_line_2 TEXT,

    city           TEXT,
    region         TEXT,
    postal_code    TEXT,
    country_code   CHAR(2)     NOT NULL,

    latitude       NUMERIC(9, 6),
    longitude      NUMERIC(9, 6),

    is_active      BOOLEAN     NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    CHECK (latitude BETWEEN -90 AND 90),
    CHECK (longitude BETWEEN -180 AND 180)
);

CREATE TABLE warehouse_inventory
(
    product_id   UUID REFERENCES products (id),
    warehouse_id UUID REFERENCES warehouses (id),

    quantity     INTEGER     NOT NULL DEFAULT 0 CHECK ( quantity >= 0 ),
    reserved     INTEGER     NOT NULL DEFAULT 0 CHECK ( reserved >= 0 ),

    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CHECK (reserved <= quantity),

    PRIMARY KEY (product_id, warehouse_id)
);

CREATE TYPE warehouse_movement_type AS enum (
    'receipt',              -- stock receipt into a warehouse
    'reservation',          -- reservation for an order
    'reservation_release',  -- release of a reservation
    'sale',                 -- sale, actual stock deduction
    'return',               -- return of goods to a warehouse
    'adjustment',           -- manual inventory adjustment
    'transfer_out',         -- transfer out from a warehouse
    'transfer_in'           -- transfer into a warehouse
);

CREATE TABLE warehouse_movements
(
    id             UUID PRIMARY KEY                 DEFAULT gen_random_uuid(),

    product_id     UUID                    NOT NULL REFERENCES products (id),
    warehouse_id   UUID                    NOT NULL REFERENCES warehouses (id),

    movement_type  warehouse_movement_type NOT NULL,
    quantity       INTEGER                 NOT NULL CHECK (quantity > 0),

    reservation_id UUID,
    cart_id        UUID,
    order_id       UUID,
    account_id     UUID REFERENCES accounts (id),

    created_at     TIMESTAMPTZ             NOT NULL DEFAULT now()
);


CREATE TYPE warehouse_reservation_status AS enum (
    'active',    -- reservation is currently active and holds stock
    'confirmed', -- reservation has been confirmed and converted into a sale/order allocation
    'cancelled', -- reservation was manually canceled before confirmation
    'expired'    -- reservation expired automatically and released the held stock
);


CREATE TABLE warehouse_reservations
(
    id                 UUID PRIMARY KEY                      DEFAULT gen_random_uuid(),

    cart_id            UUID REFERENCES carts (id),
    order_id           UUID REFERENCES orders (id),

    quantity           INTEGER                      NOT NULL CHECK (quantity > 0),
    reservation_status warehouse_reservation_status NOT NULL DEFAULT 'active',

    product_id         UUID                         NOT NULL REFERENCES products (id),
    warehouse_id       UUID                         NOT NULL REFERENCES warehouses (id),

    expires_at         TIMESTAMPTZ,
    created_at         TIMESTAMPTZ                  NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ                  NOT NULL DEFAULT now(),

    FOREIGN KEY (product_id, warehouse_id) REFERENCES warehouse_inventory (product_id, warehouse_id),
    CHECK ( cart_id IS NOT NULL OR order_id IS NOT NULL )
);