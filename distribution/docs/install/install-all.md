# Heady — Complete Installation Guide

Every way to install and use the Heady ecosystem.

---

## 1. Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/HeadySystems/Heady.git
cd Heady/distribution/docker

# Local offline (everything on-device, no cloud)
docker compose -f base.yml -f profiles/local-offline.yml up -d

# Hybrid (local + cloud fallback)
docker compose -f base.yml -f profiles/hybrid.yml up -d

# Full suite (everything enabled)
docker compose -f base.yml -f profiles/full-suite.yml up -d

# Dev mode (hot-reload, debug ports)
docker compose -f base.yml -f profiles/local-dev.yml up -d
```

All profiles: `local-offline`, `local-dev`, `hybrid`, `cloud-saas`, `api-only`, `full-suite`, `browser-only`, `dev-tools`, `minimal`, `voice-enabled`.

---

## 2. HeadyOS Desktop

| Platform | Install |
|----------|---------|
| **Windows** | Download `.exe` from releases, or `winget install HeadySystems.HeadyOS` |
| **macOS** | Download `.dmg` from releases, or `brew install --cask headyos` |
| **Linux** | Download `.AppImage`, `.deb`, or `.rpm` from releases |

Config: `distribution/headyos/desktop/config.yaml`

---

## 3. HeadyOS Browser Shell

Chromium-based browser with HeadyOS built in.

| Mode | Description |
|------|-------------|
| **Local** | All AI runs on-device |
| **Hybrid** | Local-first, cloud fallback |
| **Cloud** | Thin client, cloud processing |

Download from releases or build from `distribution/headyos/browser-shell/`.

---

## 4. HeadyOS Web

Access HeadyOS in any browser at your deployment URL:
- Local: `http://localhost:3300`
- Cloud: `https://app.headysystems.com`

No install needed.

---

## 5. HeadyOS Mobile

### Android
```bash
# Install all APKs via ADB
cd distribution/mobile/android
bash install-all-android.sh

# Or install individually
adb install heady-chat.apk
adb install heady-dev.apk
adb install heady-voice.apk
adb install headyos-mobile.apk
```

### iOS
Available via TestFlight (beta) or App Store (release).

---

## 6. Browser Extensions

### Chrome
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `distribution/browser/extensions/chrome/`

Or install from Chrome Web Store: search "Heady AI".

### Firefox
1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `distribution/browser/extensions/firefox/manifest.json`

Or install from Firefox Add-ons: search "Heady AI".

### Edge
1. Open `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `distribution/browser/extensions/edge/`

Or install from Edge Add-ons: search "Heady AI".

### Safari
See `distribution/browser/extensions/safari/README.md` for Xcode build instructions.

---

## 7. IDE Extensions

### VS Code / Codium
```bash
code --install-extension distribution/ide/vscode/heady-dev-companion.vsix
```
Or search "Heady Dev Companion" in VS Code Marketplace.

### JetBrains (IntelliJ, PyCharm, WebStorm, etc.)
1. Open Settings > Plugins > Install from Disk
2. Select `distribution/ide/jetbrains/heady-jetbrains-plugin.zip`

Or search "Heady AI" in JetBrains Marketplace.

### Neovim
```lua
-- Add to your init.lua or lazy.nvim config
{ "HeadySystems/heady.nvim", config = true }
```
Or copy `distribution/ide/neovim/lua/heady/` to your Neovim config.

### Sublime Text
See `distribution/ide/sublime/README.md`.

### Visual Studio
See `distribution/ide/visual-studio/README.md`.

### Xcode
See `distribution/ide/xcode/README.md`.

---

## 8. CLI

```bash
# Via npm
npm install -g @heady/cli

# Via pip
pip install heady-cli

# Configure
heady config set endpoint http://localhost:3300
heady config set api-key heady_...

# Use
heady chat "Hello Heady"
heady agent run researcher --task "Find AI grants"
```

---

## 9. API / SDK

### JavaScript/TypeScript
```bash
npm install @heady/sdk
```

### Python
```bash
pip install heady-sdk
```

See `distribution/api-clients/` for full SDK docs.

---

## 10. MCP Integration

Configure MCP tools in your agent config:
```yaml
# distribution/mcp/configs/default-mcp.yaml
servers:
  - github
  - slack
  - notion
  - drive
  - docker
  - calendar
  - filesystem
  - browser
  - email
  - database
```

---

## 11. Automations

| Platform | Setup |
|----------|-------|
| **Zapier** | Search "Heady AI" in Zapier app catalog |
| **n8n** | Install `@heady/n8n-nodes` community node |
| **Make** | Add "Heady AI" from Make app catalog |
| **Webhooks** | See `distribution/automations/webhooks/README.md` |

---

*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
