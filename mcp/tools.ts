import { roadmapTasks, type TaskStatus } from "../src/data/roadmap.js";
import { filterTasks, recommendNextTask } from "../src/lib/roadmap.js";

export function listRoadmapTasks(input: { phase?: number; status?: TaskStatus | "all"; workstream?: string; query?: string }) {
  const tasks = filterTasks(roadmapTasks, input);
  return { count: tasks.length, tasks };
}

export function recommendRoadmapTask(input: { phase?: number; completedTaskIds?: string[]; blockedTaskIds?: string[] }) {
  const complete = new Set(input.completedTaskIds ?? []);
  const blocked = new Set(input.blockedTaskIds ?? []);
  const current = roadmapTasks.map((task) => ({ ...task, status: complete.has(task.id) ? "complete" as const : blocked.has(task.id) ? "blocked" as const : task.status }));
  const task = recommendNextTask(current, input.phase);
  return { task: task ?? null, message: task ? `Start with ${task.id}: ${task.title}.` : "No actionable task remains in this selection." };
}

export function getPhase1HealthGuide(input: { service?: "ollama" | "open-webui" | "all"; state?: "starting" | "unhealthy" | "stopped" | "unknown" }) {
  const service = input.service ?? "all";
  const label = service === "open-webui" ? "Open WebUI" : service === "ollama" ? "Ollama" : "Phase 1 services";
  const logs = service === "all" ? "docker compose logs --tail=100" : `docker compose logs ${service}`;
  const steps = input.state === "stopped"
    ? ["Run docker compose up -d.", "Run docker compose ps and wait for healthy status."]
    : [`Run ${logs} and inspect the latest error.`, "Run docker compose ps to confirm container health.", "Confirm the configured ports are available and Docker has enough memory.", "After correcting the cause, run docker compose up -d again."];
  return { summary: `${label} ${input.state === "starting" ? "may still be warming up" : "needs attention"}.`, steps };
}
