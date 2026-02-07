# Heady Distribution — Master Install Guide

**Every way to install and connect to the Heady ecosystem.**

---

## 1. Android (OnePlus Open / any Android)

### HeadyBuddy Mobile (Always-On Companion)
```bash
adb install distribution/mobile/android/apks/heady-buddy.apk
# Grant: Overlay, Notifications, Boot, Battery Optimization Exempt
```

### HeadyBrowser Mobile
```bash
adb install distribution/mobile/android/apks/heady-browser.apk
```

### HeadyOS Mobile Shell
```bash
adb install distribution/mobile/android/apks/headyos-mobile.apk
```

### All Android APKs at Once
```bash
cd distribution/mobile/android
bash install-all-android.sh
```

### Termux + SSH (Phone Server)
```bash
# In Termux on phone:
bash scripts/termux-bootstrap.sh
# From PC: ssh <user>@<phone-ip> -p 8022
```

---

## 2. Windows Desktop

### HeadyOS Desktop (Tauri)
```powershell
# Download and run installer
.\distribution\headyos\desktop\windows\headyos-desktop-setup.exe
```

### HeadyBuddy Desktop (Electron Overlay)
```powershell
cd desktop-overlay
npm install
npm run dev
# Or build: npm run build:win
```

### HeadyIDE (code-server)
```powershell
npm install -g code-server
code-server --bind-addr 0.0.0.0:8443
# Access at http://localhost:8443
```

### VS Code Extension
```powershell
code --install-extension distribution\ide\vscode\heady-dev-companion.vsix
```

---

## 3. Linux Desktop

### HeadyOS Desktop
```bash
chmod +x distribution/headyos/desktop/linux/headyos-desktop.AppImage
./distribution/headyos/desktop/linux/headyos-desktop.AppImage
```

### HeadyBuddy as systemd Service
```bash
# Create user service
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/heady-buddy.service << EOF
[Unit]
Description=HeadyBuddy Desktop Companion
After=graphical-session.target

[Service]
ExecStart=/usr/bin/node /path/to/desktop-overlay/main.js
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
EOF

systemctl --user enable --now heady-buddy
```

### HeadyIDE (code-server)
```bash
curl -fsSL https://code-server.dev/install.sh | sh
sudo systemctl enable --now code-server@$USER
# Access at http://localhost:8443
```

---

## 4. Browser Extensions

### Chrome / Edge
1. Go to `chrome://extensions/` (or `edge://extensions/`)
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select `distribution/browser/extensions/chrome/`

### Firefox
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `distribution/browser/extensions/firefox/manifest.json`

### Safari
1. Open Xcode
2. Build from `distribution/browser/extensions/safari/`
3. Enable in Safari → Preferences → Extensions

---

## 5. IDE Extensions

### VS Code / Codium
```bash
code --install-extension distribution/ide/vscode/heady-dev-companion.vsix
```

### JetBrains (IntelliJ, PyCharm, WebStorm, etc.)
1. Settings → Plugins → Install from Disk
2. Select `distribution/ide/jetbrains/heady-dev-companion.zip`

### Neovim
```lua
-- lazy.nvim
{ "HeadySystems/heady.nvim", config = function() require("heady").setup() end }

-- Or copy manually:
-- cp distribution/ide/neovim/heady.lua ~/.config/nvim/lua/heady.lua
```

---

## 6. Docker (Backend Services)

### Local Offline (everything on-device)
```bash
cd distribution/docker
docker compose -f base.yml -f profiles/local-offline.yml up -d
```

### Hybrid (local + cloud fallback)
```bash
docker compose -f base.yml -f profiles/hybrid.yml up -d
```

### Cloud SaaS
```bash
docker compose -f base.yml -f profiles/cloud-saas.yml up -d
```

### API Only (headless)
```bash
docker compose -f base.yml -f profiles/api-only.yml up -d
```

### Full Suite (everything)
```bash
docker compose -f base.yml -f profiles/full-suite.yml up -d
```

---

## 7. CLI

```bash
npm install -g @headysystems/heady-cli
heady chat "What's on my schedule today?"
heady health
heady config set api_url http://localhost:3300
```

---

## 8. API Clients

### JavaScript/TypeScript
```bash
npm install @headysystems/heady-sdk
```

### Python
```bash
pip install heady-sdk
```

---

## 9. Automation Connectors

### Zapier
- Use the Heady Zapier app from the Zapier marketplace
- Triggers: New message, Task completed, Agent finished
- Actions: Send message, Run agent, Create task

### n8n
- Install `n8n-nodes-heady` community node
- Configure with API URL + API key

### Webhooks
```bash
curl -X POST http://localhost:3300/api/webhook/inbound \
  -H "Content-Type: application/json" \
  -d '{"event": "message", "text": "Hello Heady"}'
```

---

## 10. MCP Tools

Configure in `distribution/mcp/configs/default-mcp.yaml`:
- GitHub, Slack, Notion, Google Drive, Docker, Calendar, Email, Browser, Filesystem, Web Search, Memory

---

## Port Reference

| Service | Port | Description |
|---------|------|-------------|
| heady-manager | 3300 | API Gateway |
| HeadyBuddy | 3400 | Buddy Widget |
| HeadyWeb | 3000 | Web Frontend |
| MCP Gateway | 4000 | MCP Tools |
| Billing | 3500 | Payment Service |
| Telemetry | 3600 | Monitoring |
| Voice IO | 3700 | STT/TTS |
| HeadyIDE | 8443 | code-server |
| SSH (Termux) | 8022 | Phone SSH |
| Ollama | 11434 | Local Models |
| Postgres | 5432 | Database |
| Redis | 6379 | Cache |

---

*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
