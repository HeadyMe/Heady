# Heady Commands & Services Reference

> **NotebookLM Source Document — Notebook 3 of 3**
> Last synced: 2026-02-21T13:07:25-07:00

---

## Quick Start — For Anyone (Non-Technical)

### What is Heady?

Heady is your AI-powered digital assistant ecosystem. It has 30 specialized services that handle everything from answering questions to writing code, managing security, and deploying websites. Think of it as a team of digital employees, each with a specific job.

### How to Use Heady

1. **Open your editor** (Windsurf or VS Code)
2. **Type `heady` followed by what you want**
3. That's it — Heady routes your request to the right service

### Common Requests

| What You Want | What to Type |
|---------------|-------------|
| Chat with AI | `heady "help me brainstorm ideas for X"` |
| Research a topic | `heady "research the latest on AI safety"` |
| Check system health | `heady "what's the system status?"` |
| Deploy changes | `heady "deploy the latest changes"` |
| Analyze code | `heady "analyze this code for bugs"` |
| Get suggestions | `heady "suggest improvements for my project"` |
| Background task | `heady "run this task in the background"` |
| Clean up system | `heady "clean up temporary files"` |

---

## Quick Start — For Developers (Technical)

### Prerequisites

- Node.js 20+
- Podman (or Docker)
- Git access to HeadyMe/Heady-8f71ffc8

### Setup

```bash
# Clone
git clone https://github.com/HeadyMe/Heady-8f71ffc8.git ~/Heady
cd ~/Heady

# Install
npm install

# Configure (copy .env.example and fill in keys)
cp .env.example .env

# Run directly
node heady-manager.js

# Or via container
podman build -t heady-manager:latest .
podman run -d --name heady-manager-local \
  --env-file .env -p 3301:3301 \
  -v cascadeprojects_heady_data:/app/data \
  heady-manager:latest
```

### Verify Everything Works

```bash
curl -4 http://127.0.0.1:3301/api/soul/health
# → {"status":"ACTIVE","service":"heady-soul"}
```

### MCP Setup (IDE Integration)

Add to `~/.config/windsurf/mcp_config.json`:

```json
{
  "heady-local": {
    "command": "node",
    "args": ["src/mcp/heady-mcp-server.js"],
    "cwd": "/home/headyme/Heady",
    "env": {
      "HEADY_MANAGER_URL": "http://127.0.0.1:3301",
      "NODE_ENV": "production"
    }
  }
}
```

---

## Complete Command Reference (30 Commands)

### 🧠 Cognitive Commands

| Command | Parameters | Description |
|---------|-----------|-------------|
| `heady_chat` | `message`, `system?`, `model?`, `temperature?`, `max_tokens?`, `context?` | Send a chat message. Routes 100% through Heady Brain. |
| `heady_analyze` | `content`, `type?` (code/text/security/performance/architecture), `focus?`, `language?` | Deep analysis of any content type. |
| `heady_complete` | `prompt`, `language?`, `temperature?`, `max_tokens?`, `stop?` | Code/text completion. |
| `heady_refactor` | `code`, `language?`, `goals?`, `context?` | Refactoring suggestions with goals like readability, performance, security. |
| `heady_embed` | `text`, `model?` | Generate vector embeddings (nomic-embed-text default). |
| `heady_search` | `query`, `scope?`, `limit?` | Search Heady knowledge base, registry, docs. |
| `heady_soul` | `content`, `action?` (analyze/optimize/learn) | Consciousness/optimization layer interaction. |

### 💻 Coding Commands

| Command | Parameters | Description |
|---------|-----------|-------------|
| `heady_coder` | `task`, `language?`, `framework?`, `style?` | Code generation and orchestration. |
| `heady_codex` | `prompt`, `language?`, `operation?` (generate/transform/explain) | Code transformation and generation. |
| `heady_copilot` | `code`, `language?`, `action?` (suggest/complete/fix) | Real-time coding suggestions. |
| `heady_jules_task` | `task`, `repository`, `priority?`, `autoCommit?` | Dispatch background coding task. |
| `heady_patterns` | `code`, `language?`, `patternType?` | Design pattern analysis. |

### 🔒 Security & Validation Commands

| Command | Parameters | Description |
|---------|-----------|-------------|
| `heady_battle` | `content`, `mode?` (evaluate/challenge/arena), `criteria?` | Competitive validation session. |
| `heady_risks` | `target`, `scanType?` (quick/deep/compliance), `category?` | Security risk assessment. |
| `heady_hcfp_status` | `verbose?` | Auto-success pipeline metrics. |

### 🤖 External AI Commands

| Command | Parameters | Description |
|---------|-----------|-------------|
| `heady_claude` | `message`, `model?`, `system?`, `max_tokens?` | Anthropic Claude (Opus 4.6). |
| `heady_openai` | `prompt`, `model?`, `operation?`, `temperature?` | OpenAI GPT-4o. |
| `heady_gemini` | `prompt`, `operation?`, `model?`, `temperature?` | Google Gemini Pro. |
| `heady_groq` | `message`, `model?`, `max_tokens?` | Groq fast inference. |
| `heady_huggingface_model` | `action` (search/info/inference), `modelId?`, `query?`, `task?` | HuggingFace model interaction. |

