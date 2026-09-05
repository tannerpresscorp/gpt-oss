#!/usr/bin/env node
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Command } from "commander";
import { listRoadmapTasks, recommendRoadmapTask } from "../mcp/tools.js";

const exec = promisify(execFile);
type Deps = { dockerAvailable?: () => Promise<boolean>; execute?: (file: string, args: string[]) => Promise<{ stdout: string; stderr: string }> };

const option = (args: string[], name: string) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };

export async function runCli(args: string[], deps: Deps = {}): Promise<Record<string, unknown>> {
  const dockerAvailable = deps.dockerAvailable ?? (async () => { try { await exec("docker", ["--version"]); return true; } catch { return false; } });
  const execute = deps.execute ?? (async (file, values) => exec(file, values));
  const clean = args.filter((arg) => arg !== "--json");
  if (clean[0] === "doctor") { const available = await dockerAvailable(); return { ok: available, auth: "not-required", docker: available ? "available" : "missing", roadmap: "bundled" }; }
  if (clean[0] === "roadmap" && clean[1] === "list") {
    const phase = Number(option(clean, "--phase")) || undefined;
    const limit = Math.min(Math.max(Number(option(clean, "--limit")) || 50, 1), 250);
    const result = listRoadmapTasks({ phase, status: option(clean, "--status") as never, workstream: option(clean, "--workstream"), query: option(clean, "--query") });
    const tasks = result.tasks.slice(0, limit);
    return { ok: true, count: tasks.length, total: result.count, tasks };
  }
  if (clean[0] === "roadmap" && clean[1] === "next") return { ok: true, ...recommendRoadmapTask({ phase: Number(option(clean, "--phase")) || undefined }) };
  if (clean[0] === "stack" && clean[1] === "start") {
    if (clean.includes("--dry-run")) return { ok: true, dryRun: true, command: "docker compose up -d" };
    if (!clean.includes("--yes")) return { ok: false, error: { code: "CONFIRMATION_REQUIRED", message: "Use --dry-run to preview or --yes to start services." } };
    const result = await execute("docker", ["compose", "up", "-d"]); return { ok: true, stdout: result.stdout.trim() };
  }
  if (clean[0] === "stack" && clean[1] === "status") { const result = await execute("docker", ["compose", "ps", "--format", "json"]); return { ok: true, output: result.stdout.trim() }; }
  return { ok: false, error: { code: "UNKNOWN_COMMAND", message: "Run gpt-oss --help for available commands." } };
}

async function main() {
  const program = new Command().name("gpt-oss").description("Manage the GPT-OSS roadmap and local stack.").option("--json", "emit stable JSON");
  program.command("doctor").description("check local prerequisites");
  const roadmap = program.command("roadmap").description("read the program roadmap");
  roadmap.command("list").description("list tasks").option("--phase <1-4>").option("--status <status>").option("--workstream <name>").option("--query <text>").option("--limit <count>");
  roadmap.command("next").description("recommend the next task").option("--phase <1-4>");
  const stack = program.command("stack").description("inspect or start the local stack");
  stack.command("status").description("read Docker Compose service status");
  stack.command("start").description("start services").option("--dry-run").option("--yes");
  if (process.argv.slice(2).includes("--help") || process.argv.length === 2) { program.parse(); return; }
  const result = await runCli(process.argv.slice(2));
  process.stdout.write(`${JSON.stringify(result, null, process.argv.includes("--json") ? 0 : 2)}\n`);
  if (!result.ok) process.exitCode = 1;
}

if (!process.env.VITEST) main().catch((error) => { process.stderr.write(`${JSON.stringify({ ok: false, error: { code: "UNEXPECTED", message: error instanceof Error ? error.message : String(error) } })}\n`); process.exitCode = 1; });
