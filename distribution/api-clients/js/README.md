# Heady JS/TS SDK

Official JavaScript/TypeScript client for the Heady API.

## Install

```bash
npm install @heady/sdk
# or
yarn add @heady/sdk
```

## Quick Start

```typescript
import { HeadyClient } from '@heady/sdk';

const heady = new HeadyClient({
  apiKey: process.env.HEADY_API_KEY,
  endpoint: 'http://localhost:3300', // or cloud URL
});

// Chat
const reply = await heady.chat('Summarize this document', {
  context: 'browser',
  workspace: 'default',
});
console.log(reply.message);

// Agent
const result = await heady.agent.run('researcher', {
  task: 'Find grants for AI education nonprofits',
  tools: ['browser', 'notion'],
});
console.log(result.output);

// RAG
await heady.rag.ingest({ path: './docs/', workspace: 'my-project' });
const answer = await heady.rag.query('What is the deployment process?');

// MCP Tool Call
const repos = await heady.mcp.call('github_search_repos', { query: 'heady' });
```

## Configuration

```typescript
const heady = new HeadyClient({
  apiKey: 'heady_...',
  endpoint: 'http://localhost:3300',
  mode: 'hybrid',       // 'local' | 'hybrid' | 'cloud'
  workspace: 'default',
  timeout: 30000,
});
```

## API Reference

- `heady.chat(message, options)` — Send a chat message
- `heady.agent.run(agentId, task)` — Run an agent
- `heady.agent.list()` — List available agents
- `heady.rag.ingest(source)` — Ingest documents
- `heady.rag.query(question)` — Query knowledge base
- `heady.mcp.call(tool, params)` — Call an MCP tool
- `heady.mcp.list()` — List available MCP tools
- `heady.health()` — Health check

---
*HeadySystems / HeadyConnection*
