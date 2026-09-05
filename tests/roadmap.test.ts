import { describe, expect, it } from "vitest";
import { roadmapTasks } from "../src/data/roadmap.js";
import { filterTasks, progressFor, recommendNextTask, statusDistribution } from "../src/lib/roadmap.js";

describe("roadmap helpers", () => {
  it("filters by phase, status, workstream, and search text", () => {
    expect(filterTasks(roadmapTasks, { phase: 1, status: "in-progress", workstream: "Docker", query: "local AI" }).map((task) => task.id)).toEqual(["1.2"]);
  });
  it("returns zero progress for an empty selection", () => expect(progressFor([], 1)).toBe(0));
  it("recommends the earliest actionable task", () => expect(recommendNextTask(roadmapTasks, 1)?.id).toBe("1.1"));
  it("skips complete and blocked work", () => {
    const tasks = roadmapTasks.map((task) => task.id === "1.1" ? { ...task, status: "complete" as const } : task.id === "1.2" ? { ...task, status: "blocked" as const } : task);
    expect(recommendNextTask(tasks, 1)?.id).toBe("1.3");
  });
  it("calculates an honest status distribution", () => {
    expect(statusDistribution(roadmapTasks, 1)).toEqual({ "not-started": 5, "in-progress": 2, complete: 0, blocked: 0, total: 7 });
  });
});
