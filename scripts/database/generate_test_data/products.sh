#!/usr/bin/env bash
set -euo pipefail

set -a
source .env
set +a

psql "$DATABASE_URL" << 'SQL'
INSERT INTO products (title, description, price)
SELECT
  'Product ' || n,
  'Random description for product ' || n,
  -- (1.00, 10_000.00)
  (100 + (random() * 1000000))::BIGINT
FROM generate_series(1, 8192) AS n;
SQL