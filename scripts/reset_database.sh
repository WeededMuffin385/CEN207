#!/usr/bin/env bash
set -Eeuo pipefail

cargo sqlx database reset -y