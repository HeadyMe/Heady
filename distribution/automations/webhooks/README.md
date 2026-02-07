# Heady Custom Webhooks

Direct webhook integration for custom automation pipelines.

## Incoming Webhooks (Send to Heady)

```bash
# Chat message
curl -X POST http://localhost:3300/api/webhook/chat \
  -H "Authorization: Bearer heady_..." \
  -H "Content-Type: application/json" \
  -d '{"message": "Summarize today'\''s sales data", "workspace": "default"}'

# Run agent
curl -X POST http://localhost:3300/api/webhook/agent \
  -H "Authorization: Bearer heady_..." \
  -d '{"agent": "researcher", "task": "Find grant deadlines this month"}'

# Ingest document
curl -X POST http://localhost:3300/api/webhook/ingest \
  -H "Authorization: Bearer heady_..." \
  -d '{"url": "https://example.com/report.pdf", "workspace": "research"}'
```

## Outgoing Webhooks (Heady sends to you)

Register webhook endpoints in Heady settings:

```yaml
webhooks:
  on_chat_response:
    url: "https://your-app.com/heady/chat"
    events: ["chat.response"]
  on_agent_complete:
    url: "https://your-app.com/heady/agent"
    events: ["agent.complete", "agent.error"]
  on_alert:
    url: "https://your-app.com/heady/alert"
    events: ["pattern.detected", "drift.alert"]
```

## Webhook Events

| Event | Payload |
|-------|---------|
| `chat.response` | `{message, workspace, agent, timestamp}` |
| `agent.complete` | `{agent, task, output, duration, timestamp}` |
| `agent.error` | `{agent, task, error, timestamp}` |
| `pattern.detected` | `{pattern, category, severity, timestamp}` |
| `drift.alert` | `{metric, expected, actual, timestamp}` |
| `automation.complete` | `{automation_id, status, output, timestamp}` |

## Security

All webhooks include:
- `X-Heady-Signature` header (HMAC-SHA256)
- `X-Heady-Timestamp` header
- Configurable retry policy (3 retries, exponential backoff)

---
*HeadySystems / HeadyConnection*
