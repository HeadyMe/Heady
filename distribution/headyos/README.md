# HeadyOS — All Forms

Every runtime of HeadyOS: the same brain, different shells.

| Form | Description | Tech Stack | Status |
|------|-------------|------------|--------|
| **Desktop** | Full desktop shell with overlay, side panel, system integrations | Tauri v2 + React | Active |
| **Browser Shell** | Chromium-based browser with HeadyOS as the home/side panel | Electron + React | Active |
| **Web Shell** | OS-like web UI (windowed panels, apps, settings) | Next.js / React | Active |
| **Mobile Shell** | Mobile OS experience (panels for agents, tasks) | React Native | Active |

## Deployment Modes Per Form

Each form supports three deployment modes:

- **Local** — All processing on-device, no cloud calls
- **Hybrid** — Prefer local, fall back to cloud when needed
- **Cloud** — Thin client, all processing in cloud

## Installation

```bash
# Desktop (Windows)
distribution/headyos/desktop/windows/HeadyOS-Setup.exe

# Desktop (Mac)
distribution/headyos/desktop/mac/HeadyOS.dmg

# Desktop (Linux)
distribution/headyos/desktop/linux/HeadyOS.AppImage

# Browser Shell
distribution/headyos/browser-shell/headyos-browser-local/
distribution/headyos/browser-shell/headyos-browser-hybrid/
distribution/headyos/browser-shell/headyos-browser-cloud/

# Web Shell (deploy)
cd distribution/headyos/web-shell && npm run build && npm run start

# Mobile Shell (Android)
adb install distribution/headyos/mobile-shell/android/headyos-mobile.apk
```

## Architecture

All forms connect to the same backend:
- **heady-api** (HTTP/WS gateway)
- **heady-orchestrator** (agent logic, workflows)
- **heady-rag** (vector DB, knowledge)
- **mcp-gateway** (tool bridge)
- **model-runner** (local/cloud LLMs)

---
*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
