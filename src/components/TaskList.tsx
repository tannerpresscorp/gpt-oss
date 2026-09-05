import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { RoadmapTask, TaskStatus } from "../data/roadmap";

const statusNames: Record<TaskStatus, string> = { "not-started": "Not started", "in-progress": "In progress", complete: "Complete", blocked: "Blocked" };

export function TaskList({ tasks, statuses, onStatusChange }: { tasks: RoadmapTask[]; statuses: Record<string, TaskStatus>; onStatusChange: (id: string, status: TaskStatus) => void }) {
  const [open, setOpen] = useState<string | null>(tasks[0]?.id ?? null);
  if (!tasks.length) return <div className="empty"><h3>No tasks match those filters.</h3><p>Try clearing a filter or searching for a broader term.</p></div>;
  return <div className="task-list" aria-live="polite">
    {tasks.map((task) => {
      const isOpen = open === task.id;
      const status = statuses[task.id] ?? task.status;
      return <article className={`task-row ${isOpen ? "is-open" : ""}`} key={task.id}>
        <button className="task-summary" onClick={() => setOpen(isOpen ? null : task.id)} aria-expanded={isOpen}>
          <span className="task-id">{task.id}</span>{isOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
          <strong>{task.title}</strong><span className="workstream">{task.workstream}</span>
          <span className={`status-dot ${status}`} /> <span className="status-name">{statusNames[status]}</span>
        </button>
        {isOpen && <div className="task-details">
          <div><p>{task.description}</p><h4>How you’ll know it’s done</h4><ul>{task.verification.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <label>Update progress<select value={status} onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}>{Object.entries(statusNames).map(([value, name]) => <option value={value} key={value}>{name}</option>)}</select><small>Saved automatically on this device.</small></label>
        </div>}
      </article>;
    })}
  </div>;
}
