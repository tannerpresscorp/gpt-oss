#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getPhase1HealthGuide, listRoadmapTasks, recommendRoadmapTask } from "./tools.js";

const server = new McpServer({ name: "gpt-oss-roadmap", version: "0.1.0" });

server.registerTool("list_roadmap_tasks", { title: "List roadmap tasks", description: "List GPT-OSS roadmap tasks filtered by phase, status, workstream, or search text.", inputSchema: { phase: z.number().int().min(1).max(4).optional(), status: z.enum(["not-started", "in-progress", "complete", "blocked", "all"]).optional(), workstream: z.string().optional(), query: z.string().optional() } }, async (input) => {
  const result = listRoadmapTasks(input);
  return { content: [{ type: "text", text: `${result.count} roadmap task${result.count === 1 ? "" : "s"} found.` }], structuredContent: result };
});

server.registerTool("recommend_next_task", { title: "Recommend the next task", description: "Return the earliest actionable roadmap task and its verification criteria.", inputSchema: { phase: z.number().int().min(1).max(4).optional(), completedTaskIds: z.array(z.string()).optional(), blockedTaskIds: z.array(z.string()).optional() } }, async (input) => {
  const result = recommendRoadmapTask(input);
  return { content: [{ type: "text", text: result.message }], structuredContent: result };
});

server.registerTool("get_phase1_health_guide", { title: "Diagnose Phase 1 health", description: "Return safe troubleshooting guidance for Ollama and Open WebUI container states.", inputSchema: { service: z.enum(["ollama", "open-webui", "all"]).optional(), state: z.enum(["starting", "unhealthy", "stopped", "unknown"]).optional() } }, async (input) => {
  const result = getPhase1HealthGuide(input);
  return { content: [{ type: "text", text: `${result.summary}\n${result.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}` }], structuredContent: result };
});

await server.connect(new StdioServerTransport());
