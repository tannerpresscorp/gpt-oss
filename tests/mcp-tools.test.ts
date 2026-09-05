import { describe, expect, it } from "vitest";
import { getPhase1HealthGuide, listRoadmapTasks, recommendRoadmapTask } from "../mcp/tools.js";

describe("MCP roadmap tools", () => {
  it("returns structured filtered tasks", () => {
    const result = listRoadmapTasks({ phase: 4, workstream: "Cloudflare" });
    expect(result.tasks.map((task) => task.id)).toEqual(["4.1", "4.2"]);
    expect(result.count).toBe(2);
  });
  it("recommends a task with verification guidance", () => {
    const result = recommendRoadmapTask({ phase: 1, completedTaskIds: ["1.1"] });
    expect(result.task?.id).toBe("1.2");
    expect(result.task?.verification.length).toBeGreaterThan(0);
  });
  it("maps an unhealthy service to friendly recovery steps", () => {
    const result = getPhase1HealthGuide({ service: "ollama", state: "unhealthy" });
    expect(result.summary).toContain("Ollama");
    expect(result.steps.join(" ")).toContain("docker compose logs ollama");
  });
});
