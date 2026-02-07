# Heady MCP Server Stubs

Pre-configured Model Context Protocol servers for the Heady ecosystem. Each server exposes tools that any Heady agent can call.

## Available Servers

| Server | Description | Auth Required |
|--------|-------------|---------------|
| `github/` | Repos, PRs, issues, code search | GitHub PAT |
| `slack/` | Channels, messages, users, reactions | Slack Bot Token |
| `notion/` | Pages, databases, blocks | Notion Integration Token |
| `drive/` | Google Drive files, folders, search | Google OAuth |
| `docker/` | Containers, images, compose control | Docker socket |
| `calendar/` | Google/Outlook events, scheduling | OAuth |
| `filesystem/` | Local file read/write/search | None (sandboxed) |
| `browser/` | Page content, screenshots, navigation | None |
| `email/` | IMAP/SMTP read, draft, send | OAuth or App Password |
| `database/` | SQL/NoSQL query, schema inspect | Connection string |

## Usage

Reference these in your MCP config (see `configs/default-mcp.yaml`):

```yaml
servers:
  - name: github
    path: ./servers/github/
    env:
      GITHUB_TOKEN: ${GITHUB_TOKEN}
```

## Adding Custom Servers

1. Create a folder under `servers/`
2. Add `server.json` with tool definitions
3. Add `handler.js` (or `handler.py`) with implementation
4. Reference in your MCP config

---
*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
