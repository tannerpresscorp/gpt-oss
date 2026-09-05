export type TaskStatus = "not-started" | "in-progress" | "complete" | "blocked";

export interface RoadmapTask {
  id: string;
  phase: 1 | 2 | 3 | 4;
  title: string;
  workstream: string;
  status: TaskStatus;
  description: string;
  verification: string[];
  blockers?: string[];
}

export interface Phase {
  id: 1 | 2 | 3 | 4;
  name: string;
  shortName: string;
  description: string;
}

export const phases: Phase[] = [
  { id: 1, name: "Repository & Infrastructure", shortName: "Repository & Infrastructure", description: "Set up the codebase and a dependable local AI environment." },
  { id: 2, name: "Training & Model Infrastructure", shortName: "Training & Models", description: "Prepare data, training, inference, and agent workflows." },
  { id: 3, name: "Fine-Tuning & Evaluation", shortName: "Fine-Tuning & Evaluation", description: "Adapt, compare, benchmark, and package models." },
  { id: 4, name: "Production Cloud Deployment", shortName: "Production Deployment", description: "Secure the hosted experience, RAG, and compatible APIs." },
];

export const roadmapTasks: RoadmapTask[] = [
  { id: "1.1", phase: 1, title: "Create the GitHub repository", workstream: "Repository", status: "in-progress", description: "Create tannerpresscorp/gpt-oss and enforce a pull-request workflow.", verification: ["Repository exists", "Feature branch contains implementation", "Pull request targets main"] },
  { id: "1.2", phase: 1, title: "Add the local AI stack", workstream: "Docker", status: "in-progress", description: "Run Ollama and Open WebUI together with persistent storage and safe defaults.", verification: ["docker compose config passes", "Both services become healthy", "Services restart unless stopped"] },
  { id: "1.3", phase: 1, title: "Add optional NVIDIA GPU support", workstream: "Docker", status: "not-started", description: "Provide an override that enables supported NVIDIA GPUs without complicating CPU setup.", verification: ["GPU override validates", "CPU configuration remains the default"] },
  { id: "1.4", phase: 1, title: "Create cross-platform launch scripts", workstream: "Developer Experience", status: "not-started", description: "Make first launch and verification straightforward on Windows and Linux.", verification: ["PowerShell script validates prerequisites", "Shell script validates prerequisites", "Both print next steps"] },
  { id: "1.5", phase: 1, title: "Document setup and operations", workstream: "Documentation", status: "not-started", description: "Cover installation, update, backup, restore, upgrade, GPU, proxy, and HTTPS workflows.", verification: ["Fresh-install steps are complete", "Backup and restore paths are explicit", "Secrets are never shown"] },
  { id: "1.6", phase: 1, title: "Add CI checks", workstream: "Automation", status: "not-started", description: "Verify types, tests, builds, and Compose configuration on every pull request.", verification: ["CI workflow is valid", "Checks run for pull requests"] },
  { id: "1.7", phase: 1, title: "Deploy the roadmap console", workstream: "Cloudflare", status: "not-started", description: "Publish the console as a Cloudflare Worker with static assets and a health endpoint.", verification: ["Deployment succeeds", "/health returns status ok", "Console loads over HTTPS"] },
  { id: "2.1", phase: 2, title: "Prepare training datasets", workstream: "Data", status: "not-started", description: "Define reproducible dataset preparation and validation steps.", verification: ["Dataset schema documented", "Validation report generated"] },
  { id: "2.2", phase: 2, title: "Create LitGPT configuration examples", workstream: "Training", status: "not-started", description: "Add small-model examples for 14M, 30M, 60M, and 100M parameter runs.", verification: ["All four configurations load", "Resource requirements documented"] },
  { id: "2.3", phase: 2, title: "Add checkpoint and resume support", workstream: "Training", status: "not-started", description: "Make interrupted training runs recoverable.", verification: ["Checkpoint created", "A stopped run resumes correctly"] },
  { id: "2.4", phase: 2, title: "Build the evaluation pipeline", workstream: "Evaluation", status: "not-started", description: "Measure quality, latency, and resource usage consistently.", verification: ["Baseline report produced", "Results are reproducible"] },
  { id: "2.5", phase: 2, title: "Serve GPT-OSS 20B", workstream: "Inference", status: "not-started", description: "Support Ollama and vLLM backends with an OpenAI-compatible interface.", verification: ["Both backends documented", "Compatibility request succeeds"] },
  { id: "2.6", phase: 2, title: "Add integration examples", workstream: "Developer Experience", status: "not-started", description: "Provide ASP.NET, C#, JavaScript, and TypeScript examples.", verification: ["Every example runs", "Error handling is included"] },
  { id: "2.7", phase: 2, title: "Add agentic workflows", workstream: "Agents", status: "not-started", description: "Implement tool use, retrieval, web search, and structured outputs.", verification: ["Tool flow is tested", "Retrieved sources are cited"] },
  { id: "3.1", phase: 3, title: "Build the QLoRA pipeline", workstream: "Fine-Tuning", status: "not-started", description: "Fine-tune from JSONL, chat, and instruction datasets.", verification: ["Each dataset format validates", "Training completes from a sample"] },
  { id: "3.2", phase: 3, title: "Compare base and adapted models", workstream: "Evaluation", status: "not-started", description: "Benchmark accuracy, latency, response quality, and resources.", verification: ["Comparison report generated", "Methodology is recorded"] },
  { id: "3.3", phase: 3, title: "Quantize models to GGUF", workstream: "Packaging", status: "not-started", description: "Support Q4_K_M, Q5_K_M, Q6_K, and Q8_0 outputs.", verification: ["Every format loads", "Post-quantization validation passes"] },
  { id: "4.1", phase: 4, title: "Configure DNS and HTTPS", workstream: "Cloudflare", status: "not-started", description: "Serve the production experience at gpt-oss.tannerpress.net.", verification: ["DNS resolves", "TLS certificate is valid"] },
  { id: "4.2", phase: 4, title: "Add secure tunneling", workstream: "Cloudflare", status: "not-started", description: "Connect approved private origins without exposing local ports.", verification: ["Tunnel is healthy", "Origin is not publicly reachable"] },
  { id: "4.3", phase: 4, title: "Add edge protection", workstream: "Security", status: "not-started", description: "Apply WAF controls and rate limits to public endpoints.", verification: ["Rules are documented", "Rate-limit test succeeds"] },
  { id: "4.4", phase: 4, title: "Implement secure multi-user access", workstream: "Identity", status: "not-started", description: "Use role-based authentication for hosted tools.", verification: ["Unauthorized access is denied", "Roles are tested"] },
  { id: "4.5", phase: 4, title: "Build the RAG platform", workstream: "RAG", status: "not-started", description: "Ingest PDF, DOCX, TXT, and Markdown for cited semantic retrieval.", verification: ["All formats ingest", "Answers include valid citations"] },
  { id: "4.6", phase: 4, title: "Publish a compatible streaming API", workstream: "API", status: "not-started", description: "Expose secured OpenAI-compatible chat and streaming endpoints.", verification: ["Streaming client connects", "Authentication and limits are enforced"] },
];

export const risks = [
  { title: "Host resources may be too small for GPT-OSS 20B", impact: "High", mitigation: "Start with CPU-safe validation and document GPU/RAM requirements." },
  { title: "Local model APIs could be exposed accidentally", impact: "High", mitigation: "Bind to loopback and use Cloudflare Tunnel plus Access for remote use." },
  { title: "Large models and datasets can fill disks", impact: "Medium", mitigation: "Keep data outside Git and document storage/backup sizing." },
];
