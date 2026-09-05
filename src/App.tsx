import { AlertTriangle, ArrowRight, CheckCircle2, Menu, RotateCcw, Search, Settings2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyCommand } from "./components/CopyCommand";
import { TaskList } from "./components/TaskList";
import { phases, risks, roadmapTasks, type TaskStatus } from "./data/roadmap";
import { filterTasks, progressFor, recommendNextTask, statusDistribution } from "./lib/roadmap";

const STORAGE_KEY = "gpt-oss-roadmap-status-v1";
const saved = (): Record<string, TaskStatus> => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; } };

export default function App() {
  const [phase, setPhase] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [workstream, setWorkstream] = useState("all");
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(saved);
  const [menu, setMenu] = useState(false);
  const mergedTasks = useMemo(() => roadmapTasks.map((task) => ({ ...task, status: statuses[task.id] ?? task.status })), [statuses]);
  const shown = filterTasks(mergedTasks, { phase, query, status, workstream });
  const activePhase = phases[phase - 1];
  const next = recommendNextTask(mergedTasks, phase);
  const distribution = statusDistribution(mergedTasks, phase);
  const workstreams = [...new Set(roadmapTasks.filter((task) => task.phase === phase).map((task) => task.workstream))];
  const updateStatus = (id: string, nextStatus: TaskStatus) => setStatuses((current) => { const updated = { ...current, [id]: nextStatus }; localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); return updated; });
  const selectPhase = (id: number) => { setPhase(id); setQuery(""); setStatus("all"); setWorkstream("all"); setMenu(false); };
  return <div className="app-shell">
    <header><button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Open phases">{menu ? <X /> : <Menu />}</button><a className="brand" href="#top"><span>GPT-OSS</span> Platform</a><button className="utility" onClick={() => document.getElementById("tasks")?.scrollIntoView({ behavior: "smooth" })}><Settings2 size={17} /> Manage tasks</button></header>
    <aside className={menu ? "open" : ""} aria-label="Program phases"><p>Your roadmap</p>{phases.map((item) => <button key={item.id} className={phase === item.id ? "active" : ""} onClick={() => selectPhase(item.id)}><span>{item.id}</span><span>{item.shortName}<small>{progressFor(mergedTasks, item.id)}% complete</small></span></button>)}</aside>
    <main id="top">
      <section className="intro"><div><p>Phase {phase} of 4</p><h1>{activePhase.name}</h1><span>{activePhase.description}</span></div><div className="saved"><CheckCircle2 size={17} /> Progress saves on this device</div></section>
      <section className="phase-track" aria-label="Overall program progress">{phases.map((item) => <button key={item.id} onClick={() => selectPhase(item.id)} className={phase === item.id ? "active" : ""}><span>{item.id}</span><strong>{item.shortName}</strong><small>{progressFor(mergedTasks, item.id)}%</small><i><b style={{ width: `${progressFor(mergedTasks, item.id)}%` }} /></i></button>)}</section>
      {phase === 1 && <section className="launch-panel"><div><h2>Start here</h2><p>Launch your private AI workspace in two steps. The setup keeps model services on your computer by default.</p></div><CopyCommand label="1. Start the services" command="docker compose up -d" /><CopyCommand label="2. Check they’re ready" command="docker compose ps" /></section>}
      <section className="roadmap" id="tasks"><div className="section-title"><div><h2>Roadmap tasks</h2><p>{shown.length} of {mergedTasks.filter((task) => task.phase === phase).length} tasks shown</p></div>{Object.keys(statuses).length > 0 && <button className="reset" onClick={() => { localStorage.removeItem(STORAGE_KEY); setStatuses({}); }}><RotateCcw size={15} /> Reset my progress</button>}</div>
        <div className="filters"><label className="search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks in this phase" aria-label="Search roadmap tasks" /></label><select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus | "all")} aria-label="Filter by status"><option value="all">All statuses</option><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="complete">Complete</option><option value="blocked">Blocked</option></select><select value={workstream} onChange={(event) => setWorkstream(event.target.value)} aria-label="Filter by workstream"><option value="all">All workstreams</option>{workstreams.map((item) => <option key={item}>{item}</option>)}</select></div>
        <TaskList tasks={shown} statuses={statuses} onStatusChange={updateStatus} />
      </section>
      <section className="analytics" aria-labelledby="analytics-title"><div><h2 id="analytics-title">Phase {phase} progress</h2><p>Task status distribution · {distribution.total} tasks</p></div><div className="distribution" aria-label={`${distribution.complete} complete, ${distribution["in-progress"]} in progress, ${distribution.blocked} blocked, ${distribution["not-started"]} not started`}>{(["complete", "in-progress", "blocked", "not-started"] as TaskStatus[]).map((key) => distribution[key] > 0 && <span key={key} className={key} style={{ width: `${distribution[key] / distribution.total * 100}%` }} />)}</div><ul><li><i className="complete" />Complete <strong>{distribution.complete}</strong></li><li><i className="in-progress" />In progress <strong>{distribution["in-progress"]}</strong></li><li><i className="blocked" />Blocked <strong>{distribution.blocked}</strong></li><li><i className="not-started" />Not started <strong>{distribution["not-started"]}</strong></li></ul></section>
      <section className="bottom-grid"><div className="risks"><h2><AlertTriangle size={20} /> Risks to watch</h2>{risks.map((risk) => <div key={risk.title}><strong>{risk.title}</strong><span>{risk.mitigation}</span><small>{risk.impact} impact</small></div>)}</div><div className="next"><h2>Next recommended task</h2>{next ? <><p>Based on phase order and your saved progress:</p><button onClick={() => document.querySelector<HTMLElement>(`.task-row:nth-child(${shown.findIndex((task) => task.id === next.id) + 1}) .task-summary`)?.click()}><ArrowRight /><span><small>{next.id}</small><strong>{next.title}</strong></span></button></> : <div className="celebrate"><CheckCircle2 /><strong>This phase is complete.</strong><span>Nice work—choose the next phase when you’re ready.</span></div>}</div></section>
    </main>
  </div>;
}
