<!--
    ╭─────────────────────────────────────────────────────────────╮
    │  ██╗  ██╗███████╗ █████╗ ██████╗ ██╗   ██╗                  │
    │  ██║  ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝                  │
    │  ███████║█████╗  ███████║██║  ██║ ╚████╔╝                   │
    │  ██╔══██║██╔══╝  ██╔══██║██║  ██║  ╚██╔╝                    │
    │  ██║  ██║███████╗██║  ██║██████╔╝   ██║                     │
    │  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝                     │
    │                                                              │
    │  ∞ Cross-Platform Deployment Protocol ∞                      │
    │  HeadyBrowser + HeadyBuddy + HeadyIDE                       │
    │  Android · Windows · Linux                                   │
    ╰─────────────────────────────────────────────────────────────╯
-->

# Heady Cross-Platform Deployment Protocol

> **Revision**: 1.0.0 | 2026-02-06
> **Target Platforms**: Android (OnePlus Open) · Windows · Linux
> **Goal**: Deploy HeadyBrowser, HeadyBuddy (always-on), HeadyIDE, and SSH access across all devices with full Sacred Geometry branding and unified Heady backend.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [HeadyBrowser — Architecture & Build Protocol](#2-headybrowser--architecture--build-protocol)
3. [HeadyBuddy — Always-On Companion Protocol](#3-headybuddy--always-on-companion-protocol)
4. [HeadyIDE — AI-Native Development Environment](#4-headyide--ai-native-development-environment)
5. [SSH & Remote Access — Phone as Server](#5-ssh--remote-access--phone-as-server)
6. [Shared Backend — Heady Manager Unification](#6-shared-backend--heady-manager-unification)
7. [Phase 0: Immediate Setup (Today)](#7-phase-0-immediate-setup-today)
8. [Phase 1: MVP Build (1-2 Weeks)](#8-phase-1-mvp-build-1-2-weeks)
9. [Phase 2: Full Custom Stack (2-6 Weeks)](#9-phase-2-full-custom-stack-2-6-weeks)
10. [Phase 3: Deep Integration (3-12 Months)](#10-phase-3-deep-integration-3-12-months)
11. [Security Protocol](#11-security-protocol)
12. [Android Battery & Persistence Protocol](#12-android-battery--persistence-protocol)
13. [Termux Bootstrap Script Reference](#13-termux-bootstrap-script-reference)
14. [Build & Package Commands Reference](#14-build--package-commands-reference)
15. [Troubleshooting](#15-troubleshooting)
16. [Registry Entries](#16-registry-entries)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        HEADY ECOSYSTEM MAP                              │
│                                                                         │
│  ┌──────────────────────────┐   ┌──────────────────────────┐           │
│  │  ANDROID (OnePlus Open)  │   │  DESKTOP (Windows/Linux) │           │
│  │                          │   │                          │           │
│  │  ┌────────────────────┐  │   │  ┌────────────────────┐  │           │
│  │  │  HeadyBrowser      │  │   │  │  HeadyBrowser      │  │           │
│  │  │  (React Native +   │  │   │  │  (Tauri + Rust +   │  │           │
│  │  │   GeckoView)       │  │   │  │   system WebView)  │  │           │
│  │  │  ├─ Tabbed UI      │  │   │  │  ├─ Tabbed UI      │  │           │
│  │  │  ├─ Ad/Tracker ✗   │  │   │  │  ├─ Ad/Tracker ✗   │  │           │
│  │  │  ├─ AI Sidebar     │  │   │  │  ├─ AI Sidebar     │  │           │
│  │  │  └─ Buddy Panel    │  │   │  │  ├─ Extensions     │  │           │
│  │  └────────────────────┘  │   │  │  └─ Buddy Panel    │  │           │
│  │                          │   │  └────────────────────┘  │           │
│  │  ┌────────────────────┐  │   │                          │           │
│  │  │  HeadyBuddy Mobile │  │   │  ┌────────────────────┐  │           │
│  │  │  (Foreground Svc)  │  │   │  │  HeadyBuddy Desktop│  │           │
│  │  │  ├─ Notification   │  │   │  │  (Electron/Tauri)  │  │           │
│  │  │  ├─ Floating Bubble│  │   │  │  ├─ System Tray    │  │           │
│  │  │  ├─ Share Target   │  │   │  │  ├─ Global Hotkey  │  │           │
│  │  │  └─ Chat UI        │  │   │  │  └─ Chat Window    │  │           │
│  │  └────────────────────┘  │   │  └────────────────────┘  │           │
│  │                          │   │                          │           │
│  │  ┌────────────────────┐  │   │  ┌────────────────────┐  │           │
│  │  │  Termux + SSH      │  │   │  │  HeadyIDE          │  │           │
│  │  │  (sshd on :8022)   │  │   │  │  (code-server /    │  │           │
│  │  │  ├─ Node.js        │  │   │  │   Theia + Heady    │  │           │
│  │  │  ├─ Python         │  │   │  │   extensions)      │  │           │
│  │  │  └─ heady-manager  │  │   │  └────────────────────┘  │           │
│  │  └────────────────────┘  │   │                          │           │
│  └──────────────────────────┘   └──────────────────────────┘           │
│                          │                     │                        │
│                          ▼                     ▼                        │
│                  ┌───────────────────────────────────┐                  │
│                  │       HEADY MANAGER (Backend)     │                  │
│                  │       localhost:3300 / cloud       │                  │
│                  │                                   │                  │
│                  │  /api/buddy/chat     — AI chat    │                  │
│                  │  /api/buddy/health   — Health     │                  │
│                  │  /api/buddy/suggest  — Chips      │                  │
│                  │  /api/browser/sync   — Tab sync   │                  │
│                  │  /api/browser/block  — Block list  │                  │
│                  │  /api/ide/session    — IDE state   │                  │
│                  │  /api/resources/*    — Monitoring  │                  │
│                  │  /api/monte-carlo/*  — Optimizer   │                  │
│                  │  /api/patterns/*     — Patterns    │                  │
│                  │  /api/self/*         — Self-crit   │                  │
│                  └───────────────────────────────────┘                  │
│                              │                                          │
│                  ┌───────────┴───────────┐                              │
│                  │  LLM Backend          │                              │
│                  │  ├─ Ollama (local)    │                              │
│                  │  ├─ OpenAI / Claude   │                              │
│                  │  └─ PYTHIA (HF)       │                              │
│                  └───────────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Mobile browser engine** | GeckoView (Firefox engine) | Extension support, privacy focus, open source |
| **Mobile framework** | React Native | Shared JS/TS with existing HeadyBuddy React codebase |
| **Desktop browser** | Tauri v2 | Rust backend, system WebView, lightweight (~10MB vs 200MB Electron) |
| **Desktop Buddy** | Electron (existing) | Already built at `desktop-overlay/`, functional tray + hotkey |
| **Mobile Buddy** | Android Foreground Service | OS-compliant always-on, persistent notification |
| **IDE** | code-server (VS Code in browser) | Accessible from any device, extension ecosystem |
| **AI Backend** | heady-manager.js (existing) | Single API for all clients, pluggable LLM |
| **SSH** | Termux + OpenSSH | Battle-tested, full Linux env on Android |

---

## 2. HeadyBrowser — Architecture & Build Protocol

### 2.1 Browser Engine Internals (What We Leverage, Not Rebuild)

A modern browser consists of these major subsystems. **We do NOT rebuild any of these.** We wrap and augment them:

| Subsystem | What It Does | Our Engine |
|-----------|-------------|------------|
| **Rendering Engine** | Parses HTML/CSS, builds DOM/CSSOM, paints pixels | GeckoView (mobile), WebView2/WebKitGTK (desktop via Tauri) |
| **JavaScript Engine** | Executes JS, JIT compilation | SpiderMonkey (Gecko) / V8 (WebView2) |
| **Networking Stack** | HTTP/2, HTTP/3, TLS, caching, cookies | Engine-provided |
| **Storage** | IndexedDB, localStorage, cookies, Cache API | Engine-provided |
| **GPU Compositor** | Hardware-accelerated rendering, WebGL, WebGPU | Engine-provided |
| **Process Model** | Site isolation, sandboxing | Engine-provided |

### 2.2 The Heady Layer (What We Build)

```
┌─────────────────────────────────────────────────────────┐
│                    HEADY BROWSER LAYER                    │
│                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Tab Manager  │  │ AI Panel    │  │ Privacy Engine  │  │
│  │             │  │             │  │                 │  │
│  │ • Tab CRUD  │  │ • Sidebar   │  │ • DNS blocking  │  │
│  │ • Groups    │  │ • Selection │  │ • Tracker block │  │
│  │ • Workspaces│  │   → AI      │  │ • Cookie mgmt  │  │
│  │ • Sync      │  │ • Page      │  │ • HTTPS force  │  │
│  │ • Tree tabs │  │   summary   │  │ • Fingerprint  │  │
│  │ • History   │  │ • "Ask      │  │   protection   │  │
│  │ • Sessions  │  │   Heady"    │  │ • Configurable │  │
│  └─────────────┘  └─────────────┘  │   per-site     │  │
│                                     └─────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ UI Shell    │  │ Buddy       │  │ Extension Host  │  │
│  │             │  │ Integration │  │                 │  │
│  │ • Sacred    │  │             │  │ • WebExtension  │  │
│  │   Geometry  │  │ • Inline    │  │   API (desktop) │  │
│  │   theme     │  │   Buddy    │  │ • Simplified    │  │
│  │ • Dark mode │  │   panel    │  │   rules engine  │  │
│  │ • Adaptive  │  │ • Share to │  │   (mobile)      │  │
│  │   layout    │  │   Buddy   │  │ • Content       │  │
│  │ • Gestures  │  │ • Context  │  │   scripts       │  │
│  │   (mobile)  │  │   chips   │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐    │
│  │ Cross-Device Sync (via heady-manager API)          │    │
│  │ • Tabs, bookmarks, history, settings, blocklists  │    │
│  │ • E2E encrypted with user key                      │    │
│  └───────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### 2.3 HeadyBrowser Mobile — React Native + GeckoView

**Project**: `headybrowser-mobile/`

**Dependencies**:
```json
{
  "react-native": "0.73+",
  "react-native-geckoview": "custom binding (see below)",
  "@react-navigation/native": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "react-native-reanimated": "^3.x",
  "react-native-gesture-handler": "^2.x",
  "zustand": "^4.x",
  "react-native-mmkv": "^2.x"
}
```

**GeckoView Integration Strategy**:

GeckoView doesn't have an official React Native binding. Two paths:

**Path A — Native Module Wrapper (Recommended)**:
1. Create an Android native module `HeadyGeckoViewManager.java`
2. Wraps `org.mozilla.geckoview.GeckoView` as a React Native `ViewManager`
3. Exposes methods: `loadUrl()`, `goBack()`, `goForward()`, `reload()`, `getTitle()`, `getUrl()`
4. Exposes events: `onLoadStart`, `onLoadEnd`, `onTitleChange`, `onUrlChange`, `onLongPress`
5. Extension support via GeckoView's `WebExtension` API

**Path B — WebView Fallback (Faster MVP)**:
1. Use `react-native-webview` (wraps Android WebView = Chromium)
2. Lose Firefox extension support but ship faster
3. Inject Heady scripts via `injectedJavaScript`

**Recommended**: Start with **Path B** for MVP, migrate to **Path A** for v2.

**Mobile Browser Feature Matrix**:

| Feature | MVP (Week 1-2) | v2 (Month 1-2) | v3 (Month 3+) |
|---------|----------------|-----------------|----------------|
| Tabbed browsing | ✓ | ✓ | ✓ |
| Bookmarks | ✓ | ✓ | ✓ |
| History | ✓ | ✓ | ✓ |
| Ad blocking (DNS) | ✓ | ✓ | ✓ |
| Ad blocking (content) | — | ✓ | ✓ |
| Dark mode | ✓ | ✓ | ✓ |
| Sacred Geometry theme | Basic | Full | Full |
| AI "Ask Heady" button | ✓ | ✓ | ✓ |
| Page summarizer | — | ✓ | ✓ |
| Share to Buddy | ✓ | ✓ | ✓ |
| Cross-device sync | — | ✓ | ✓ |
| GeckoView engine | — | ✓ | ✓ |
| Extension support | — | — | ✓ |
| Reader mode | — | ✓ | ✓ |
| Workspaces | — | — | ✓ |
| Fingerprint protection | — | ✓ | ✓ |

### 2.4 HeadyBrowser Desktop — Tauri v2

**Project**: `headybrowser-desktop/`

**Why Tauri v2**:
- Uses system WebView (WebView2 on Windows, WebKitGTK on Linux) — no bundled Chromium
- Rust backend for security, speed, and low memory
- ~10MB binary vs ~200MB Electron
- IPC between Rust and JS frontend
- Plugin system for OS integration

**Tech Stack**:
```
Frontend: React + Tailwind (same design tokens as HeadyBuddy)
Backend:  Rust (Tauri commands)
Engine:   System WebView (WebView2 / WebKitGTK)
Build:    cargo-tauri
```

**Desktop Browser Feature Matrix**:

| Feature | MVP | v2 | v3 |
|---------|-----|----|----|
| Multi-tab with tree view | ✓ | ✓ | ✓ |
| Bookmarks + History | ✓ | ✓ | ✓ |
| Address bar + search | ✓ | ✓ | ✓ |
| Ad/tracker blocking | DNS | Content filter | Full uBO-equivalent |
| AI sidebar (Buddy) | ✓ | ✓ | ✓ |
| Text selection → AI | ✓ | ✓ | ✓ |
| WebExtension support | — | Partial (MV3) | Full |
| Sacred Geometry theme | ✓ | ✓ | ✓ |
| Cross-device sync | — | ✓ | ✓ |
| Vertical tabs | — | ✓ | ✓ |
| Workspaces | — | — | ✓ |
| PWA install support | — | ✓ | ✓ |
| Picture-in-picture | — | ✓ | ✓ |
| Developer tools | System DevTools | Enhanced | Custom |

### 2.5 Features Borrowed From Best Browsers

| Source Browser | Feature We Take | Implementation |
|---------------|----------------|----------------|
| **Chrome** | Speed, V8 performance, DevTools | System WebView (desktop uses Chromium-backed WebView2) |
| **Firefox** | Extension ecosystem, privacy, GeckoView | Mobile engine (v2), desktop extension compat |
| **Brave** | Built-in ad/tracker blocking, Shields UI | Content filter engine + DNS blocking |
| **Arc** | Workspaces, vertical sidebar, command bar | Custom UI layer |
| **Vivaldi** | Highly customizable UI, tab stacking | Tab groups + configurable toolbar |
| **Edge** | Collections, vertical tabs, read aloud | Collections feature, TTS integration |
| **Safari** | Energy efficiency, reader mode | Reader mode, battery-aware rendering |
| **Opera** | Flow (cross-device), sidebar panels | Buddy sidebar, sync API |
| **Tor Browser** | Fingerprint resistance | Anti-fingerprinting headers + canvas noise |

---

## 3. HeadyBuddy — Always-On Companion Protocol

### 3.1 Android Always-On Architecture

```
┌─────────────────────────────────────────────────────┐
│  ANDROID ALWAYS-ON ARCHITECTURE                      │
│                                                       │
│  ┌───────────────────────────────────────────────┐   │
│  │ HeadyBuddyService (Foreground Service)         │   │
│  │ Type: FOREGROUND_SERVICE_TYPE_DATA_SYNC        │   │
│  │                                                 │   │
│  │  ┌─────────────┐  ┌─────────────────────────┐ │   │
│  │  │ Persistent  │  │ BuddyBrain              │ │   │
│  │  │ Notification│  │ ├─ Context awareness     │ │   │
│  │  │ ├─ "Heady  │  │ ├─ Intent listener      │ │   │
│  │  │ │  Buddy   │  │ ├─ Clipboard monitor    │ │   │
│  │  │ │  active" │  │ ├─ Notification reader  │ │   │
│  │  │ ├─ Quick   │  │ └─ Share handler        │ │   │
│  │  │ │  actions │  │                          │ │   │
│  │  │ └─ Expand  │  └─────────────────────────┘ │   │
│  │  │    button  │                               │   │
│  │  └─────────────┘                               │   │
│  │                                                 │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ FloatingBubbleView (Overlay)             │   │   │
│  │  │ Uses SYSTEM_ALERT_WINDOW permission      │   │   │
│  │  │ ├─ Sacred Geometry avatar (animated)    │   │   │
│  │  │ ├─ Drag to reposition                   │   │   │
│  │  │ ├─ Tap → expand to chat                 │   │   │
│  │  │ └─ Long press → quick actions menu      │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  │                                                 │   │
│  │  ┌─────────────────────────────────────────┐   │   │
│  │  │ HeadyManagerClient                       │   │   │
│  │  │ ├─ REST client to heady-manager API     │   │   │
│  │  │ ├─ WebSocket for real-time updates      │   │   │
│  │  │ ├─ Offline queue (SQLite)               │   │   │
│  │  │ └─ Auto-reconnect with backoff          │   │   │
│  │  └─────────────────────────────────────────┘   │   │
│  └───────────────────────────────────────────────┘   │
│                                                       │
│  ┌───────────────────────────────────────────────┐   │
│  │ Boot Receiver                                   │   │
│  │ RECEIVE_BOOT_COMPLETED → start service          │   │
│  └───────────────────────────────────────────────┘   │
│                                                       │
│  ┌───────────────────────────────────────────────┐   │
│  │ WorkManager Jobs                                │   │
│  │ ├─ SyncWorker (periodic, 15 min)              │   │
│  │ ├─ HealthCheckWorker (periodic, 30 min)       │   │
│  │ └─ CleanupWorker (daily)                       │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Android Manifest Requirements**:
```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

<service
    android:name=".HeadyBuddyService"
    android:foregroundServiceType="dataSync"
    android:exported="false" />

<receiver
    android:name=".BootReceiver"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
    </intent-filter>
</receiver>
```

**Foreground Service Lifecycle**:
```
App Start / Boot Complete
    │
    ▼
startForegroundService(intent)
    │
    ▼
onCreate() → create notification channel
    │
    ▼
onStartCommand() → startForeground(id, notification) [WITHIN 5 SECONDS]
    │
    ▼
Service Running ◄──────────────────────────────────────┐
    │                                                    │
    ├── User interacts (bubble, notification, share)     │
    ├── Background sync (WorkManager)                    │
    ├── Context events (clipboard, app switch)           │
    │                                                    │
    ▼                                                    │
onDestroy() → restart via AlarmManager or WorkManager ──┘
```

### 3.2 Windows Always-On Architecture

```
HeadyBuddy Desktop (Electron)
├── main.js
│   ├── Creates BrowserWindow (hidden on start)
│   ├── Creates Tray icon (Sacred Geometry)
│   ├── Registers global shortcut: Ctrl+Shift+H
│   ├── Registers startup: app.setLoginItemSettings({openAtLogin: true})
│   └── Window close → hide to tray (NOT quit)
│
├── preload.js
│   └── Exposes IPC bridge for:
│       ├── buddy:send-message
│       ├── buddy:get-suggestions
│       ├── system:get-resources
│       └── system:get-layer
│
└── Widget (headybuddy/dist/)
    └── React app with all widget states
```

**Key Windows Integration Points**:
- **Startup**: `app.setLoginItemSettings({ openAtLogin: true, openAsHidden: true })`
- **Tray**: Persistent system tray icon with context menu
- **Always visible**: `win.on('close', (e) => { e.preventDefault(); win.hide(); })`
- **Global hotkey**: `globalShortcut.register('Ctrl+Shift+H', toggleWindow)`

### 3.3 Linux Always-On Architecture

**systemd User Service** (`~/.config/systemd/user/headybuddy.service`):
```ini
[Unit]
Description=HeadyBuddy Always-On Companion
After=graphical-session.target

[Service]
Type=simple
ExecStart=/usr/bin/node /opt/heady/heady-manager.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=HEADY_PORT=3300

[Install]
WantedBy=default.target
```

**Enable & Start**:
```bash
systemctl --user daemon-reload
systemctl --user enable headybuddy.service
systemctl --user start headybuddy.service
loginctl enable-linger $USER   # keeps service running even when logged out
```

---

## 4. HeadyIDE — AI-Native Development Environment

### 4.1 Recommended Stack: code-server

**Why code-server over Theia**:
- Full VS Code experience in browser
- Massive extension ecosystem (no open-vsx limitations)
- Single binary, easy to deploy
- Accessible from phone browser, desktop browser, or native

### 4.2 Installation Protocol

**Windows**:
```powershell
# Option 1: winget
winget install CoderInc.code-server

# Option 2: npm
npm install -g code-server

# Start
code-server --bind-addr 0.0.0.0:8443 --auth password
```

**Linux**:
```bash
curl -fsSL https://code-server.dev/install.sh | sh
sudo systemctl enable --now code-server@$USER
# Edit ~/.config/code-server/config.yaml for bind-addr and password
```

**Docker (anywhere)**:
```bash
docker run -d \
  --name heady-ide \
  -p 8443:8443 \
  -v "$HOME/.local:/home/coder/.local" \
  -v "$HOME/Heady:/home/coder/project" \
  -e PASSWORD=heady \
  codercom/code-server:latest
```

### 4.3 Heady Extensions to Install

```bash
# Sacred Geometry theme (custom)
# AI coding assistant
code-server --install-extension continue.continue
# Tailwind CSS IntelliSense
code-server --install-extension bradlc.vscode-tailwindcss
# React/JSX support
code-server --install-extension dsznajder.es7-react-js-snippets
# Python
code-server --install-extension ms-python.python
# YAML
code-server --install-extension redhat.vscode-yaml
# Docker
code-server --install-extension ms-azuretools.vscode-docker
# Git
code-server --install-extension eamodio.gitlens
```

### 4.4 HeadyIDE Integration with Buddy

Create a VS Code extension or use Continue.dev to wire into heady-manager:

```json
{
  "continue.models": [{
    "title": "HeadyBuddy",
    "provider": "openai-compatible",
    "apiBase": "http://localhost:3300/api/buddy",
    "model": "heady-buddy"
  }]
}
```

### 4.5 Accessing IDE from Phone

Once code-server is running on your desktop/server:
1. Open HeadyBrowser on phone
2. Navigate to `http://<desktop-ip>:8443`
3. Full VS Code experience in the browser
4. Or SSH in via Termux and use `code` CLI

---

## 5. SSH & Remote Access — Phone as Server

### 5.1 Termux Setup Protocol (Android)

**Step 1: Install Termux**
- Download from F-Droid (NOT Play Store — Play Store version is outdated)
- URL: `https://f-droid.org/en/packages/com.termux/`
- Also install: Termux:Boot, Termux:Widget, Termux:API

**Step 2: Bootstrap Script**
Run this in Termux after installation:

```bash
#!/data/data/com.termux/files/usr/bin/bash
# === HeadyTermux Bootstrap ===
# Run: curl -fsSL https://raw.githubusercontent.com/HeadySystems/Heady/main/scripts/termux-bootstrap.sh | bash

echo "╔══════════════════════════════════════╗"
echo "║  Heady Termux Bootstrap v1.0.0       ║"
echo "║  Setting up your phone as a server   ║"
echo "╚══════════════════════════════════════╝"

# Update packages
pkg update -y && pkg upgrade -y

# Core tools
pkg install -y openssh git nodejs-lts python rust build-essential \
  wget curl jq termux-api termux-services nmap net-tools

# Setup SSH
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Set SSH password
echo "Set your SSH password:"
passwd

# Generate host keys
ssh-keygen -A

# Start SSH server
sshd
echo "SSH server started on port 8022"
echo "Connect from PC: ssh $(whoami)@$(ifconfig wlan0 | grep 'inet ' | awk '{print $2}') -p 8022"

# Setup Node.js project space
mkdir -p ~/heady
cd ~/heady

# Clone Heady repo
git clone https://github.com/HeadySystems/Heady.git ~/heady/Heady 2>/dev/null || true

# Install heady-manager dependencies
if [ -d ~/heady/Heady ]; then
  cd ~/heady/Heady
  npm install --production 2>/dev/null
fi

# Setup Termux:Boot auto-start
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/start-heady.sh << 'BOOT'
#!/data/data/com.termux/files/usr/bin/bash
# Auto-start SSH + Heady on boot
termux-wake-lock
sshd
cd ~/heady/Heady && node heady-manager.js &
BOOT
chmod +x ~/.termux/boot/start-heady.sh

# Setup storage access
termux-setup-storage

echo ""
echo "╔══════════════════════════════════════╗"
echo "║  Bootstrap complete!                  ║"
echo "║                                       ║"
echo "║  SSH:    port 8022                    ║"
echo "║  Heady:  port 3300 (after npm start)  ║"
echo "║                                       ║"
echo "║  Auto-start on boot: ENABLED          ║"
echo "║  (via Termux:Boot)                    ║"
echo "╚══════════════════════════════════════╝"
```

**Step 3: SSH Key Authentication (Recommended)**

On your Windows/Linux PC:
```powershell
# Generate key pair (if you don't have one)
ssh-keygen -t ed25519 -C "heady@desktop"

# Copy public key to phone
# Option 1: Manual (copy contents of ~/.ssh/id_ed25519.pub)
# Then on phone in Termux:
# echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
# chmod 600 ~/.ssh/authorized_keys

# Option 2: If ssh-copy-id is available
ssh-copy-id -p 8022 user@phone-ip
```

**Step 4: Disable Password Auth (After Key Setup)**
```bash
# In Termux, edit sshd config:
echo "PasswordAuthentication no" >> $PREFIX/etc/ssh/sshd_config
# Restart: pkill sshd && sshd
```

### 5.2 SSH Connection Profiles

**Windows (~/.ssh/config or C:\Users\erich\.ssh\config)**:
```
Host heady-phone
    HostName <phone-ip>
    Port 8022
    User u0_a###
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ServerAliveCountMax 3

Host heady-phone-tunnel
    HostName <phone-ip>
    Port 8022
    User u0_a###
    IdentityFile ~/.ssh/id_ed25519
    LocalForward 3301 localhost:3300
    LocalForward 8023 localhost:8443
```

### 5.3 Useful Tunnels

```bash
# Access phone's heady-manager from desktop browser
ssh -L 3301:localhost:3300 heady-phone
# Then open http://localhost:3301 on desktop

# Access desktop IDE from phone browser via reverse tunnel
ssh -R 8443:localhost:8443 heady-phone
# Then on phone open http://localhost:8443

# Full tunnel: phone heady-manager + desktop IDE bidirectional
ssh -L 3301:localhost:3300 -R 8443:localhost:8443 heady-phone
```

### 5.4 Security Hardening

| Measure | How |
|---------|-----|
| Key-only auth | Disable password in `sshd_config` |
| Non-default port | Already 8022 (Termux default, not 22) |
| Firewall | `iptables` rules to restrict to known IPs |
| Fail2ban equivalent | Monitor `/data/data/com.termux/files/usr/var/log/auth.log` |
| Wake lock | `termux-wake-lock` keeps CPU active for SSH |
| VPN | Use Tailscale or WireGuard for remote access outside LAN |

---

## 6. Shared Backend — Heady Manager Unification

### 6.1 New API Endpoints for Cross-Platform

Add these to `heady-manager.js`:

```javascript
// === Browser Sync API ===
// POST /api/browser/tabs/sync     — Push/pull open tabs
// GET  /api/browser/tabs           — Get all synced tabs
// POST /api/browser/bookmarks/sync — Push/pull bookmarks
// GET  /api/browser/bookmarks      — Get all bookmarks
// POST /api/browser/history/sync   — Push history entries
// GET  /api/browser/history        — Search history
// GET  /api/browser/blocklist      — Get ad/tracker blocklist
// POST /api/browser/blocklist      — Update custom rules

// === IDE Session API ===
// POST /api/ide/session            — Register active IDE session
// GET  /api/ide/sessions           — List active sessions
// POST /api/ide/command            — Execute command in IDE
// GET  /api/ide/status             — IDE health check

// === Device Registry API ===
// POST /api/devices/register       — Register a device
// GET  /api/devices                — List all registered devices
// POST /api/devices/ping           — Device heartbeat
// GET  /api/devices/:id/status     — Device status
```

### 6.2 Data Sync Protocol

```
Device A (phone)                    Heady Manager                    Device B (desktop)
    │                                    │                                │
    ├─── POST /api/browser/tabs/sync ──▶│                                │
    │    { tabs: [...], deviceId, ts }   │                                │
    │                                    │── merge + store ──────────────▶│
    │                                    │   (WebSocket push)             │
    │                                    │                                │
    │◀── GET /api/browser/tabs ─────────│◀── POST /api/browser/tabs/sync─┤
    │    (includes desktop tabs)         │    { tabs: [...] }             │
    │                                    │                                │
```

**Conflict Resolution**: Last-write-wins with device priority. User can set primary device.

---

## 7. Phase 0: Immediate Setup (Today)

### 7.1 Phone Setup (30 minutes)

1. **Install Termux** from F-Droid
2. **Install Termux:Boot** from F-Droid
3. **Install Termux:API** from F-Droid
4. **Run bootstrap script** (Section 5.1, Step 2)
5. **Set up SSH keys** (Section 5.1, Steps 3-4)
6. **Install interim browser**: Download **Iceraven Browser** from GitHub Releases
   - URL: `https://github.com/nicholasgasior/niceraven-browser/releases` (or search F-Droid for Firefox forks)
   - Enable extensions: uBlock Origin, Dark Reader
7. **Battery optimization**: Settings → Apps → Termux → Battery → Unrestricted
8. **Battery optimization**: Settings → Apps → Iceraven → Battery → Unrestricted

### 7.2 Windows Desktop Setup (30 minutes)

1. **Verify HeadyBuddy desktop works**:
   ```powershell
   cd C:\Users\erich\Heady\desktop-overlay
   npm install
   cd ..\headybuddy
   npm install
   npm run build
   cd ..\desktop-overlay
   npm run dev
   ```
   → Should see Electron tray icon, Ctrl+Shift+H toggles widget

2. **Install code-server** (HeadyIDE):
   ```powershell
   npm install -g code-server
   code-server --bind-addr 0.0.0.0:8443 --auth password
   ```
   → Access at `http://localhost:8443` from any browser

3. **Start heady-manager**:
   ```powershell
   cd C:\Users\erich\Heady
   npm start
   ```
   → API at `http://localhost:3300`

4. **SSH to phone** (test connection):
   ```powershell
   ssh -p 8022 u0_a###@<phone-ip>
   ```

5. **Install interim AI browser extension**:
   - Install in Chrome/Edge/Firefox: search for "Ollama" sidebar extensions
   - Or use "Sider" / "Monica" as interim AI sidebar
   - Point to `http://localhost:3300/api/buddy/chat` if configurable

### 7.3 Linux Desktop Setup (30 minutes)

```bash
# HeadyBuddy daemon
cd ~/Heady
npm install
npm start &

# code-server
curl -fsSL https://code-server.dev/install.sh | sh
sudo systemctl enable --now code-server@$USER

# SSH config for phone
cat >> ~/.ssh/config << 'EOF'
Host heady-phone
    HostName <phone-ip>
    Port 8022
    User u0_a###
    IdentityFile ~/.ssh/id_ed25519
EOF
```

---

## 8. Phase 1: MVP Build (1-2 Weeks)

### 8.1 HeadyBrowser Mobile MVP

**Day 1-3: Project Scaffold**
```bash
npx react-native init HeadyBrowserMobile --template react-native-template-typescript
cd HeadyBrowserMobile
npm install react-native-webview @react-navigation/native @react-navigation/bottom-tabs \
  react-native-gesture-handler react-native-reanimated react-native-mmkv zustand \
  react-native-vector-icons
```

**Day 3-5: Core Browser Shell**
- Tab manager (zustand store)
- WebView wrapper with navigation controls
- Address bar with URL/search input
- Bottom navigation: Tabs | Bookmarks | History | Settings
- Sacred Geometry styled chrome (dark theme)

**Day 5-7: Heady Features**
- "Ask Heady" floating button on every page
- Text selection → context menu → "Explain" / "Summarize"
- Share intent receiver → Buddy chat
- Basic DNS-level ad blocking via custom resolver

**Day 7-10: Polish & Test**
- Animations (Sacred Geometry avatar states)
- Error handling, offline mode
- APK build and sideload to OnePlus Open

### 8.2 HeadyBuddy Mobile MVP

**Day 1-2: Foreground Service**
```kotlin
// HeadyBuddyService.kt
class HeadyBuddyService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = createNotification()
        startForeground(NOTIFICATION_ID, notification)
        // Start WebSocket to heady-manager
        // Start context listener
        return START_STICKY
    }
}
```

**Day 2-3: Chat UI**
- React Native chat screen (reuse HeadyBuddy web components via WebView)
- Or native Kotlin/Jetpack Compose chat (faster, more native feel)

**Day 3-5: Integration**
- Boot receiver for auto-start
- Share target for receiving content from other apps
- Notification quick actions: "Ask Heady", "Summarize clipboard"

### 8.3 HeadyBrowser Desktop MVP

**Day 1-3: Tauri Setup**
```bash
cargo install create-tauri-app
cargo create-tauri-app headybrowser-desktop --template react-ts
cd headybrowser-desktop
npm install
```

**Day 3-7: Browser UI**
- Multi-tab interface (Tauri WebView management)
- Address bar + navigation
- AI sidebar panel
- Sacred Geometry theme
- Tray icon + global shortcut

### 8.4 HeadyIDE Enhancement

**Day 1-2: code-server customization**
- Custom Sacred Geometry VS Code theme
- Heady extension with Buddy sidebar panel
- Settings sync across devices

---

## 9. Phase 2: Full Custom Stack (2-6 Weeks)

### 9.1 GeckoView Integration (Mobile)
- Replace WebView with GeckoView native module
- Enable Firefox extension support
- Implement content blocking via GeckoView's `ContentBlocking` API
- Reader mode via `ReaderView`

### 9.2 Cross-Device Sync
- Implement sync API in heady-manager (Section 6)
- E2E encryption with device-specific keys
- Tab, bookmark, history, and settings sync
- Real-time push via WebSocket

### 9.3 Advanced AI Features
- Full page summarization (extract article → LLM → summary card)
- "Research mode": multi-tab research with auto-notes
- Voice input (Web Speech API on desktop, Android SpeechRecognizer on mobile)
- Agent mode: Buddy browses on your behalf (using browser-use or Playwright)

### 9.4 Extension Ecosystem
- WebExtension manifest v3 support on desktop
- Simplified "Heady Rules" on mobile (JSON-based content rules)
- Heady Extension Store (curated, privacy-reviewed)

---

## 10. Phase 3: Deep Integration (3-12 Months)

### 10.1 Social Impact Browser Features
- Search revenue sharing: portion of affiliate revenue to user-selected causes
- "Heady Impact Meter": per-session carbon/attention/donation tracking
- Community annotations (privacy-preserving)
- Heady Paths: curated knowledge trails through the web

### 10.2 Advanced IDE Integration
- HeadyAutoIDE as a code-server plugin
- Full agentic coding workflows in browser
- Live collaboration (like VS Code Live Share)
- Spec-driven development panel

### 10.3 Decentralized Sync
- Replace centralized sync with CRDTs for offline-first
- Optional self-hosted sync server
- Zero-knowledge encryption

---

## 11. Security Protocol

### 11.1 Threat Model

| Threat | Mitigation |
|--------|-----------|
| SSH brute force on phone | Key-only auth, non-standard port, wake-lock timeout |
| Man-in-middle (sync) | TLS everywhere, certificate pinning on mobile |
| Malicious extension | Curated store, permission review, sandbox |
| LLM data leakage | Local-first processing, opt-in cloud, no PII in prompts |
| Lost phone | Remote wipe via heady-manager command, encrypted local store |
| Rogue app accessing Buddy | Intent filter restrictions, signature verification |

### 11.2 Encryption at Rest

| Platform | Storage | Encryption |
|----------|---------|-----------|
| Android | SQLite + MMKV | Android Keystore + AES-256-GCM |
| Windows | electron-store / SQLite | DPAPI + AES-256-GCM |
| Linux | SQLite | libsecret + AES-256-GCM |

### 11.3 Network Security

- All API calls over HTTPS in production
- Local development uses HTTP on localhost only
- WebSocket connections use WSS in production
- API keys stored in secure enclaves per platform

---

## 12. Android Battery & Persistence Protocol

### 12.1 OEM-Specific Battery Settings

**OnePlus Open (OxygenOS / ColorOS)**:
1. Settings → Battery → Battery Optimization → HeadyBuddy → Don't Optimize
2. Settings → Apps → HeadyBuddy → Battery → Allow Background Activity
3. Settings → Battery → Advanced Settings → Optimize Battery Use → Exclude HeadyBuddy
4. Lock the app in Recent Apps (swipe down on the card to lock)

**Generic Android 14+**:
1. Settings → Apps → HeadyBuddy → Battery → Unrestricted
2. Settings → Battery → Battery Saver → Exclude HeadyBuddy

### 12.2 Foreground Service Best Practices

```
DO:
  ✓ Call startForeground() within 5 seconds of service start
  ✓ Use FOREGROUND_SERVICE_TYPE_DATA_SYNC
  ✓ Show meaningful notification with actions
  ✓ Use WorkManager for periodic tasks (not timers)
  ✓ Handle doze mode gracefully
  ✓ Request REQUEST_IGNORE_BATTERY_OPTIMIZATIONS

DON'T:
  ✗ Hold wake locks indefinitely
  ✗ Poll aggressively (min 15 min for WorkManager)
  ✗ Run CPU-intensive work in foreground service
  ✗ Ignore battery optimization settings
  ✗ Fight the OS — work with it
```

### 12.3 Termux Persistence

```bash
# Keep Termux alive
termux-wake-lock     # Acquire partial wake lock

# Auto-start on boot (requires Termux:Boot)
# Scripts in ~/.termux/boot/ run automatically

# Monitor and restart services
cat > ~/heady/watchdog.sh << 'EOF'
#!/bin/bash
while true; do
  # Check SSH
  if ! pgrep -x sshd > /dev/null; then
    sshd
    echo "[$(date)] Restarted sshd" >> ~/heady/watchdog.log
  fi
  # Check heady-manager
  if ! pgrep -f "heady-manager" > /dev/null; then
    cd ~/heady/Heady && node heady-manager.js &
    echo "[$(date)] Restarted heady-manager" >> ~/heady/watchdog.log
  fi
  sleep 300  # Check every 5 minutes
done
EOF
chmod +x ~/heady/watchdog.sh
```

---

## 13. Termux Bootstrap Script Reference

See `scripts/termux-bootstrap.sh` for the full script. Summary of what it installs:

| Package | Purpose |
|---------|---------|
| `openssh` | SSH server (sshd) |
| `git` | Version control |
| `nodejs-lts` | heady-manager runtime |
| `python` | Python worker, PYTHIA |
| `rust` | Tauri builds (future) |
| `build-essential` | Native module compilation |
| `wget`, `curl`, `jq` | HTTP tools |
| `termux-api` | Android integration (clipboard, notifications, sensors) |
| `termux-services` | sv-style service management |
| `nmap`, `net-tools` | Network diagnostics |

---

## 14. Build & Package Commands Reference

### 14.1 HeadyBuddy Desktop (Windows)

```powershell
# Development
cd C:\Users\erich\Heady\headybuddy
npm run dev                          # Widget dev server on :3400

cd C:\Users\erich\Heady\desktop-overlay
npm run dev                          # Electron with widget

# Production build
cd C:\Users\erich\Heady\headybuddy
npm run build                        # Build widget to dist/

cd C:\Users\erich\Heady\desktop-overlay
npm run build:widget                 # Build widget
npm run package:win                  # Package .exe installer
npm run package:linux                # Package .AppImage
```

### 14.2 HeadyBrowser Mobile (Android)

```bash
cd headybrowser-mobile

# Development
npx react-native start              # Metro bundler
npx react-native run-android        # Build & deploy to device

# Release APK
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk

# Or use eas-cli for managed builds
npx eas build --platform android
```

### 14.3 HeadyBrowser Desktop (Tauri)

```bash
cd headybrowser-desktop

# Development
npm run tauri dev                    # Hot-reload development

# Production
npm run tauri build                  # Build for current OS
# Output: src-tauri/target/release/bundle/
#   Windows: .msi, .exe
#   Linux: .AppImage, .deb
```

### 14.4 HeadyIDE (code-server)

```bash
# Start
code-server --bind-addr 0.0.0.0:8443

# With custom config
code-server --config ~/.config/code-server/config.yaml

# Docker
docker-compose -f docker-compose.ide.yml up -d
```

---

## 15. Troubleshooting

### 15.1 Android

| Problem | Solution |
|---------|---------|
| Termux killed in background | Battery optimization → Unrestricted; Lock in recents |
| SSH connection refused | Run `sshd` in Termux; check IP with `ifconfig` |
| SSH timeout | `termux-wake-lock`; check phone isn't in deep sleep |
| HeadyBuddy service killed | Foreground service + battery exemption + boot receiver |
| Can't install APK | Enable "Install from unknown sources" for your file manager |
| Port 8022 not accessible | Ensure same Wi-Fi; check `netstat -tlnp` in Termux |

### 15.2 Windows

| Problem | Solution |
|---------|---------|
| Electron window doesn't appear | Check tray icon; Ctrl+Shift+H to toggle |
| HeadyBuddy won't start at login | Check Startup folder or registry entry |
| code-server not accessible | Check firewall for port 8443 |
| heady-manager port conflict | Check nothing else on :3300; use `netstat -ano | findstr 3300` |

### 15.3 Linux

| Problem | Solution |
|---------|---------|
| systemd service fails | `journalctl --user -u headybuddy -f` for logs |
| No tray icon | Install `libappindicator3-1` or `gnome-shell-extension-appindicator` |
| WebView2 not available | Tauri uses WebKitGTK on Linux — `sudo apt install libwebkit2gtk-4.1-dev` |

### 15.4 Cross-Platform

| Problem | Solution |
|---------|---------|
| Sync not working | Check heady-manager health: `curl http://localhost:3300/api/health` |
| AI responses slow | Check LLM backend; try local Ollama vs cloud |
| Buddy not connecting | Verify API URL in client config; check CORS |

---

## 16. Registry Entries

Add these to `heady-registry.json`:

```json
{
  "id": "headybrowser-mobile",
  "name": "HeadyBrowser Mobile",
  "type": "mobile-app",
  "version": "0.1.0",
  "sourceOfTruth": "headybrowser-mobile/",
  "responsibilities": ["mobileBrowsing", "adBlocking", "aiSidebar", "crossDeviceSync"],
  "ownership": "core",
  "status": "planned",
  "criticality": "high"
},
{
  "id": "headybrowser-desktop",
  "name": "HeadyBrowser Desktop",
  "type": "desktop-app",
  "version": "0.1.0",
  "sourceOfTruth": "headybrowser-desktop/",
  "responsibilities": ["desktopBrowsing", "adBlocking", "aiSidebar", "extensions", "crossDeviceSync"],
  "ownership": "core",
  "status": "planned",
  "criticality": "high"
},
{
  "id": "headybuddy-mobile",
  "name": "HeadyBuddy Mobile",
  "type": "mobile-app",
  "version": "0.1.0",
  "sourceOfTruth": "headybuddy-mobile/",
  "responsibilities": ["alwaysOnCompanion", "foregroundService", "shareTarget", "floatingBubble"],
  "ownership": "core",
  "status": "planned",
  "criticality": "high"
},
{
  "id": "heady-ide",
  "name": "HeadyIDE",
  "type": "web-ide",
  "version": "1.0.0",
  "sourceOfTruth": "configs/heady-ide.yaml",
  "responsibilities": ["codeServer", "aiAssistant", "crossDeviceAccess"],
  "ownership": "core",
  "status": "planned",
  "criticality": "high"
},
{
  "id": "termux-bootstrap",
  "name": "Termux Bootstrap",
  "type": "script",
  "version": "1.0.0",
  "sourceOfTruth": "scripts/termux-bootstrap.sh",
  "responsibilities": ["phoneSSH", "phoneServer", "remoteAccess"],
  "ownership": "core",
  "status": "active",
  "criticality": "medium"
}
```

---

## Appendix A: Quick Reference Card

```
╔════════════════════════════════════════════════════════════╗
║  HEADY ECOSYSTEM — QUICK REFERENCE                        ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  PHONE (Android / OnePlus Open)                            ║
║  ├── HeadyBrowser: sideloaded APK                         ║
║  ├── HeadyBuddy:   foreground service (always-on)         ║
║  ├── SSH:           Termux sshd on :8022                  ║
║  └── Heady API:     heady-manager on :3300 (Termux)       ║
║                                                            ║
║  DESKTOP (Windows)                                         ║
║  ├── HeadyBrowser: Tauri app (or interim Chrome + ext)    ║
║  ├── HeadyBuddy:   Electron tray app (Ctrl+Shift+H)      ║
║  ├── HeadyIDE:     code-server on :8443                   ║
║  └── Heady API:    heady-manager on :3300                 ║
║                                                            ║
║  DESKTOP (Linux)                                           ║
║  ├── HeadyBrowser: Tauri AppImage                         ║
║  ├── HeadyBuddy:   systemd user service + Electron        ║
║  ├── HeadyIDE:     code-server on :8443                   ║
║  └── Heady API:    heady-manager via systemd              ║
║                                                            ║
║  PORTS                                                     ║
║  ├── 3300  heady-manager API                              ║
║  ├── 3400  HeadyBuddy widget dev                          ║
║  ├── 8022  SSH (Termux/phone)                             ║
║  ├── 8443  code-server (HeadyIDE)                         ║
║  └── 6080  Docker desktop (VNC, optional)                 ║
║                                                            ║
║  HOTKEYS                                                   ║
║  ├── Ctrl+Shift+H   Toggle HeadyBuddy (desktop)          ║
║  ├── Ctrl+Space      Quick Buddy query (planned)          ║
║  └── Ctrl+Shift+B    Toggle AI sidebar (browser)         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Appendix B: File Tree (Target State)

```
Heady/
├── headybrowser-mobile/          # React Native + GeckoView
│   ├── android/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TabBar.tsx
│   │   │   ├── AddressBar.tsx
│   │   │   ├── BrowserView.tsx
│   │   │   ├── AISidebar.tsx
│   │   │   └── SacredGeometryTheme.tsx
│   │   ├── services/
│   │   │   ├── AdBlocker.ts
│   │   │   ├── TabManager.ts
│   │   │   ├── SyncService.ts
│   │   │   └── HeadyAPI.ts
│   │   └── App.tsx
│   └── package.json
│
├── headybrowser-desktop/          # Tauri v2
│   ├── src/                       # React frontend
│   ├── src-tauri/                 # Rust backend
│   │   ├── src/
│   │   │   ├── main.rs
│   │   │   ├── tabs.rs
│   │   │   ├── adblock.rs
│   │   │   └── sync.rs
│   │   └── Cargo.toml
│   └── package.json
│
├── headybuddy-mobile/             # Android native service
│   ├── app/
│   │   └── src/main/
│   │       ├── java/.../
│   │       │   ├── HeadyBuddyService.kt
│   │       │   ├── BootReceiver.kt
│   │       │   ├── FloatingBubbleView.kt
│   │       │   ├── ChatActivity.kt
│   │       │   └── HeadyManagerClient.kt
│   │       ├── res/
│   │       └── AndroidManifest.xml
│   └── build.gradle
│
├── headybuddy/                    # Existing React widget (shared UI)
├── desktop-overlay/               # Existing Electron tray app
│
├── scripts/
│   ├── termux-bootstrap.sh        # Phone bootstrap
│   ├── setup-heady-ide.sh         # code-server setup
│   └── cross-platform-deploy.ps1  # Master deploy script
│
├── configs/
│   ├── heady-ide.yaml             # IDE configuration
│   ├── heady-browser.yaml         # Browser configuration
│   └── cross-device-sync.yaml     # Sync protocol config
│
└── docs/
    └── HEADY_CROSS_PLATFORM_PROTOCOL.md  # This document
```

---

*Built by HeadySystems. Sacred Geometry Architecture. Organic Systems. Breathing Interfaces.*
*Every device. Every platform. One Heady experience.*
