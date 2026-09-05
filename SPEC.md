# GPT-OSS Platform — Phase 1 Specification

## Value Proposition

Give Tannerpress engineers one place to launch a private local AI stack and track the larger GPT-OSS program from workstation setup through production deployment.

**Primary users:** Tannerpress engineers and technical administrators.

**Current pain:** The source roadmap is a static checklist. It does not provide runnable infrastructure, environment validation, progress state, or an assistant-friendly interface.

**Core web actions:**

1. Review and filter roadmap tasks by phase, status, and workstream.
2. Update task status locally and inspect completion/risk summaries.
3. Copy or download the commands needed to start and validate Phase 1.

**Core MCP actions:**

1. List roadmap tasks using phase, status, or workstream filters.
2. Recommend the next actionable task with blockers and verification steps.
3. Read Phase 1 service health and return human-readable remediation guidance.

## Why MCP and an LLM?

The web console is the complete visual management surface. The MCP server stays intentionally narrow: an engineer can ask, “What should I do next?”, “Show blocked infrastructure work,” or “Why is Open WebUI unhealthy?” without manually traversing the roadmap.

The assistant contributes intent parsing, prioritization, and explanation. The MCP server supplies authoritative roadmap data and safe, read-only health information. Mutating infrastructure and running shell commands remain explicit user actions outside the assistant in this release.

## UI Overview

**First view:** A responsive program overview with phase progress, immediate Phase 1 launch guidance, and current risks.

**Key interactions:** Phase navigation, text/status/workstream filters, expandable task details, local progress updates, reset, and command copying.

**End state:** The user has a clear next task, the exact command to run, and visible verification criteria.

## Phase 1 Infrastructure

- Docker Compose stack with Ollama and Open WebUI.
- Persistent model and application data volumes.
- Health checks, restart policies, bounded log rotation, and environment configuration.
- CPU-first base configuration and optional NVIDIA GPU override.
- `.env.example`, `.gitignore`, Linux shell launcher, and Windows PowerShell launcher.
- Cross-platform install, start, verify, update, backup, restore, and upgrade documentation.
- Optional reverse-proxy and HTTPS guidance without committing credentials.

## Web Application

- React, TypeScript, and Vite.
- Roadmap data stored in a typed, versioned source file.
- Browser-local task status persistence; no account system or remote database in the MVP.
- Accessible keyboard operation, visible focus states, reduced-motion support, empty states, and responsive layouts.
- Cloudflare Workers static-assets deployment.
- Health endpoint suitable for deployment verification.

## MCP Server

- TypeScript server using the MCP SDK and stdio transport for local clients.
- Read-only tools: `list_roadmap_tasks`, `recommend_next_task`, and `get_phase1_health_guide`.
- Shared roadmap schema with the web app to prevent drift.
- Structured tool output plus concise assistant-readable text.

## UX Flows and MCP API

**Review work (web UI):** Choose a phase, filter its tasks, expand a task, review verification criteria, and save a local status.

**Choose next work (assistant):** Ask for the next task, optionally provide a phase plus completed/blocked IDs, and receive one actionable task with verification criteria.

**Diagnose local health (assistant):** Name Ollama, Open WebUI, or both plus the observed state, and receive safe inspection and recovery steps.

**Tool: `list_roadmap_tasks`** — input `{ phase?, status?, workstream?, query? }`; output `{ count, tasks[] }`.

**Tool: `recommend_next_task`** — input `{ phase?, completedTaskIds?, blockedTaskIds? }`; output `{ task, message }`.

**Tool: `get_phase1_health_guide`** — input `{ service?, state? }`; output `{ summary, steps[] }`.

The full roadmap needs a standalone web UI; these focused assistant flows intentionally do not embed the dashboard in conversation.

## CI/CD and Repository Policy

- Repository target: `tannerpresscorp/gpt-oss`.
- Changes are made on feature branches and submitted through pull requests.
- No direct implementation commits to `main` after repository initialization.
- CI runs type checks, tests, production builds, Docker Compose validation, and secret scanning checks where practical.
- Cloudflare deployment uses Wrangler and excludes secrets from source control.

## Source Roadmap

The supplied Safari web archive is the source for the four phases and deliverables. The application normalizes that checklist into structured roadmap records. The apparent hostname typo is normalized to `gpt-oss.tannerpress.net`, pending DNS availability.

## Security and Boundaries

- No secrets in client code, repository files, or generated artifacts.
- Local Ollama/Open WebUI ports bind to loopback by default.
- Cloudflare Access, Tunnel, WAF, and rate limiting are documented as production hardening steps; they are not silently enabled without confirmed account and zone targets.
- The deployed roadmap console does not expose the local Ollama API to the public internet.

## Acceptance Criteria

- `docker compose config` validates both base and GPU configurations.
- Unit tests validate roadmap filtering, progress calculation, next-task selection, and MCP tool results.
- The web app builds and passes desktop/mobile browser checks.
- The MCP server builds and responds correctly to all three tools.
- README includes clone, configure, start, verify, update, backup, restore, and troubleshooting workflows.
- GitHub repository and pull request exist, Cloudflare deployment returns a healthy response, and matching Linear/Jira implementation issues are created.
