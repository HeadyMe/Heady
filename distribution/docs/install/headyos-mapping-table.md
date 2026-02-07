# HeadyOS Forms — Mapping Table

Complete mapping of every HeadyOS form to its install method, Docker profile, payment bundle, and deployment mode.

## HeadyOS Forms

| Form | Platform | Install Method | Docker Profile | Default Bundle | Deployment Modes |
|------|----------|---------------|----------------|----------------|-----------------|
| **HeadyOS Desktop** | Windows, macOS, Linux | `.exe` / `.dmg` / `.AppImage` installer | `full-suite` or `local-offline` | Pro Suite | Local, Hybrid, Cloud |
| **HeadyOS Browser Shell** | Windows, macOS, Linux | Standalone browser download | `browser-only` or `hybrid` | Pro Suite | Local, Hybrid, Cloud |
| **HeadyOS Web** | Any browser | No install — access via URL | `cloud-saas` or `hybrid` | Free / Personal | Hybrid, Cloud |
| **HeadyOS Mobile Shell** | Android, iOS | APK sideload / App Store | N/A (connects to API) | Pro Suite | Hybrid, Cloud |

## Browser Extensions

| Extension | Platform | Install Method | Bundle | Notes |
|-----------|----------|---------------|--------|-------|
| **Chrome** | Chrome, Chromium | Web Store or Load Unpacked | Free+ | Manifest V3 |
| **Firefox** | Firefox | Add-ons or Load Temporary | Free+ | WebExtensions |
| **Edge** | Edge | Edge Add-ons or Load Unpacked | Free+ | Manifest V3 (same as Chrome) |
| **Safari** | Safari (macOS/iOS) | Xcode build or App Store | Free+ | Swift wrapper |

## IDE Extensions

| Extension | Platform | Install Method | Bundle | Notes |
|-----------|----------|---------------|--------|-------|
| **VS Code** | VS Code, Codium | `.vsix` or Marketplace | Free+ | Chat + completions |
| **JetBrains** | IntelliJ, PyCharm, WebStorm, Rider, GoLand | `.zip` plugin or Marketplace | Pro+ | All JetBrains IDEs |
| **Neovim** | Neovim, Vim | Lua plugin / plugin manager | Free+ | LSP-style |
| **Sublime Text** | Sublime Text | Package Control | Pro+ | Via LSP |
| **Visual Studio** | Visual Studio | VSIX extension | Pro+ | .NET focus |
| **Xcode** | Xcode | Source Editor Extension | Pro+ | Swift/ObjC focus |

## Mobile Apps

| App | Platform | Install Method | Bundle | Description |
|-----|----------|---------------|--------|-------------|
| **Heady Chat** | Android, iOS | APK / App Store | Free+ | Conversational AI |
| **Heady Dev** | Android, iOS | APK / App Store | Dev Pack+ | Code assistant |
| **Heady Voice** | Android, iOS | APK / App Store | Creator Pack+ | Voice-first AI |
| **Heady Automations** | Android, iOS | APK / App Store | Automations Pack+ | Task automation |
| **HeadyOS Mobile** | Android, iOS | APK / App Store | Pro+ | Full OS shell |

## Docker Profiles

| Profile | Services Included | Use Case |
|---------|-------------------|----------|
| `local-offline` | API, Orchestrator, RAG, Model Runner, MCP | Air-gapped / privacy-first |
| `local-dev` | All + debug ports + hot-reload | Development |
| `hybrid` | API, Orchestrator, RAG, MCP + cloud model fallback | Best of both worlds |
| `cloud-saas` | API, Web, Orchestrator, RAG (cloud models) | Hosted SaaS |
| `api-only` | API, Orchestrator (no UI) | Headless / embedded |
| `full-suite` | Everything | Kitchen sink |
| `browser-only` | API + HeadyOS Browser | Minimal browser experience |
| `dev-tools` | API + IDE backends + MCP | Developer-focused |
| `minimal` | API only | Absolute minimum |
| `voice-enabled` | API + Voice IO + STT/TTS | Voice-first |

## Payment Bundles

| Bundle | Price | Apps Included | Tier |
|--------|-------|---------------|------|
| **Free** | $0 | Browser ext + Web chat | Free |
| **Personal Suite** | $5/mo | Browser + Mobile + Web + CLI | Personal |
| **Pro Suite** | $12/mo | Everything | Pro |
| **Dev Pack** | $12/mo | Browser + IDE + Mobile Dev + API | Pro |
| **Creator Pack** | $15/mo | Browser + Voice + Desktop + Automations | Pro |
| **Automations Pack** | $12/mo | Browser + Automations + API + MCP | Pro |
| **Enterprise Suite** | Custom | Everything + SSO + SLA + On-Prem | Enterprise |

## Deployment Modes

| Mode | Internet Required | Model Source | Suitable Bundles |
|------|-------------------|-------------|-----------------|
| **Local Only** | No | Ollama / Docker Model Runner | Personal, Pro, Dev |
| **Hybrid** | Yes (fallback) | Local preferred, cloud when needed | All |
| **Cloud Only** | Yes | Cloud APIs (OpenAI, Anthropic, etc.) | Personal, Pro, Enterprise |
| **Self-Hosted** | No | Your servers | Enterprise |
| **Air-Gapped** | No | Pre-loaded models | Enterprise |

---

*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
