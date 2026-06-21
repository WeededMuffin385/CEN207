#!/usr/bin/env bash
set -Eeuo pipefail

trap 'echo "ERROR at line $LINENO: $BASH_COMMAND" >&2' ERR

log() {
  echo
  echo "==> $*"
}

SCHEMA_FILE_PATH="database/schema.sql"
SCHEMA_PATH="database/schema"

MIGRATIONS_PATH="database/migrations"
MIGRATION_FILE_NAME="$(date +%Y%m%d%H%M%S)_schema_diff.sql"
MIGRATION_FILE_PATH="$MIGRATIONS_PATH/$MIGRATION_FILE_NAME"

DATABASE_URL="postgres://admin:secret@localhost:5432/postgres"


log "Starting Postgres"
docker compose up -d postgres

log "Waiting for Postgres"
until docker compose exec postgres pg_isready -U admin; do sleep 1; done


log "Generating combined schema: $SCHEMA_FILE_PATH"
{
  echo "-- Generated file. Do not edit manually."
  echo "-- Source: $SCHEMA_PATH/**/*.sql"
  echo

  find "$SCHEMA_PATH" -type f -name '*.sql' | sort | while read -r file; do
    echo
    echo "-- =================================================="
    echo "-- $file"
    echo "-- =================================================="
    cat "$file"
    echo
  done
} > "$SCHEMA_FILE_PATH"

bash scripts/database/validate_schema.sh "$SCHEMA_FILE_PATH"

log "Generating migration plan"

pg-schema-diff plan \
  --from-dsn "$DATABASE_URL" \
  --to-dir "$SCHEMA_FILE_PATH" \
  > "$MIGRATION_FILE_PATH"