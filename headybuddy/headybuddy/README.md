<!--
    ╭─────────────────────────────────────────────────────────────╮
    │  ██╗  ██╗███████╗ █████╗ ██████╗ ██╗   ██╗                  │
    │  ██║  ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝                  │
    │  ███████║█████╗  ███████║██║  ██║ ╚████╔╝                   │
    │  ██╔══██║██╔══╝  ██╔══██║██║  ██║  ╚██╔╝                    │
    │  ██║  ██║███████╗██║  ██║██████╔╝   ██║                     │
    │  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝                     │
    │                                                              │
    │  ∞ HeadyBuddy — Perfect Day AI Companion ∞                   │
    ╰─────────────────────────────────────────────────────────────╯
-->

# HeadyBuddy

**Your Perfect Day AI Companion** — a branded desktop overlay task assistant
that helps you plan, focus, build, and thrive.

Built by [HeadySystems](https://github.com/HeadySystems) with Sacred Geometry
aesthetics and organic, breathing interfaces.

---

## What's Inside

| Component | Path | Description |
|-----------|------|-------------|
| **System Prompt** | `SYSTEM_PROMPT.md` | Canonical AI personality and behavior spec |
| **Widget App** | `src/` | React + Tailwind overlay widget (Vite) |
| **Design Spec** | `DESIGN.md` | Visual identity, tokens, motion guidelines |
| **Adaptive Cards** | `adaptive-cards/` | JSON templates for Windows Widget / Teams hosts |
| **Docker Desktop** | `docker/` | Distributable Linux desktop container |

The **Electron shell** lives at `../desktop-overlay/` and wraps the widget as a
native always-on-top overlay for Windows / macOS / Linux.

---

## Quick Start (Development)

### 1. Widget only (React dev server)

```bash
cd headybuddy
npm install
npm run dev
# → http://localhost:3400
```

### 2. Full stack (widget + heady-manager API)

```bash
# Terminal 1 — API
cd /path/to/Heady
npm start
# → http://localhost:3300

# Terminal 2 — Widget
cd headybuddy
npm run dev
# → http://localhost:3400
```

### 3. Electron overlay (native desktop)

```bash
cd desktop-overlay
npm install
npm run dev
# Launches Electron with hotkey Ctrl+Shift+H
```

### 4. Docker Desktop (full Linux desktop in browser)

```bash
docker compose -f docker-compose.desktop.yml up --build
# → http://localhost:6080 (VNC password: heady)
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│  User's Desktop / Docker Container          │
│                                             │
│  ┌─────────────┐     ┌──────────────────┐  │
│  │ HeadyBuddy  │────▶│ heady-manager.js │  │
│  │ (overlay)   │     │ :3300            │  │
│  │ :3400       │     │                  │  │
│  └─────────────┘     │ /api/buddy/chat  │  │
│         │            │ /api/buddy/health │  │
│         │            │ /api/buddy/suggest│  │
│         ▼            └──────────────────┘  │
│  ┌─────────────┐              │            │
│  │ Electron /  │              ▼            │
│  │ Chromium    │     ┌──────────────────┐  │
│  │ (host)      │     │ PYTHIA / LLM     │  │
│  └─────────────┘     │ (future backend) │  │
│                      └──────────────────┘  │
│                                             │
│  ┌─────────────┐                           │
│  │HeadyAutoIDE │  (VS Code + Heady ext.)   │
│  └─────────────┘                           │
└─────────────────────────────────────────────┘
```

---

## Widget States

| State | Size | Content |
|-------|------|---------|
| **Collapsed Pill** | 320×120 | Avatar + status + 3 suggestion chips |
| **Main Widget** | 380×560 | Chat + suggestions + input |
| **Expanded View** | 420×680 | Tabs: Overview / Steps / History |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/buddy/chat` | Send message, receive reply |
| `GET` | `/api/buddy/health` | HeadyBuddy service health |
| `GET` | `/api/buddy/suggestions` | Context-aware suggestion chips (time-based) |

---

## Distributable Docker Desktop

### For Recipients (email-ready instructions)

**Prerequisites**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

**Run**:
```bash
docker run --rm -p 6080:6080 -p 3300:3300 heady/desktop:latest
```

**Access**: Open your browser to **http://localhost:6080**

You'll see:
- A full Linux desktop with Heady branding
- **HeadyBuddy** — AI companion overlay (auto-starts)
- **HeadyAutoIDE** — development environment (desktop icon)

VNC password: `heady`

### Building the Image

```bash
docker build -f headybuddy/docker/Dockerfile.desktop -t heady/desktop:latest .
```

### Publishing

```bash
docker tag heady/desktop:latest ghcr.io/headysystems/desktop:latest
docker push ghcr.io/headysystems/desktop:latest
```

---

## Files Reference

```
headybuddy/
├── SYSTEM_PROMPT.md           # AI personality & behavior
├── DESIGN.md                  # Visual design specification
├── README.md                  # This file
├── package.json               # Widget dependencies
├── vite.config.js             # Vite build config
├── tailwind.config.js         # Tailwind theme tokens
├── index.html                 # Widget HTML entry
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root component (state machine)
│   ├── index.css              # Tailwind + custom utilities
│   └── components/
│       ├── SacredAvatar.jsx   # Animated Sacred Geometry avatar
│       ├── SuggestionChips.jsx# Context-aware suggestion buttons
│       ├── CollapsedPill.jsx  # Compact pill widget state
│       ├── MainWidget.jsx     # Expanded chat widget
│       └── ChatMessage.jsx    # Chat bubble component
├── adaptive-cards/
│   ├── collapsed-pill.json    # Adaptive Card: pill state
│   ├── main-widget.json       # Adaptive Card: main state
│   └── expanded-view.json     # Adaptive Card: expanded state
└── docker/
    ├── Dockerfile.desktop     # Linux desktop container
    ├── supervisord.conf       # Process manager config
    └── startup.sh             # VNC + desktop startup

desktop-overlay/
├── package.json               # Electron dependencies
├── main.js                    # Electron main process
├── preload.js                 # Secure IPC bridge
└── icons/                     # App icons (add .ico/.icns/.png)
```

---

## Roadmap

- [ ] Wire `/api/buddy/chat` to PYTHIA node (Hugging Face) or OpenAI
- [ ] Screen context awareness (OCR / clipboard integration)
- [ ] Voice input via Web Speech API
- [ ] Persistent conversation history (SQLite / Postgres)
- [ ] Reusable workflow templates (save & re-trigger from chips)
- [ ] HeadyAutoIDE extension for in-editor companion panel
- [ ] Windows Widget host integration (Adaptive Cards runtime)
- [ ] Mobile companion (headybuddy-mobile/)

---

## License

Part of the Heady Systems ecosystem.
Sacred Geometry Architecture — Organic Systems — Breathing Interfaces.
