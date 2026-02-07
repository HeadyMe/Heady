# User Management Guide

## Authentication

All Heady clients authenticate via the same mechanism:
1. **API Token** — Bearer token in Authorization header
2. **OAuth2** — Redirect-based sign-in for web/desktop/mobile
3. **CLI login** — `heady login` stores token in OS keychain

## User Roles

| Role | Permissions |
|------|------------|
| **user** | Chat, use agents, manage own workspaces |
| **admin** | Manage users, billing, org settings, audit logs |
| **developer** | API keys, plugin development, MCP tool management |
| **owner** | All permissions, org deletion, data export |

## Workspace Management

- Each organization has one or more workspaces
- Workspaces have independent: agents, tools, memory, billing
- `organization_id` and `workspace_id` in all API calls

## Multi-Tenant Setup

- HeadyConnection (nonprofit) and HeadySystems (C-Corp) as separate orgs
- Shared knowledge base with per-org permission gates
- Per-org model policies (e.g., "nonprofit = prefer local models")

## Security

- All tokens encrypted at rest
- Session expiry: 30 days (configurable)
- Rate limiting per user and per org
- Audit logs for all admin actions
