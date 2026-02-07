# Heady MCP Servers & Configs

Model Context Protocol tool servers that give Heady agents access to external systems.

## Available MCP Servers

| Server | Description | Auth Required |
|--------|-------------|---------------|
| `github/` | Repos, PRs, issues, actions, code search | GitHub PAT |
| `slack/` | Messages, channels, threads, reactions | Slack Bot Token |
| `notion/` | Pages, databases, blocks, search | Notion Integration Token |
| `drive/` | Google Drive files, folders, sharing | Google OAuth |
| `docker/` | Container management, images, compose | Docker Socket |
| `calendar/` | Google/Outlook events, scheduling | OAuth |
| `email/` | IMAP/SMTP read and send | App Password |
| `filesystem/` | Local file operations (sandboxed) | User Approval |
| `browser/` | Web browsing, scraping, screenshots | None |
| `terminal/` | Shell command execution (sandboxed) | User Approval |
| `database/` | SQL/NoSQL queries (read-only default) | Connection String |
| `search/` | DuckDuckGo, Brave, Tavily web search | API Key (some) |

## Config Files

- `configs/default-mcp.yaml` — Standard MCP setup for most users
- `configs/enterprise-mcp.yaml` — Locked-down enterprise config
- `configs/dev-mcp.yaml` — Developer-focused with filesystem + terminal
- `configs/minimal-mcp.yaml` — Minimal set for privacy-conscious users

## Usage

MCP servers are enabled/disabled per workspace and per agent via the Heady settings UI or config files.

```yaml
# Example: enable GitHub + Slack for a workspace
workspace:
  mcp_tools:
    - github
    - slack
```
