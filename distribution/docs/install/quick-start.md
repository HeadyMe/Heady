# Heady Quick Start Guide

Get Heady running on your devices in under 30 minutes.

## Choose Your Path

| Path | Time | What You Get |
|------|------|-------------|
| **[A] Browser Extension Only](#a-browser-extension-only)** | 5 min | AI sidebar in your browser |
| **[B] Full Local Stack](#b-full-local-stack)** | 20 min | Everything running locally via Docker |
| **[C] Android + Desktop](#c-android--desktop)** | 30 min | Phone + computer fully connected |

---

## A) Browser Extension Only

1. Open Chrome/Edge/Firefox
2. Load the extension:
   - **Chrome/Edge:** Go to `chrome://extensions`, enable Developer mode, click "Load unpacked", select `distribution/browser/extensions/chrome/`
   - **Firefox:** Go to `about:debugging`, click "Load Temporary Add-on", select `distribution/browser/extensions/firefox/manifest.json`
3. Click the Heady icon → Start chatting

## B) Full Local Stack

### Prerequisites
- Docker Desktop installed
- 8GB+ RAM recommended

### Steps

```bash
# 1. Clone or navigate to Heady
cd C:\Users\erich\Heady

# 2. Start the local offline stack
cd distribution/docker
docker compose -f base.yml -f profiles/local-offline.yml up -d

# 3. Pull a local model (first time only, ~4GB)
docker exec -it heady-model-runner ollama pull llama3.1:8b

# 4. Verify
curl http://localhost:3300/api/health
# Should return: {"ok":true}

# 5. Open HeadyOS Web
# Visit: http://localhost:3000
```

### Other Profiles

```bash
# Hybrid (local + cloud fallback)
docker compose -f base.yml -f profiles/hybrid.yml up -d

# Dev tools (API + RAG + MCP + IDE)
docker compose -f base.yml -f profiles/dev-tools.yml up -d

# Full suite (everything)
docker compose -f base.yml -f profiles/full-suite.yml up -d
```

## C) Android + Desktop

### On Your Computer (Windows)

```powershell
# 1. Start Heady locally (see Path B above)

# 2. Install Ollama for local AI
winget install Ollama.Ollama
ollama pull llama3.2

# 3. Start HeadyManager
cd C:\Users\erich\Heady
node heady-manager.js

# 4. Load browser extension (see Path A above)
```

### On Your Phone (Android / OnePlus Open)

```bash
# 1. Install Termux from F-Droid
# 2. In Termux, run the SSH setup script:
bash scripts/phone-ssh-setup.sh

# 3. From your computer, verify SSH:
ssh u0_aXXX@PHONE_IP -p 8022

# 4. Install Heady apps (when APKs are built):
cd distribution/mobile/android
bash install-all-android.sh
```

### Connect Phone ↔ Computer

```bash
# From phone, access computer's HeadyOS Web:
# Open browser → http://COMPUTER_IP:3000

# From computer, SSH into phone:
ssh u0_aXXX@PHONE_IP -p 8022

# From phone, access computer's IDE:
# Open browser → http://COMPUTER_IP:8443
```

---

## What's Next

- **[Install IDE Extensions](install-ide-extensions.md)** — VS Code, JetBrains, Neovim
- **[Install Browser Extensions](install-browser-extensions.md)** — All browsers
- **[Deploy Docker](deploy-docker.md)** — All Docker profiles explained
- **[Setup MCP](setup-mcp.md)** — Connect GitHub, Slack, Notion, etc.
- **[Setup Payments](setup-payments.md)** — Configure Stripe and billing

---
*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
