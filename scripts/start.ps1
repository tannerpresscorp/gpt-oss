$ErrorActionPreference = "Stop"

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    throw "Created .env. Set WEBUI_SECRET_KEY before starting services."
}

if (Select-String -Path ".env" -Pattern '^WEBUI_SECRET_KEY=change-this-to-a-long-random-value$' -Quiet) {
    throw "Set WEBUI_SECRET_KEY to a unique random value in .env before starting services."
}

docker compose config --quiet
docker compose up -d @args
docker compose ps
