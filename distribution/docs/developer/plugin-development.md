# Plugin & Agent Development Guide

## Creating a Custom Agent

Agents are defined in `packages/agents/` as YAML + handler code.

```yaml
# my-agent.yaml
id: my-custom-agent
name: "My Custom Agent"
role: "Specialized task handler"
model: auto  # Model Router picks best model
tools: [rag, filesystem, duckduckgo]
system_prompt: |
  You are a specialized agent for [your use case].
  Always cite sources and verify facts.
```

## Creating an MCP Tool

MCP tools live in `distribution/mcp/servers/`. Each tool exports:

```javascript
module.exports = {
  name: 'my-tool',
  description: 'What this tool does',
  schema: {
    type: 'object',
    properties: {
      action: { type: 'string', enum: ['do_thing'] },
      input: { type: 'string' },
    },
    required: ['action'],
  },
  async handler(params) {
    // Your implementation
    return { result: 'done' };
  },
};
```

Register it in `distribution/mcp/servers/index.js`.

## Revenue Sharing

Third-party plugins can earn revenue through the Heady marketplace:
- Configure in `billing-config/revenue-share.yaml`
- Default split: 70% developer / 30% platform
- Payouts via Stripe Connect

## Testing

- Unit test your handler with mock params
- Integration test against a local HeadyManager
- Submit to marketplace review for listing

## Distribution

- Package as npm module or standalone JS file
- Include README with setup instructions
- Register in `heady-registry.json` under components
