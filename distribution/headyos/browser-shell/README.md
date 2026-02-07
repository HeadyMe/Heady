# HeadyOS Browser Shell

Chromium-based browser with HeadyOS as the home/side panel — a "browser OS" experience.

## Variants

| Variant | Description | Network |
|---------|-------------|---------|
| `headyos-browser-local/` | All AI on-device via local models | Offline-capable |
| `headyos-browser-hybrid/` | Local preferred, cloud fallback | Mixed |
| `headyos-browser-cloud/` | Thin client, cloud processing | Online required |

## Features

- **AI Side Panel** — Persistent sidebar: summarize pages, compare products, auto-fill forms
- **Task Helper** — Agent mode for multi-step tasks with explicit approvals
- **Tab Intelligence** — Auto-group, summarize, and manage tabs
- **Page Actions** — Highlight text → Ask Heady, translate, extract data
- **Voice Control** — Hands-free browsing with STT/TTS
- **Privacy Dashboard** — See exactly what data stays local vs goes to cloud

## Build

```bash
cd headyos-browser-local && npm install && npm run build
cd headyos-browser-hybrid && npm install && npm run build
cd headyos-browser-cloud && npm install && npm run build
```

## Tech Stack

- Electron (Chromium) + React
- Side panel SPA connected to heady-api
- Prompt API integration for on-device inference (Chrome built-in AI)
