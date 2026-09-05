$ErrorActionPreference = "Stop"
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw "Docker is required. Install Docker Desktop, then try again." }
if (-not (Test-Path .env)) { Copy-Item .env.example .env; Write-Host "Created .env. Set WEBUI_SECRET_KEY, then run this script again."; exit 0 }
docker compose up -d
docker compose ps
Write-Host "Open WebUI: http://localhost:3000"
