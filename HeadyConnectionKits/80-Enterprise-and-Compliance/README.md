# 80 — Enterprise & Compliance

> Security overview, data residency, and enterprise deployment options.

## What's Here

- **Security and architecture overview** (high-level, non-sensitive)
- **Data residency and backup options**
- **Support tiers**

## Architecture Overview

```
┌──────────────────────────────────────────┐
│  Client Layer                            │
│  (Browser, CLI, SDK, Mobile)             │
│          ↕ HTTPS / WSS                   │
├──────────────────────────────────────────┤
│  API Gateway (heady-manager.js)          │
│  Rate limiting, auth, routing            │
│          ↕                               │
├──────────────────────────────────────────┤
│  Service Layer                           │
│  Monte Carlo, Patterns, Self-Critique,   │
│  Story Driver, Conductor                 │
│          ↕                               │
├──────────────────────────────────────────┤
│  Data Layer                              │
│  PostgreSQL, Redis, File Storage         │
└──────────────────────────────────────────┘
```

## Security Practices

| Area | Practice |
|---|---|
| **Authentication** | API key + OAuth/JWT; keys rotated on schedule |
| **Authorization** | RBAC with workspace-level isolation |
| **Encryption** | TLS 1.2+ in transit; AES-256 at rest |
| **Secrets** | Environment variables; never hardcoded; managed via `configs/secrets-manifest.yaml` |
| **Logging** | Structured logs with correlation IDs; no PII in logs |
| **Vulnerability Scanning** | Dependency audits via `npm audit`; container scanning |

## Data Residency Options

| Option | Description |
|---|---|
| **Cloud (Render)** | US-based hosting via Render.com |
| **Self-Hosted (Docker)** | Run anywhere — your infrastructure, your data |
| **Kubernetes** | Deploy to any K8s cluster in any region |
| **Hybrid** | Cloud control plane + on-prem data processing |

## Backup & Recovery

- Database backups: automated daily snapshots (configurable).
- Registry and config: version-controlled in Git.
- Disaster recovery: full rebuild from Git + database restore.

## Support Tiers

| Tier | Response Time | Channels |
|---|---|---|
| **Free** | Best effort | Email, community |
| **Pro** | < 24 hours | Email, priority queue |
| **Team** | < 4 hours | Email, Slack, dedicated channel |
| **Enterprise** | < 1 hour | Phone, Slack, dedicated account manager |

## Email Template

**Subject:** HeadySystems — Enterprise Security & Compliance Overview

**Body:**

> Hi [Name],
>
> Attached is our enterprise security and architecture overview for your procurement/security review.
>
> Key points:
> - RBAC + JWT/OAuth authentication
> - TLS 1.2+ in transit, AES-256 at rest
> - Self-hosted (Docker/K8s) or cloud deployment options
> - SOC 2 alignment in progress
>
> Happy to schedule a call to discuss your specific requirements.
>
> — Heady Team
