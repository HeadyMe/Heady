# Heady Python SDK

Official Python client for the Heady API.

## Install

```bash
pip install heady-sdk
```

## Quick Start

```python
from heady import HeadyClient

client = HeadyClient(
    api_key="heady_...",
    endpoint="http://localhost:3300",
)

# Chat
reply = client.chat("Explain quantum computing simply")
print(reply.message)

# Agent
result = client.agent.run("grant-writer", task={
    "description": "Draft an NSF SBIR Phase I proposal for AI-assisted education",
    "tools": ["browser", "notion", "drive"],
})
print(result.output)

# RAG
client.rag.ingest(path="./research-papers/", workspace="grants")
answer = client.rag.query("What funding opportunities exist for EdTech?")

# MCP Tool
issues = client.mcp.call("github_list_issues", owner="HeadySystems", repo="Heady")

# Streaming
for chunk in client.chat_stream("Tell me about sacred geometry"):
    print(chunk.text, end="", flush=True)
```

## Configuration

```python
client = HeadyClient(
    api_key="heady_...",
    endpoint="http://localhost:3300",
    mode="hybrid",       # "local", "hybrid", "cloud"
    workspace="default",
    timeout=30,
)
```

## API Reference

- `client.chat(message, **kwargs)` — Send a chat message
- `client.chat_stream(message, **kwargs)` — Stream a chat response
- `client.agent.run(agent_id, task)` — Run an agent
- `client.agent.list()` — List available agents
- `client.rag.ingest(path, workspace)` — Ingest documents
- `client.rag.query(question)` — Query knowledge base
- `client.mcp.call(tool, **params)` — Call an MCP tool
- `client.health()` — Health check

---
*HeadySystems / HeadyConnection*
