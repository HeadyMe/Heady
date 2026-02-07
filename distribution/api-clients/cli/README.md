# Heady CLI

Command-line AI assistant powered by the Heady platform.

## Install

```bash
npm install -g @heady/cli
# or
pip install heady-cli
```

## Setup

```bash
heady config set endpoint http://localhost:3300
heady config set api-key heady_...
heady config set mode hybrid
```

## Usage

```bash
# Chat
heady chat "What's the best way to deploy a Node.js app?"

# Interactive mode
heady chat --interactive

# Agent
heady agent run researcher --task "Find AI grant opportunities"
heady agent list

# RAG
heady rag ingest ./docs/
heady rag query "How does the checkpoint protocol work?"

# MCP Tools
heady mcp list
heady mcp call github_search_repos --query heady

# Health
heady health
heady status

# Workspace
heady workspace list
heady workspace switch personal

# Pipe input
cat README.md | heady chat "Summarize this"
git diff HEAD~1 | heady chat "Review this diff"
```

## Flags

| Flag | Description |
|------|-------------|
| `--endpoint` | Override API endpoint |
| `--mode` | `local`, `hybrid`, `cloud` |
| `--workspace` | Target workspace |
| `--agent` | Use specific agent |
| `--json` | Output as JSON |
| `--stream` | Stream response |
| `--verbose` | Show debug info |

---
*HeadySystems / HeadyConnection*
