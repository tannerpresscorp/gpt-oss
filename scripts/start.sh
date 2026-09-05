#!/usr/bin/env sh
set -eu

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env. Set WEBUI_SECRET_KEY before starting services." >&2
  exit 1
fi

if grep -q '^WEBUI_SECRET_KEY=change-this-to-a-long-random-value$' .env; then
  echo "Set WEBUI_SECRET_KEY to a unique random value in .env before starting services." >&2
  exit 1
fi

docker compose config --quiet
docker compose up -d "$@"
docker compose ps

