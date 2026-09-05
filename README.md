# GPT-OSS self-hosted platform

A secure, extensible Docker foundation for self-hosted GPT-OSS inference. It starts Ollama and Open WebUI with persistent storage, localhost-only exposure, health checks, log rotation, and optional vLLM/GPU serving.

## Quick start

1. Install Docker Engine or Docker Desktop with Compose v2.
2. Copy `.env.example` to `.env` and set `WEBUI_SECRET_KEY` to a unique random value (for example, `openssl rand -hex 32`).
3. On Linux/macOS, run `./scripts/start.sh`. On Windows PowerShell, run `.\scripts\start.ps1`.
4. Run `docker compose exec ollama ollama pull gpt-oss:20b`, then open `http://localhost:3000`.

Create the first Open WebUI administrator locally. Sign-up is disabled by default; explicitly enable it only during controlled initial provisioning.

## Operations

| Task | Command |
| --- | --- |
| View health and status | `docker compose ps` |
| Update images | `docker compose pull && docker compose up -d` |
| Back up persistent data | `./scripts/backup.sh` |
| Restore a backup | `./scripts/restore.sh backups/<timestamp>` |
| Stop services | `docker compose down` |

Backups contain chats and models and may contain sensitive data. Encrypt them and store them outside the host. Restore overwrites both persistent volumes.

## Inference

Ollama serves an OpenAI-compatible endpoint at `http://localhost:11434/v1`; clients use any OpenAI SDK with that base URL and a non-empty local API key placeholder. Start vLLM with `./scripts/start.sh --profile vllm`; its OpenAI-compatible endpoint is `http://localhost:8000/v1`. Pull or configure the model only after confirming available GPU memory and its license.

Use `docker-compose.gpu.yml` on NVIDIA hosts:

```sh
docker compose -f docker-compose.yml -f docker-compose.gpu.yml --profile vllm up -d
```

Install the NVIDIA Container Toolkit first. AMD support depends on the host ROCm release and image compatibility; use a ROCm-compatible inference image instead of this NVIDIA-oriented override.

## Production deployment

Do not publish these local ports directly. Put Cloudflare in front of Caddy, Traefik, or Nginx, terminate HTTPS at the proxy, apply rate limits and authentication there, and proxy only to the internal service network. Keep `.env` in a secret manager and rotate `WEBUI_SECRET_KEY` through a planned maintenance procedure. Open WebUI provides document ingestion, retrieval, citations, accounts, and role-aware administration; validate tenant and retention requirements before accepting sensitive documents.

Training, QLoRA, GGUF exports, agent tools, and production API services intentionally run as separately versioned workloads rather than inside the interactive inference Compose stack. Their required reproducibility, evaluation, and security controls are defined in the architecture documentation.

## Architecture

- [Platform overview](docs/architecture/platform-overview.md)
- [Docker Compose architecture](docs/architecture/docker-architecture.md)
- [Training pipeline](docs/architecture/training-pipeline.md)
- [Fine-tuning pipeline](docs/architecture/finetuning-pipeline.md)
- [Agent workflows](docs/architecture/agent-workflows.md)
- [CI/CD pipeline](docs/architecture/ci-cd-pipeline.md)

Mermaid source is versioned in [`docs/architecture/diagrams`](docs/architecture/diagrams) and can be rendered to SVG/PNG with Mermaid CLI in a documentation pipeline.