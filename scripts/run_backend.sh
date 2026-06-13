#!/usr/bin/env bash
set -Eeuo pipefail

on_error() {
    paplay /usr/share/sounds/freedesktop/stereo/dialog-error.oga || true
}
trap on_error ERR

TARGET="x86_64-unknown-linux-gnu"
PROFILE="release"
PACKAGE_BACKEND="backend"


if [[ $PROFILE == "release" ]]; then
    PROFILE_FLAG="--release"
else
    PROFILE_FLAG=""
fi


sudo -v

docker compose up -d postgres
until docker compose exec postgres pg_isready -U admin; do sleep 1; done

cargo build --target $TARGET --package $PACKAGE_BACKEND $PROFILE_FLAG
paplay /usr/share/sounds/freedesktop/stereo/complete.oga

export TARGET
export PROFILE
sudo -E docker compose up --build