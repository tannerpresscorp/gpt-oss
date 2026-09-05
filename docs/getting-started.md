# Getting started

## What you are launching

Phase 1 runs two local services:

- **Ollama** hosts the GPT-OSS model.
- **Open WebUI** provides the browser interface.

Both ports bind to your computer's loopback interface by default. They are not exposed directly to the internet.

## Before you begin

Install Docker Desktop on Windows/macOS or Docker Engine with Compose on Linux. For `gpt-oss:20b`, plan for at least 16 GB of system memory and roughly 14 GB of model storage; additional capacity improves real-world performance.

## Launch

1. Copy `.env.example` to `.env`.
2. Replace `WEBUI_SECRET_KEY` with a long random value.
3. Run `docker compose up -d`.
4. Run `docker compose ps` and wait for both services to become healthy.
5. Open `http://localhost:3000`.

Pull the model with:

```bash
docker compose exec ollama ollama pull gpt-oss:20b
```

## If something is not healthy

Start with `docker compose logs --tail=100`, confirm ports 3000 and 11434 are free, and check Docker's available memory. The MCP tool `get_phase1_health_guide` and CLI command `gpt-oss --json doctor` provide the same recovery path in assistant-friendly formats.
