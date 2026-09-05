# Agent workflows

Implement Responses-style agents behind an authenticated API gateway. Treat tool schemas as allowlists, validate structured input and output, enforce per-tool timeouts, log audit metadata without prompts or secrets, and require confirmation for state-changing operations. Retrieval results must retain source identifiers so clients can render citations.

```mermaid
flowchart TB
    User[User Request] --> Agent[Responses-style Agent] --> Planner[Task Planner]
    Planner --> LLM[GPT-OSS]
    Planner --> Tools[Tool Calling]
    Planner --> Search[Web Search]
    Planner --> RAG[RAG Retrieval]
    Tools --> Planner
    Search --> Planner
    RAG --> Planner
    Planner --> Response[Final Response]
```
