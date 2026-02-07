# HeadyConnectionKits — Overview

> All the ways someone can connect to, install, or use HeadySystems.

## Connection Methods at a Glance

| # | Method | Best For | Subfolder |
|---|---|---|---|
| 10 | **Cloud & Web** | Instant access, no install | `10-Cloud-and-Web/` |
| 20 | **Docker & On-Prem** | Self-hosted, air-gapped, full control | `20-Docker-and-OnPrem/` |
| 30 | **Kubernetes & Marketplaces** | Production clusters, managed K8s | `30-Kubernetes-and-CloudMarketplaces/` |
| 40 | **CLI Tools** | Power users, scripting, automation | `40-CLI-Tools/` |
| 50 | **SDKs & Code Snippets** | Developers integrating Heady into their apps | `50-SDKs-and-Code-Snippets/` |
| 60 | **API Access & Postman** | Direct API consumers, testing, prototyping | `60-API-Access-and-Postman/` |
| 70 | **Email Onboarding Sequences** | Marketing, user activation, partner outreach | `70-Email-Onboarding-Sequences/` |
| 80 | **Enterprise & Compliance** | Security reviews, procurement, data residency | `80-Enterprise-and-Compliance/` |
| 90 | **Custom Integrations** | Vertical-specific, Chrome-like, Comet-like, etc. | `90-Custom-Integrations/` |

## How to Use This Folder

1. **Pick the connection method** that fits your recipient.
2. **Grab the artifacts** (Docker files, SDK samples, email templates, etc.) from the subfolder.
3. **Send it** — each subfolder has at least one email-ready template you can paste and send.

## Quick Decision Tree

```
Need to connect someone to Heady?
├── They want browser access? → 10-Cloud-and-Web/
├── They want to self-host? → 20-Docker-and-OnPrem/
├── They run Kubernetes? → 30-Kubernetes-and-CloudMarketplaces/
├── They want CLI/scripting? → 40-CLI-Tools/
├── They're building an integration? → 50-SDKs-and-Code-Snippets/
├── They want raw API access? → 60-API-Access-and-Postman/
├── You're onboarding them via email? → 70-Email-Onboarding-Sequences/
├── Enterprise/procurement process? → 80-Enterprise-and-Compliance/
└── Vertical-specific setup? → 90-Custom-Integrations/
```

## Maintenance

- Updated at every checkpoint per `docs/CHECKPOINT_PROTOCOL.md`.
- Registered in `heady-registry.json`.
- Owned by: system (see `docs/DOC_OWNERS.yaml`).
