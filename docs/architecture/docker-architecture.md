# Docker Compose architecture

`ollama-models` persists downloaded models and `open-webui-data` persists accounts, chats, knowledge bases, and application configuration. `vllm-cache` holds downloaded Hugging Face artifacts when the optional vLLM profile is enabled. Back up volumes while services are stopped for a consistent snapshot.

```mermaid
flowchart LR
    Compose[Docker Compose] --> WebUI[Open WebUI]
    Compose --> Ollama[Ollama]
    Compose --> VLLM[vLLM profile]
    Ollama --> Models[(Ollama Models)]
    WebUI --> Data[(Chat Data)]
    VLLM --> Cache[(Model Cache)]
```
