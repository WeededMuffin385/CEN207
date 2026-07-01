#!/usr/bin/env bash
set -Eeuo pipefail

trap 'echo "ERROR at line $LINENO: $BASH_COMMAND" >&2' ERR

log() {
  echo
  echo "==> $*"
}

SCHEMA_FILE_PATH="assets/database/schema.sql"
SCHEMA_PATH="database/schema"

MIGRATION_DIFF_PATH="assets/database/migrations"
MIGRATION_FILE_NAME="$(date +%Y%m%d%H%M%S)_schema_diff.sql"
MIGRATION_FILE_PATH="$MIGRATION_DIFF_PATH/$MIGRATION_FILE_NAME"
DATABASE_URL="postgres://admin:secret@localhost:5432/postgres"

mkdir -p $MIGRATION_DIFF_PATH

log "Starting Postgres"
docker compose up -d postgres

log "Waiting for Postgres"
until docker compose exec postgres pg_isready -U admin; do sleep 1; done

bash scripts/database/utils/generate.sh "$SCHEMA_PATH" "$SCHEMA_FILE_PATH"
bash scripts/database/utils/validate.sh "$SCHEMA_FILE_PATH"

log "Generating migration plan"

pg-schema-diff plan \
  --from-dsn "$DATABASE_URL" \
  --to-dir "$SCHEMA_FILE_PATH" \
  > "$MIGRATION_FILE_PATH"