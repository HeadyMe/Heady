# Heady + Zapier Integration

Use Heady as a step in your Zapier workflows.

## Triggers

| Trigger | Description |
|---------|-------------|
| New Chat Message | Fires when a new message is received |
| Agent Task Complete | Fires when an agent finishes a task |
| Automation Run Complete | Fires when a scheduled automation completes |
| Alert / Pattern Detected | Fires when the pattern engine detects an anomaly |

## Actions

| Action | Description |
|--------|-------------|
| Send Chat Message | Send a message to Heady and get a response |
| Run Agent | Trigger a specific agent with a task |
| Ingest Document | Add a document to RAG knowledge base |
| Query Knowledge Base | Ask a question against ingested docs |
| Call MCP Tool | Execute any registered MCP tool |

## Setup

1. Go to [zapier.com](https://zapier.com) and create a new Zap
2. Search for "Heady AI" in the app directory
3. Connect your Heady account (API key from Settings)
4. Configure triggers and actions

## Example Zaps

- **Gmail -> Heady -> Slack**: Auto-summarize important emails and post to Slack
- **GitHub PR -> Heady -> Notion**: Auto-review PRs and log summaries in Notion
- **Calendar -> Heady**: Daily briefing of upcoming meetings with AI-generated prep notes

## Auth

Uses `HEADY_API_KEY` via Zapier's standard API key authentication.

---
*HeadySystems / HeadyConnection*