### 🔍 Research & Vision Commands

| Command | Parameters | Description |
|---------|-----------|-------------|
| `heady_perplexity_research` | `query`, `mode?` (quick/deep/academic/news), `maxSources?`, `timeframe?` | Deep web research with citations. |
| `heady_lens` | `content`, `operation?` (analyze/process/enhance), `format?` | Visual/image analysis. |
| `heady_vinci` | `data`, `operation?` (learn/predict/patterns), `model?` | Continuous learning engine. |

### 🛠️ Infrastructure Commands

| Command | Parameters | Description |
|---------|-----------|-------------|
| `heady_deploy` | `action` (deploy/restart/status/logs/scale), `service?`, `config?` | Deployment management. |
| `heady_health` | `service?` (all/brain/manager/hcfp/mcp) | Service health checks. |
| `heady_orchestrator` | `task`, `strategy?`, `brains?`, `priority?` | Multi-brain task routing. |
| `heady_ops` | `action`, `target?`, `config?` | DevOps cloud operations. |
| `heady_maid` | `action` (clean/organize/archive), `target?`, `dryRun?` | System cleanup. |
| `heady_maintenance` | `action` (status/backup/update/repair), `component?` | Health monitoring & backups. |
| `heady_buddy` | `message`, `skill?`, `context?` | Personal assistant chat. |

---

## API Endpoint Reference

### Health Endpoints

```
GET  /api/health                 → System health (OPTIMAL/DEGRADED)
GET  /api/{service}/health       → Individual service health
GET  /api/core/health            → Core API health
GET  /api/orchestrator/health    → Orchestrator health
```

Replace `{service}` with: soul, hcfp, perplexity, jules, huggingface, battle, patterns, risks, coder, openai, gemini, groq, codex, copilot, ops, maid, maintenance, lens, vinci, buddy

### Brain Endpoints

```
POST /api/brain/chat             → Chat (message, system?, model?)
POST /api/brain/analyze          → Analyze (content, type?)
POST /api/brain/embed            → Embed text (text, model?)
POST /api/brain/search           → Search (query, limit?)
GET  /api/brain/memory-receipts  → Memory storage receipts
GET  /api/brain/status           → Brain status
POST /api/brain/plan             → Submit plan
POST /api/brain/feedback         → Submit feedback
```

### Buddy Endpoints

```
POST /api/buddy/chat             → Chat with Buddy
GET  /api/buddy/suggestions      → Get suggestions
GET  /api/buddy/orchestrator     → System overview
POST /api/buddy/pipeline/continuous → Pipeline control
```

### Monitoring Endpoints

```
GET  /api/connectivity/patterns  → Connectivity logs
POST /api/connectivity/scan      → Scan all services
GET  /api/notion/health          → Notion sync status
POST /api/notion/sync            → Trigger Notion sync
GET  /api/notion/state           → Notion sync state
```

### Orchestrator Endpoints

```
POST /api/orchestrator/route     → Route task to brain
GET  /api/orchestrator/brains    → List active brains
GET  /api/orchestrator/layers    → List active layers
```

---

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3300` |
| `HEADY_MANAGER_URL` | Manager URL for MCP | `http://127.0.0.1:3301` |
| `HEADY_BRAIN_URL` | Brain service URL | `http://127.0.0.1:3301` |
| `HEADY_API_KEY` | API authentication key | `heady_api_key_001` |
| `NOTION_TOKEN` | Notion integration token | `ntn_...` |
| `ANTHROPIC_API_KEY` | Claude API key | `sk-ant-...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `GOOGLE_AI_KEY` | Google Gemini API key | `AI...` |
| `GROQ_API_KEY` | Groq API key | `gsk_...` |
| `PERPLEXITY_API_KEY` | Perplexity API key | `pplx-...` |

---

## Domain Map

| Domain | Purpose | URL |
|--------|---------|-----|
| headyme.com | Personal dashboard | <https://headyme.com> |
| headybuddy.org | AI assistant portal | <https://headybuddy.org> |
| headysystems.com | Corporate/infrastructure | <https://headysystems.com> |
| headyconnection.org | Community/social impact | <https://headyconnection.org> |
| headymcp.com | Developer portal | <https://headymcp.com> |
| headyio.com | AI brain umbrella | <https://headyio.com> |
| headyweb.pages.dev | Browser dashboard | <https://headyweb.pages.dev> |

---

## Troubleshooting

### Container won't start

```bash
# Check logs
podman logs heady-manager-local

# Common fix: port mismatch (use 3301:3301, not 3301:3300)
podman run -d --name heady-manager-local \
  --env-file .env -p 3301:3301 heady-manager:latest
```

### Routes returning 404

```bash
# Use IPv4 explicitly (container binds 0.0.0.0, not ::1)
curl -4 http://127.0.0.1:3301/api/soul/health
```

### Memory fallback warning

The system logs when vector DB (Ollama) is unavailable and falls back to hash-based pseudo-embeddings. Check priorities:

```bash
curl -4 http://127.0.0.1:3301/api/brain/memory-receipts
```

### MCP tools not responding

Verify the MCP server can reach the manager:

```bash
HEADY_MANAGER_URL=http://127.0.0.1:3301 node src/mcp/heady-mcp-server.js
```
