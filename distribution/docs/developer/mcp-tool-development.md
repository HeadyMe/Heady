# MCP Tool Development Guide

## What is MCP?

Model Context Protocol (MCP) is a standard for connecting AI systems with external tools and data. Heady uses MCP to let agents interact with GitHub, Slack, Notion, Docker, the filesystem, and more.

## Architecture

```
Agent → Orchestrator → MCP Gateway → Tool Servers
                                      ├── github.js
                                      ├── slack.js
                                      ├── filesystem.js
                                      └── your-tool.js
```

## Creating a New MCP Tool

### 1. Create the tool file

`distribution/mcp/servers/my-tool.js`:

```javascript
const name = 'my-tool';
const description = 'What this tool does';

const schema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['action1', 'action2'] },
    input: { type: 'string' },
  },
  required: ['action'],
};

async function handler(params) {
  switch (params.action) {
    case 'action1':
      // Your implementation
      return { result: 'success' };
    case 'action2':
      return { result: 'done' };
    default:
      return { error: `Unknown action: ${params.action}` };
  }
}

module.exports = { name, description, schema, handler };
```

### 2. Register in index.js

Add to `distribution/mcp/servers/index.js`:
```javascript
const tools = {
  // ... existing tools
  'my-tool': require('./my-tool'),
};
```

### 3. Configure access

Add to `distribution/mcp/configs/default-mcp.yaml`:
```yaml
my-tool:
  enabled: true
  requireApproval: false  # or true for dangerous tools
```

## MCP Config Profiles

| Config | Description |
|--------|-------------|
| `default-mcp.yaml` | Standard tools enabled |
| `enterprise-mcp.yaml` | All tools + audit logging |
| `minimal-mcp.yaml` | Only filesystem + search |

## Security

- Tools that modify state (filesystem write, docker stop, terminal) should require `requireApproval: true`
- All tool calls are logged via the telemetry service
- Per-workspace tool permissions can be set in org settings

## Available Tools

| Tool | Actions | Env Vars Required |
|------|---------|-------------------|
| github | search_repos, list_issues, create_issue, get_file | GITHUB_TOKEN |
| slack | send_message, list_channels, search | SLACK_TOKEN |
| notion | search, get_page, create_page, query_database | NOTION_TOKEN |
| drive | list, search, get_file, read_content | GOOGLE_DRIVE_TOKEN |
| docker | list, logs, start, stop, inspect, images | (none) |
| calendar | list_events, create_event, check_availability | GOOGLE_CALENDAR_TOKEN |
| filesystem | read, write, list, search, info, mkdir | HEADY_FS_ROOTS |
| terminal | (command execution) | HEADY_ALLOWED_COMMANDS |
| browser | navigate, extract_text, get_links | (none) |
| duckduckgo | search | (none) |
