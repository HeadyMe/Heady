# Heady + n8n Integration

Self-hosted automation with Heady as a node in n8n workflows.

## Available Nodes

### Heady Chat Node
- Send a message and get a response
- Supports streaming and context passing
- Configurable agent persona

### Heady Agent Node
- Trigger any Heady agent (researcher, grant-writer, BD, etc.)
- Pass structured task definitions
- Receive structured outputs

### Heady RAG Node
- Ingest documents from upstream nodes
- Query knowledge base with context

### Heady MCP Node
- Call any registered MCP tool
- Pass parameters from upstream data

### Heady Trigger Node
- Webhook-based triggers from Heady events
- Chat messages, agent completions, alerts

## Setup

1. Install the Heady n8n community node:
   ```bash
   cd ~/.n8n/custom
   npm install @heady/n8n-nodes
   ```
2. In n8n, go to Settings > Community Nodes > Install
3. Add your Heady API credentials (endpoint + API key)

## Example Workflows

- **RSS -> Heady Summarize -> Email**: Auto-summarize news feeds
- **Webhook -> Heady Agent -> Database**: Process incoming data with AI
- **Schedule -> Heady RAG Query -> Slack**: Daily knowledge digest

## Docker

If running n8n in Docker alongside Heady:
```yaml
# Add to your docker-compose
n8n:
  image: n8nio/n8n
  environment:
    - HEADY_API_ENDPOINT=http://api:3300
    - HEADY_API_KEY=${HEADY_API_KEY}
  depends_on:
    - api
```

---
*HeadySystems / HeadyConnection*
