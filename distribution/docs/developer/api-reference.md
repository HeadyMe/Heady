# Heady API Reference

Base URL: `http://localhost:3300` (local) or your cloud deployment URL.

## Authentication

```
Authorization: Bearer <your-token>
```

## Core Endpoints

### Health & Status

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/pulse` | Full system status |
| GET | `/api/layer` | Active layer info |
| POST | `/api/layer/switch` | Switch layer `{layer: "cloud-me"}` |

### Chat / Buddy

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/buddy/chat` | Send chat message |
| GET | `/api/buddy/suggestions` | Get conversation suggestions |

**POST /api/buddy/chat**
```json
{
  "message": "Hello",
  "context": "web_chat",
  "source": "js-sdk",
  "mode": "hybrid",
  "agent": "researcher",
  "history": []
}
```

### Code Completion

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/complete` | Inline code completion |

### Monte Carlo Scheduler

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/monte-carlo/plan` | Generate execution plan |
| POST | `/api/monte-carlo/result` | Record execution result |
| GET | `/api/monte-carlo/metrics` | Speed/quality metrics |
| GET | `/api/monte-carlo/drift` | Drift alerts |

### Pattern Recognition

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/patterns` | All patterns |
| POST | `/api/patterns/observe` | Ingest data point |
| POST | `/api/patterns/promote` | Promote a pattern |
| POST | `/api/patterns/lock` | Lock optimal pattern |

### Self-Critique

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/self/status` | Engine status |
| POST | `/api/self/critique` | Record critique |
| POST | `/api/self/diagnose` | Run diagnostics |

### Pricing

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/pricing/tiers` | Pricing tiers |
| GET | `/api/pricing/fair-access` | Fair access programs |

### MCP Tools

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/mcp/tools` | List available tools |
| POST | `/api/mcp/call` | Call a tool `{tool, params}` |

## SDKs

- **JavaScript:** `distribution/api-clients/javascript/`
- **Python:** `distribution/api-clients/python/`
- **Go:** `distribution/api-clients/go/`
- **CLI:** `distribution/api-clients/cli/`
