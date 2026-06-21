#!/usr/bin/env bash
set -Eeuo pipefail

trap 'echo "ERROR at line $LINENO: $BASH_COMMAND" >&2' ERR

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <schema-file-path>" >&2
  exit 2
fi

SCHEMA_FILE_PATH="$1"

if [[ ! -f "$SCHEMA_FILE_PATH" ]]; then
  echo "Schema file does not exist: $SCHEMA_FILE_PATH" >&2
  exit 2
fi

TEMP_DB="schema_check_$(date +%s)_$RANDOM"

cleanup() {
  docker compose exec -T postgres dropdb -U admin --if-exists "$TEMP_DB" >/dev/null 2>&1 || true
}

trap cleanup EXIT
trap 'echo "ERROR at line $LINENO: $BASH_COMMAND" >&2' ERR

echo
echo "==> Creating temporary validation database: $TEMP_DB"
docker compose exec -T postgres createdb -U admin "$TEMP_DB"

echo
echo "==> Validating schema file: $SCHEMA_FILE_PATH"

if ! docker compose exec -T postgres \
  psql \
    -U admin \
    -d "$TEMP_DB" \
    -v ON_ERROR_STOP=1 \
    -f /dev/stdin < "$SCHEMA_FILE_PATH"
then
  echo
  echo "Schema validation failed."
  echo
  echo "Generated schema:"
  echo "  $SCHEMA_FILE_PATH"
  echo
  echo "Useful command:"
  echo "  nl -ba $SCHEMA_FILE_PATH | less"
  echo
  exit 1
fi

echo
echo "==> Schema validation passed"