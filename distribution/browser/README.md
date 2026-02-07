# Heady Browser Extensions & AI Browser

Every browser touchpoint for the Heady ecosystem.

## Structure

| Folder | Description |
|--------|-------------|
| `heady-browser-local/` | Full Chromium browser with HeadyOS, local-only AI |
| `heady-browser-hybrid/` | Full Chromium browser, local + cloud |
| `heady-browser-cloud/` | Full Chromium browser, cloud-only |
| `extensions/chrome/` | Chrome Web Store extension (Manifest V3) |
| `extensions/edge/` | Microsoft Edge Add-ons extension |
| `extensions/firefox/` | Firefox Add-ons extension (WebExtensions) |
| `extensions/safari/` | Safari App Extension |
| `extensions/shared/` | Shared extension core (cross-browser) |

## Extension Features

- **AI Side Panel** — Chat with Heady in a persistent sidebar
- **Page Summarize** — One-click page summary
- **Highlight & Ask** — Select text, right-click, "Ask Heady"
- **Auto-Fill** — Smart form filling with agent approval
- **Tab Manager** — AI-powered tab grouping and cleanup
- **Translation** — Real-time page translation
- **Voice Input** — Speak to Heady from any tab
- **Context Injection** — Current page context sent to Heady for relevant answers

## Build

```bash
# Build all extensions from shared source
cd extensions/shared && npm install && npm run build:all

# Build individual
npm run build:chrome
npm run build:firefox
npm run build:edge
npm run build:safari
```

## Install

- **Chrome**: Load unpacked from `extensions/chrome/dist/` or install from Chrome Web Store
- **Edge**: Load unpacked from `extensions/edge/dist/` or install from Edge Add-ons
- **Firefox**: Load temporary from `extensions/firefox/dist/` or install from Firefox Add-ons
- **Safari**: Open Xcode project in `extensions/safari/` and enable in Safari preferences
