# GPT-OSS Platform

A user-friendly roadmap console, local Ollama/Open WebUI stack, and focused MCP server for the Tannerpress GPT-OSS program.

## Start here

### 1. Clone and configure

```bash
git clone https://github.com/tannerpresscorp/gpt-oss.git
cd gpt-oss
cp .env.example .env
```

Replace `WEBUI_SECRET_KEY` in `.env` with a long random value. Do not commit `.env`.

### 2. Start the local AI stack

Linux/macOS:

```bash
./scripts/start.sh
```

Windows PowerShell:

```powershell
.\scripts\start.ps1
```

Or use Docker directly:

```bash
docker compose up -d
docker compose ps
```

Open `http://localhost:3000`. Ollama listens at `http://localhost:11434`; both ports bind to loopback only.

### 3. Pull the default model

```bash
docker compose exec ollama ollama pull gpt-oss:20b
```

The official Ollama catalog currently lists `gpt-oss:20b` at about 14 GB with a 128K context window and notes that the smaller model can run on systems with as little as 16 GB of memory. Real throughput still depends on CPU, GPU, memory bandwidth, and context size.

## Roadmap console

```bash
npm install
npm run dev
```

The console provides phase navigation, filters, expandable verification criteria, saved local progress, risks, and copyable launch commands. Progress stays in the browser and is never uploaded.

## MCP server

```bash
npm run mcp
```

Add this server to an MCP client using command `npm`, arguments `run mcp`, and this repository as the working directory.

Available tools:

- `list_roadmap_tasks` filters the authoritative roadmap.
- `recommend_next_task` selects the earliest actionable task.
- `get_phase1_health_guide` explains safe recovery steps for Ollama/Open WebUI.

The MCP tools are read-only. They do not run Docker commands or expose local services.

## CLI

Build and link the project command:

```bash
npm run build
npm link
gpt-oss --help
```

Common workflows:

```bash
gpt-oss --json doctor
gpt-oss --json roadmap list --phase 1 --limit 20
gpt-oss --json roadmap next --phase 1
gpt-oss --json stack status
gpt-oss --json stack start --dry-run
gpt-oss --json stack start --yes
```

JSON success responses use `{ "ok": true, ... }`; errors use `{ "ok": false, "error": { "code", "message" } }`. The CLI requires no authentication and does not read secrets. Starting containers requires the explicit `--yes` flag.

## Optional NVIDIA GPU

Install the NVIDIA Container Toolkit, confirm `docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi` succeeds, then run:

```bash
docker compose -f docker-compose.yml -f docker-compose.gpu.yml up -d
```

## Operations

Update images:

```bash
docker compose pull
docker compose up -d
```

View health and logs:

```bash
docker compose ps
docker compose logs --tail=100
```

Back up named volumes:

```bash
docker run --rm -v gpt-oss_ollama-data:/source:ro -v "$PWD/backups:/backup" alpine tar czf /backup/ollama-data.tgz -C /source .
docker run --rm -v gpt-oss_open-webui-data:/source:ro -v "$PWD/backups:/backup" alpine tar czf /backup/open-webui-data.tgz -C /source .
```

Restore only while services are stopped. Inspect archives before extraction and restore into the matching named volume.

Upgrade safely by creating backups, pinning tested image tags in `docker-compose.yml`, pulling images, starting the stack, and verifying health before removing old backups.

## Cloudflare deployment

```bash
npx wrangler whoami
npm run deploy
curl https://gpt-oss-roadmap.<account>.workers.dev/health
```

Map `gpt-oss.tannerpress.net` only after the Worker deployment is healthy and the zone is confirmed. Protect administrative or future authenticated capabilities with Cloudflare Access. Do not proxy local Ollama directly to the public internet.

Workers Static Assets is used because Cloudflare recommends it for new single-page applications. The Worker script owns `/health`; unmatched requests are served from the Vite build through the `ASSETS` binding.

## Optional reverse proxy and HTTPS

For LAN-only use, keep the default loopback bindings and use an authenticated reverse proxy. For remote use, prefer Cloudflare Tunnel with Access policies, service tokens where appropriate, origin validation, WAF rules, and rate limits. TLS termination does not replace application authentication.

## Development checks

```bash
npm test
npm run typecheck
npm run build
docker compose --env-file .env.example config
docker compose --env-file .env.example -f docker-compose.yml -f docker-compose.gpu.yml config
```

See [architecture diagrams](docs/architecture/README.md) and [SPEC.md](SPEC.md).

## GitBook documentation

The repository root is configured as a GitBook source through `.gitbook.yaml` and `SUMMARY.md`. GitHub Actions validates the navigation and local Markdown links on pull requests and on pushes to `main`:

```bash
npm run docs:check
```

To publish, connect a GitBook organization and space, enable Git Sync for `tannerpresscorp/gpt-oss`, and select `main`. GitBook will then synchronize reviewed documentation after the pull request is merged.
