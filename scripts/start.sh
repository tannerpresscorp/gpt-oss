#!/usr/bin/env sh
set -eu
if ! command -v docker >/dev/null 2>&1; then echo "Docker is required. Install Docker Desktop or Docker Engine, then try again." >&2; exit 1; fi
if [ ! -f .env ]; then cp .env.example .env; echo "Created .env. Set WEBUI_SECRET_KEY, then run this script again."; exit 0; fi
docker compose up -d
docker compose ps
echo "Open WebUI: http://localhost:${OPEN_WEBUI_PORT:-3000}"
