import type { RoadmapTask, TaskStatus } from "../data/roadmap.js";

export interface TaskFilters {
  phase?: number;
  status?: TaskStatus | "all";
  workstream?: string;
  query?: string;
}

export function filterTasks(tasks: RoadmapTask[], filters: TaskFilters): RoadmapTask[] {
  const query = filters.query?.trim().toLowerCase();
  return tasks.filter((task) => {
    if (filters.phase && task.phase !== filters.phase) return false;
    if (filters.status && filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.workstream && filters.workstream !== "all" && task.workstream !== filters.workstream) return false;
    if (query && !`${task.id} ${task.title} ${task.description} ${task.workstream}`.toLowerCase().includes(query)) return false;
    return true;
  });
}

export function progressFor(tasks: RoadmapTask[], phase?: number): number {
  const selected = phase ? tasks.filter((task) => task.phase === phase) : tasks;
  return selected.length ? Math.round((selected.filter((task) => task.status === "complete").length / selected.length) * 100) : 0;
}

export function recommendNextTask(tasks: RoadmapTask[], phase?: number): RoadmapTask | undefined {
  const selected = tasks.filter((task) => (!phase || task.phase === phase) && task.status !== "complete" && task.status !== "blocked");
  return selected.sort((a, b) => a.phase - b.phase || Number(a.id) - Number(b.id))[0];
}

export function statusDistribution(tasks: RoadmapTask[], phase?: number) {
  const selected = phase ? tasks.filter((task) => task.phase === phase) : tasks;
  return selected.reduce((counts, task) => { counts[task.status] += 1; return counts; }, { "not-started": 0, "in-progress": 0, complete: 0, blocked: 0, total: selected.length });
}
