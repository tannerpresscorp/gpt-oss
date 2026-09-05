# CI/CD pipeline

Pull requests validate Markdown, workflow policy, and Compose rendering. Release and deployment workflows should be added only after a registry, staging environment, and protected environment approvals exist; deployments must use immutable image digests, health checks, and a documented rollback target.

```mermaid
flowchart LR
    Dev[Developer] --> Branch[Feature Branch] --> PR[Pull Request] --> Actions[GitHub Actions]
    Actions --> Test[Validation]
    Actions --> Build[Docker Build]
    Actions --> Security[Security Scan]
    Test --> Publish[Container Registry] --> Deploy[Deployment]
    Build --> Publish
    Security --> Publish
```
