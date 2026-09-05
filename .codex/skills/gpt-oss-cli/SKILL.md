---
name: gpt-oss-cli
description: Inspect the Tannerpress GPT-OSS roadmap and safely diagnose or start its local Docker Compose stack using the gpt-oss command.
---

# GPT-OSS CLI

Use this skill when work involves the roadmap or local Ollama/Open WebUI stack in `tannerpresscorp/gpt-oss`.

1. Verify installation with `command -v gpt-oss`.
2. Run `gpt-oss --json doctor` first. No authentication is required; Docker may be reported as missing.
3. Discover work with `gpt-oss --json roadmap list --phase 1 --limit 20`.
4. Choose work with `gpt-oss --json roadmap next --phase 1`.
5. Inspect services with `gpt-oss --json stack status`.

Starting services changes local Docker state. Preview with `gpt-oss --json stack start --dry-run`; use `gpt-oss --json stack start --yes` only when the user asked to start the stack.

The CLI does not manage credentials or expose local model ports. Do not modify, delete, or reset Docker volumes without separate explicit authorization.
