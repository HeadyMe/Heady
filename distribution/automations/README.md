# Heady Automations

Connect Heady to external automation platforms, or use Heady's built-in automation engine.

## Supported Platforms

| Platform | Integration Type | Config Location |
|----------|-----------------|-----------------|
| **Zapier** | Zapier App / Webhooks | `zapier/` |
| **n8n** | Custom Node + Workflows | `n8n/` |
| **Make.com** | Custom App + Scenarios | `make/` |
| **Custom Webhooks** | HTTP POST/GET | `custom-webhooks/` |

## Zapier Integration

```
automations/zapier/
  zapier-app.json       # Zapier app definition
  triggers/
    new-message.json    # Trigger: new Heady message
    task-completed.json # Trigger: agent task completed
  actions/
    send-message.json   # Action: send to Heady
    run-agent.json      # Action: run a specific agent
```

## n8n Integration

```
automations/n8n/
  heady-node/           # Custom n8n node package
  workflows/
    research-pipeline.json
    daily-digest.json
    auto-summarize.json
```

## Make.com Integration

```
automations/make/
  heady-app.json        # Make custom app definition
  scenarios/
    web-to-heady.json
    heady-to-slack.json
```

## Custom Webhooks

```
automations/custom-webhooks/
  webhook-receiver.js   # Express webhook handler
  templates/
    github-webhook.json
    stripe-webhook.json
    generic-webhook.json
```

## Example: Browser + MCP + IDE + Mobile Working Together

1. **Browser extension** captures an article URL
2. **MCP tool** fetches and parses the article
3. **Researcher agent** summarizes and extracts key points
4. **Automation** creates tasks in your project management tool
5. **Mobile app** receives notification with summary
6. **IDE extension** creates a related code task if applicable

---
*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
