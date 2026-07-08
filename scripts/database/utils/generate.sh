#!/usr/bin/env bash
set -Eeuo pipefail

trap 'echo "ERROR at line $LINENO: $BASH_COMMAND" >&2' ERR

log() {
  echo
  echo "==> $*"
}

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <schema_dir> <output_schema_file>" >&2
  echo "Example: $0 database/schema database/schema.sql" >&2
  exit 1
fi

SCHEMA_PATH="$1"
SCHEMA_FILE_PATH="$2"

if [[ ! -d "$SCHEMA_PATH" ]]; then
  echo "Schema directory does not exist: $SCHEMA_PATH" >&2
  exit 1
fi

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