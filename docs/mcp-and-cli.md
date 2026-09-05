# MCP and CLI

## MCP server

Run the local stdio server with `npm run mcp`. It exposes three read-only tools:

- `list_roadmap_tasks`
- `recommend_next_task`
- `get_phase1_health_guide`

The server never starts containers or exposes model ports.

## Command-line interface

Build and install the local command with `npm run build` followed by `npm link`.

```bash
gpt-oss --json doctor
gpt-oss --json roadmap list --phase 1 --limit 20
gpt-oss --json roadmap next --phase 1
gpt-oss --json stack status
gpt-oss --json stack start --dry-run
```

Starting containers requires `gpt-oss --json stack start --yes`. Do not use that command unless changing local Docker state is intended.
