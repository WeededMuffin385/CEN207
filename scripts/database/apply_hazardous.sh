#!/usr/bin/env bash
set -Eeuo pipefail

trap 'echo "ERROR at line $LINENO: $BASH_COMMAND" >&2' ERR

log() {
  echo
  echo "==> $*"
}

SCHEMA_FILE_PATH="database/schema.sql"
SCHEMA_PATH="database/schema"

DATABASE_URL="postgres://admin:secret@localhost:5432/postgres"

docker compose up -d postgres
until docker compose exec postgres pg_isready -U admin; do sleep 1; done

bash scripts/database/generate.sh "$SCHEMA_PATH" "$SCHEMA_FILE_PATH"
bash scripts/database/validate.sh "$SCHEMA_FILE_PATH"

pg-schema-diff apply \
  --from-dsn "$DATABASE_URL" \
  --to-dir "$SCHEMA_FILE_PATH" \
  --allow-hazards DELETES_DATA