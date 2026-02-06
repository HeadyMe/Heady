# Heady Systems

> Sacred Geometry :: Organic Systems :: Breathing Interfaces

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

## Architecture

```
heady-manager.js          # Node.js MCP Server & API Gateway (port 3300)
├── src/                  # Core pipeline engine & agents
├── backend/              # Python worker & MCP servers
├── frontend/             # React UI (Vite + TailwindCSS)
├── HeadyAcademy/         # AI Nodes & Tools
├── configs/              # YAML configuration
├── scripts/              # Automation (Sync, Build, Deploy)
└── workers/              # Edge workers
```

## API

| Endpoint | Description |
|---|---|
| `GET /api/health` | Health check |
| `GET /api/pulse` | System pulse with layer info |
| `GET /api/system/status` | Full system status |
| `POST /api/pipeline/run` | Trigger pipeline run |
| `GET /api/pipeline/state` | Current pipeline state |
| `GET /api/nodes` | List all AI nodes |
| `POST /api/system/production` | Activate production mode |

## Deployment

Deployed via [Render.com](https://render.com) using `render.yaml`.

## License

Proprietary - Heady Systems
