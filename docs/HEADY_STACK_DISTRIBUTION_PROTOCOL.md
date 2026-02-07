# HeadyStack Distribution Protocol — Master Build & Distribution Blueprint

> **Status:** Active | **Type:** Architecture + Distribution Protocol | **Owner:** system
> **Source of Truth:** `docs/HEADY_STACK_DISTRIBUTION_PROTOCOL.md`
> **Version:** 1.0.0 | **Last Updated:** 2026-02-06
> **Goal:** Ship HeadyOS as a ready-to-sell, ready-to-integrate product line — every browser, every IDE, every payment scheme, every Docker combo, every MCP config, every HeadyOS form — in one distribution pack.

---

## Table of Contents

1. [Vision & Core Principles](#1-vision--core-principles)
2. [Mono-Repo Layout (HeadyStack)](#2-mono-repo-layout-headystack)
3. [Orchestration & Intelligence Layer](#3-orchestration--intelligence-layer)
4. [RAG & Knowledge Layer](#4-rag--knowledge-layer)
5. [Hybrid Local + Cloud Models](#5-hybrid-local--cloud-models)
6. [Voice, Voices & Multi-Modal](#6-voice-voices--multi-modal)
7. [Multi-Agent & Plugin Hybrid](#7-multi-agent--plugin-hybrid)
8. [Docker & Container Strategy](#8-docker--container-strategy)
9. [HeadyOS Forms (All Runtimes)](#9-headyos-forms-all-runtimes)
10. [Browser Extensions (All Browsers)](#10-browser-extensions-all-browsers)
11. [IDE Extensions (All IDEs)](#11-ide-extensions-all-ides)
12. [MCP Server & Tool Bridge](#12-mcp-server--tool-bridge)
13. [Website & Web App](#13-website--web-app)
14. [Payment Schemes & Billing](#14-payment-schemes--billing)
15. [Distribution Pack (Master Layout)](#15-distribution-pack-master-layout)
16. [App Bundles & Combos](#16-app-bundles--combos)
17. [Every Docker Container Combination](#17-every-docker-container-combination)
18. [Every Connection Method](#18-every-connection-method)
19. [E:\ Drive Mirror (Phone + Portable)](#19-e-drive-mirror-phone--portable)
20. [Localization & Multi-Tenant](#20-localization--multi-tenant)
21. [Safety, Governance & Social Impact](#21-safety-governance--social-impact)
22. [Popular Features Baked In](#22-popular-features-baked-in)
23. [90-Day Implementation Plan](#23-90-day-implementation-plan)
24. [Error Elimination & Testing](#24-error-elimination--testing)
25. [Registry Integration](#25-registry-integration)

---

## 1. Vision & Core Principles

### North Star

HeadyStack is a composable, private-first, model-agnostic AI platform that ships as one mono-repo and one distribution pack. Every way to use the system — browser, mobile, desktop, IDE, CLI, API, automation, MCP — is pre-built and payment-ready.

### Core Principles

| Principle | Meaning |
|---|---|
| **Private-first** | All user data processed locally by default; opt-in cloud sync |
| **Model-agnostic** | Support closed APIs (OpenAI, Anthropic) + local models (Ollama, Docker Model Runner, vLLM) |
| **Agentic & tool-rich** | Built-in RAG, tool use, agents, MCP integration |
| **Omnichannel** | One brain, many clients: desktop, web, mobile, CLI, API, automations |
| **Extensible** | Plugin system + MCP tool support for 3rd-party "skills" |
| **Payment-ready** | Every distribution variant ships with billing configs and payment rails |
| **Social impact** | Defaults that nudge toward wealth redistribution, co-ops, open-source, donations |

### Composable Spine Design

Three layers that can mix local + cloud, built-in + pluggable:

```
┌─────────────────────────────────────────────────────────────────┐
│  EXPERIENCE LAYER                                               │
│  HeadyOS Desktop · Web · Mobile · Browser · CLI · Automations   │
│  All use same "session + agent + tools" schema                  │
├─────────────────────────────────────────────────────────────────┤
│  IO LAYER                                                       │
│  RAG · Connectors (Slack, Notion, GitHub) · MCP Servers         │
│  Voice IO (STT/TTS, local + cloud) · File System · Calendar     │
├─────────────────────────────────────────────────────────────────┤
│  INTELLIGENCE CORE                                              │
│  Orchestrator (LangChain/Haystack/LlamaIndex)                   │
│  Multi-Agent · Model Router · Policy Brain · Safety Layer        │
└─────────────────────────────────────────────────────────────────┘
```

**Core design rule:** Any feature (voice, calendar, GitHub, search) is "just another tool" that any agent can request — not a special path.

---

## 2. Mono-Repo Layout (HeadyStack)

```
headystack/
  apps/
    heady-api/              # HTTP/WS API gateway
    heady-orchestrator/     # Agent logic, workflows (LangChain/Haystack)
    heady-rag/              # RAG pipelines, vector DB adapters
    heady-desktop/          # HeadyOS desktop client (Tauri)
    heady-web/              # Web client (Next.js)
    heady-mobile/           # React Native / Flutter
    heady-cli/              # CLI interface
    heady-browser/          # Chromium-based Heady Browser
  services/
    auth-service/
    user-profile-service/
    billing-service/        # Stripe + PayPal + usage metering
    telemetry-service/
    mcp-gateway/            # Model Context Protocol bridge
    tool-bridge/            # System tools: file system, shell, browser, calendar
    model-router/           # Local vs cloud model selection
    voice-io/               # STT/TTS engine abstraction
  models/
    openai-provider/
    anthropic-provider/
    local-model-runner/     # Docker Model Runner / Ollama / vLLM
    embeddings-service/
  infra/
    docker/
      docker-compose.base.yml
      profiles/
        local-offline.yml
        local-dev.yml
        hybrid.yml
        cloud-saas.yml
        api-only.yml
        full-suite.yml
    k8s/
    terraform/
  packages/
    core-sdk/               # Shared types, client SDKs
    ui-kit/                 # React components, Sacred Geometry design system
    prompts/                # System prompts, safety prompts, personas
    agents/                 # Predefined agents (researcher, grant writer, etc.)
    connectors/             # Slack, Google Drive, Notion, etc.
    voice-packs/            # TTS voice definitions and configs
  distribution/             # ← THE DISTRIBUTION PACK (see Section 15)
  docs/
    architecture/
    dev-setup/
    contributing/
    localization/
  .github/
    workflows/
  scripts/
    bootstrap.sh
    dev.sh
    generate-locales.ts
```

---

## 3. Orchestration & Intelligence Layer

### Framework Choice

| Option | Best For | Recommendation |
|---|---|---|
| **LangChain** | Flexible agent/tool workflows, multi-step reasoning | **Primary** |
| **Haystack** | Search-heavy pipelines, production RAG | RAG layer |
| **LlamaIndex** | Data indexing, structured querying | Data connector |

### Agent Catalog

```yaml
# packages/agents/catalog.yaml
agents:
  coordinator:
    role: "Reads user request, decides which specialists and tools to call"
    model: auto  # Model Router picks best model
    tools: [all]

  researcher:
    role: "Deep web search, paper analysis, fact-checking"
    tools: [duckduckgo, arxiv, wikipedia, rag]

  grant-writer:
    role: "Draft grants, proposals, budgets"
    tools: [rag, file-system, templates]

  bd-agent:
    role: "Business development, partnership analysis, outreach drafts"
    tools: [email, crm, calendar, rag]

  coding-agent:
    role: "Code generation, refactoring, debugging, test writing"
    tools: [file-system, terminal, github, rag]

  os-automation:
    role: "System tasks, file management, app launching"
    tools: [file-system, terminal, calendar, notifications]

  summarizer:
    role: "Summarize pages, documents, emails, conversations"
    tools: [rag]

  ethics-checker:
    role: "Review outputs for bias, fairness, social impact alignment"
    tools: [rag, policy-db]

  voice-companion:
    role: "Real-time voice conversations, coaching, interactive sessions"
    tools: [voice-io, calendar, rag]

  wellbeing-coach:
    role: "Daily check-ins, energy tracking, mental health hygiene (not therapy)"
    tools: [memory, calendar]

  wealth-redistribution:
    role: "Budget analysis, donation planning, co-op opportunities, community projects"
    tools: [rag, billing, calculator]

  teaching-mentor:
    role: "'Explain what I just did' mode — records steps, builds docs/tutorials"
    tools: [file-system, rag, screen-capture]
```

---

## 4. RAG & Knowledge Layer

### Vector Store Adapters

- **Postgres/pgvector** — Default, ships with Docker Compose
- **Milvus** — High-scale production
- **Weaviate** — Multi-modal
- **Qdrant** — Fast filtering

### Connectors (via `packages/connectors/`)

| Source | Connector | Status |
|---|---|---|
| Files (PDF, DOCX, MD, code) | Local file ingestion | P0 |
| GitHub repos | GitHub API + MCP | P0 |
| Slack | Slack API + MCP | P1 |
| Notion / Obsidian | Notion API + local files | P1 |
| Google Drive | Drive API | P1 |
| Email (IMAP/SMTP) | Email connector | P2 |
| CRM | Salesforce / HubSpot | P2 |

### Workspace Profiles

- **Personal workspace** — Your data, your models
- **Team workspace** — HeadyConnection / HeadySystems shared knowledge
- **Public impact workspace** — Curated content on wealth redistribution, co-ops, social impact

---

## 5. Hybrid Local + Cloud Models

### Model Router Service

```
┌─────────────────────────────────────────────────┐
│  MODEL ROUTER (services/model-router/)           │
│                                                  │
│  Input: task + context + privacy flags           │
│                                                  │
│  Decision matrix:                                │
│  ┌──────────────┬──────────────┬──────────────┐ │
│  │ Privacy=HIGH  │ Use LOCAL    │ Ollama/vLLM  │ │
│  │ Task=CODE     │ Prefer CODE  │ Codellama    │ │
│  │ Task=VOICE    │ Low latency  │ Cloud TTS    │ │
│  │ Task=RESEARCH │ Cloud OK     │ GPT-4o/Claude│ │
│  │ Offline       │ LOCAL ONLY   │ Ollama       │ │
│  │ Cost-sensitive│ LOCAL first  │ Llama 3.2    │ │
│  └──────────────┴──────────────┴──────────────┘ │
│                                                  │
│  Per-workspace policy override:                  │
│  "Nonprofit workspace = prefer local,            │
│   allow cloud only for large research tasks"     │
└─────────────────────────────────────────────────┘
```

### Supported Providers

| Provider | Type | Integration |
|---|---|---|
| **Ollama** | Local | OpenAI-compatible API on localhost:11434 |
| **Docker Model Runner** | Local | Docker-native GPU inference |
| **vLLM** | Local/Cloud | High-throughput serving |
| **OpenAI** | Cloud | GPT-4o, GPT-4o-mini |
| **Anthropic** | Cloud | Claude 3.5 Sonnet, Haiku |
| **Google** | Cloud | Gemini Pro |
| **Groq** | Cloud | Ultra-fast inference |
| **Local GGUF** | Local | llama.cpp direct |

---

## 6. Voice, Voices & Multi-Modal

### STT (Speech-to-Text)

| Engine | Type | Best For |
|---|---|---|
| **Whisper (local)** | Local | Privacy, offline |
| **Vosk** | Local | Lightweight, low-resource |
| **Google STT** | Cloud | High accuracy |
| **Azure Speech** | Cloud | Real-time, enterprise |

### TTS (Text-to-Speech)

| Engine | Type | Best For |
|---|---|---|
| **Coqui XTTS-v2** | Local/Open | Voice cloning, multi-language |
| **OpenVoice v2** | Local/Open | Accent/style transfer |
| **Mozilla TTS** | Local/Open | Wide language coverage |
| **Mimic3** | Local/Open | Lightweight |
| **eSpeak** | Local/Open | Ultra-lightweight, max languages |
| **ElevenLabs** | Cloud/Premium | Best quality, voice cloning |
| **Google TTS** | Cloud | Natural, many languages |
| **Amazon Polly** | Cloud | Neural voices, SSML |
| **Azure Neural TTS** | Cloud | Emotional styles |

### Voice Marketplace UX

In HeadyOS settings:
- **Voice packs:** Calm, Excited, Professional, Playful, Gender-diverse, Accent-diverse
- **Sliders:** Speed, Pitch, Emotionality
- **Low-latency streaming** with barge-in (interrupt mid-sentence)
- **Per-agent voice:** Researcher speaks formally; Buddy speaks casually

### Multi-Modal

- **Screenshots/image input** → Vision models (GPT-4o vision, local LLaVA)
- **File upload** → Document parsing + RAG
- **Camera streams** → With explicit permissions only
- **Screen region understanding** → Desktop screenshot analysis

---

## 7. Multi-Agent & Plugin Hybrid

### Agent Roles

| Role | Description |
|---|---|
| **Coordinator** | Reads user request, dispatches to specialists |
| **Specialists** | Researcher, BD, Grant Writer, Coder, OS Automation, Summarizer |
| **Voice Agents** | Real-time phone/voice style for calls, coaching, interactive sessions |
| **Ethics Checker** | Reviews outputs for bias, fairness, social impact |
| **Wellbeing Coach** | Soft daily prompts, energy tracking |

### MCP Tool Set (Starter)

| Tool | MCP Server | Priority |
|---|---|---|
| GitHub | `mcp-server-github` | P0 |
| Slack | `mcp-server-slack` | P0 |
| DuckDuckGo | `mcp-server-ddg` | P0 |
| Notion/Obsidian | `mcp-server-notion` | P1 |
| Google Drive | `mcp-server-drive` | P1 |
| Docker | `mcp-server-docker` | P1 |
| Calendar | `mcp-server-calendar` | P1 |
| File System | `mcp-server-filesystem` | P0 |
| Terminal | `mcp-server-terminal` | P0 |
| Browser Control | `mcp-server-browser` | P1 |

Enable/disable per workspace and per agent. Some orgs may want only internal tools.

---

## 8. Docker & Container Strategy

### Core Containers

| Container | Service | Port |
|---|---|---|
| `heady-api` | HTTP/WS API gateway | 8080 |
| `heady-orchestrator` | LangChain/Haystack workflows | 8081 |
| `heady-rag` | Indexing and retrieval | 9000 |
| `model-runner` | Local LLMs (Ollama/vLLM) | 11434 |
| `mcp-gateway` | MCP tool bridge | 8082 |
| `tool-bridge` | System access (shell, fs) | 8083 |
| `voice-io` | STT/TTS engine | 8084 |
| `billing-service` | Stripe/metering | 8085 |
| `heady-web` | Web app (Next.js) | 3000 |
| `heady-browser` | Chromium-based browser | — |
| `postgres` | Database + pgvector | 5432 |
| `redis` | Cache + pub/sub | 6379 |

### Docker Compose Profiles

See Section 17 for all combinations.

---

## 9. HeadyOS Forms (All Runtimes)

Every HeadyOS form talks to the same backend. They're different "skins/runtimes."

| Form | Tech | Description |
|---|---|---|
| **HeadyOS Desktop** | Tauri 2.0 (Rust + React) | Full desktop shell with overlay, side panel, system integrations |
| **HeadyOS Browser** | Chromium + Heady UI | Browser with HeadyOS as home/side panel — "browser OS" feel |
| **HeadyOS Web** | Next.js | Full OS-like web UI (windowed panels, apps, settings) |
| **HeadyOS Mobile Shell** | React Native / Flutter | Mobile app mimicking desktop OS experience |
| **HeadyOS CLI** | Node.js / Rust | Terminal-based assistant |
| **HeadyOS Embedded** | Yocto / Buildroot | IoT/kiosk HeadyOS for embedded devices |

### Desktop UX Pillars

- **Always-available assistant:** System-wide hotkey (Ctrl+Space), floating "Heady orb"
- **Multi-modal:** Voice + TTS, screenshot understanding, interruptible speech
- **Workspaces:** Chat, Project (threads grouped), Automations (scheduled tasks)
- **Tools panel:** Toggle system tools with granular permissions
- **Local dock:** Pinned agents, quick actions (Summarize PDF, Plan Sprint, Draft Grant)

### Desktop Modes

| Mode | Behavior |
|---|---|
| **Silent co-pilot** | Text only |
| **Talkative companion** | TTS + small avatar |
| **Heads-down work** | Only background automations |

---

## 10. Browser Extensions (All Browsers)

### Tech Stack

- **Standard:** WebExtensions (Manifest V3 for Chromium)
- **Framework:** WXT or Plasmo for cross-browser abstraction
- **UI:** React + Tailwind (shared with HeadyOS)

### Target Browsers

| Browser | Store | Manifest | Status |
|---|---|---|---|
| **Chrome** | Chrome Web Store | Manifest V3 | P0 |
| **Edge** | Edge Add-ons | Manifest V3 | P0 (same build as Chrome) |
| **Firefox** | Firefox Add-ons (AMO) | Manifest V3 (Firefox flavor) | P0 |
| **Safari** | Safari Extension Gallery | Safari Web Extension | P1 |
| **Brave** | Chrome Web Store | Manifest V3 | P0 (same as Chrome) |
| **Opera** | Opera Addons | Manifest V3 | P1 |
| **Vivaldi** | Chrome Web Store | Manifest V3 | P0 (same as Chrome) |
| **Arc** | Chrome Web Store | Manifest V3 | P0 (same as Chrome) |

### Extension Features

| Feature | Description |
|---|---|
| **Sidebar chat** | Chat with HeadyOS, context injected from current tab |
| **Page actions** | Summarize page, highlight + "Ask Heady," auto-draft responses, translate |
| **Tab management** | AI-powered tab grouping, deduplication, "focus this topic" |
| **Reading mode** | Distraction-free reading with AI annotations |
| **Form auto-fill** | AI-assisted form completion |
| **Agent mode** | Multi-step task execution with user approvals |
| **Auth** | Same token/session as main HeadyOS app |
| **Settings** | Select workspace, agent persona, page-read permissions |

### Extension Project Structure

```
distribution/browser/extensions/
  shared/                  # Shared extension code
    src/
      background.ts        # Service worker
      content.ts           # Content script
      sidepanel/           # Side panel React app
        App.tsx
        components/
      popup/               # Popup React app
      options/             # Options page
    manifest.base.json     # Base manifest
  chrome/
    manifest.json          # Chrome-specific overrides
    build.sh
  firefox/
    manifest.json          # Firefox-specific
    build.sh
  safari/
    xcode-project/         # Safari requires Xcode wrapper
    build.sh
  edge/                    # Uses Chrome build
  build-all.sh             # Build for all browsers
```

---

## 11. IDE Extensions (All IDEs)

### Target IDEs

| IDE | Extension Format | Language | Status |
|---|---|---|---|
| **VS Code / Codium** | .vsix | TypeScript | P0 |
| **JetBrains** (IntelliJ, PyCharm, WebStorm, etc.) | .zip plugin | Kotlin/Java | P1 |
| **Neovim** | Lua plugin | Lua | P1 |
| **Vim** | Vimscript/Lua | Vimscript | P2 |
| **Visual Studio** | .vsix | C# | P2 |
| **Xcode** | Source Editor Extension | Swift | P3 |
| **Sublime Text** | Python plugin | Python | P2 |
| **Emacs** | Elisp package | Elisp | P3 |

### Common IDE Extension Features

| Feature | Description |
|---|---|
| **Inline completions** | AI-powered code suggestions |
| **Chat panel** | Sidebar chat with codebase awareness + RAG |
| **Explain code** | Select code → "Explain this" |
| **Refactor** | AI-suggested refactoring |
| **Write tests** | Generate tests for selected function/file |
| **Generate docs** | Auto-generate docstrings/comments |
| **Task mode** | "Implement feature X" with multi-file edits |
| **Terminal integration** | AI-assisted terminal commands |
| **Project RAG** | Index entire project for context-aware responses |
| **Auth** | Same OAuth/token as HeadyOS |

### VS Code Extension Structure

```
distribution/ide/vscode/
  src/
    extension.ts           # Entry point
    chat/
      chatProvider.ts      # Chat panel provider
      chatView.ts          # Webview UI
    completion/
      completionProvider.ts # Inline completion
    commands/
      explain.ts
      refactor.ts
      writeTests.ts
      generateDocs.ts
    auth/
      authManager.ts
    api/
      headyClient.ts       # Calls Heady API
  package.json             # Extension manifest
  tsconfig.json
  build.sh
```

---

## 12. MCP Server & Tool Bridge

### MCP Server Architecture

```
services/mcp-gateway/
  src/
    server.ts              # MCP server entry
    tools/
      github.ts
      slack.ts
      notion.ts
      drive.ts
      docker.ts
      calendar.ts
      filesystem.ts
      terminal.ts
      browser.ts
      duckduckgo.ts
    config/
      default-mcp.yaml
      enterprise-mcp.yaml
  package.json
```

### MCP Config (Default)

```yaml
# distribution/mcp/configs/default-mcp.yaml
version: "1.0"
servers:
  filesystem:
    enabled: true
    scope: ["$HOME/Documents", "$HOME/Projects"]
    permissions: [read, write, create]

  terminal:
    enabled: true
    allowedCommands: [git, npm, node, python, docker]
    requireApproval: true

  github:
    enabled: true
    auth: oauth
    scopes: [repo, read:org]

  duckduckgo:
    enabled: true
    maxResults: 10

  slack:
    enabled: false  # Enable per workspace
    auth: oauth

  notion:
    enabled: false
    auth: token

  docker:
    enabled: true
    allowedActions: [list, logs, start, stop]
    requireApproval: true

  calendar:
    enabled: false
    provider: google  # or outlook
    auth: oauth

  browser:
    enabled: true
    headless: true
    maxPages: 5
```

---

## 13. Website & Web App

### Public Marketing Site

| Page | Content |
|---|---|
| **Home** | Hero, value prop, social impact mission |
| **Products** | HeadyOS Desktop, Web, Mobile, Browser, CLI |
| **Pricing** | Plans, bundles, fair access programs |
| **Developers** | API docs, SDK downloads, MCP docs |
| **Extensions** | Browser + IDE extension downloads |
| **Partners** | White-label portal, distribution pack info |
| **About** | Mission, team, HeadyConnection + HeadySystems |
| **Impact** | Social impact metrics, donation flows, co-op partnerships |

### Web App Features

| Feature | Description |
|---|---|
| **Chat** | Full Buddy chat with agent selection |
| **Projects** | Threaded conversations grouped by project |
| **Automations** | Scheduled tasks, triggers, Kanban view |
| **Memory** | View, pin, forget, export |
| **Billing** | Upgrade, usage dashboard, payment methods |
| **Settings** | Workspace, agents, tools, voices, permissions |
| **Developer Portal** | API keys, plugin registration, revenue-share dashboard |

---

## 14. Payment Schemes & Billing

### All Pricing Models

| Model | Description | Config Key |
|---|---|---|
| **Flat subscription** | Fixed monthly/yearly | `subscription.flat` |
| **Tiered subscription** | Good/Better/Best with feature gates | `subscription.tiered` |
| **Usage-based (PAYG)** | Credits for tokens, voice minutes, API calls | `usage.payg` |
| **Freemium** | Free tier + paid upgrades | `freemium` |
| **Free trial** | 7–14 day full access, then fallback | `trial` |
| **Reverse trial** | Full access by default, then show what you'd lose | `trial.reverse` |
| **Per-seat** | Per-user for teams | `seat` |
| **Per-workspace** | Per-org quotas | `workspace` |
| **API monetization** | Rate-limited free + paid tiers | `api` |
| **Revenue share** | 3rd-party plugins/agents earn % | `marketplace.revshare` |
| **Lifetime deal** | One-time payment, perpetual access | `lifetime` |
| **Donate-what-you-can** | Sliding scale for nonprofits/students | `social.sliding` |
| **Sponsored seats** | Corporate sponsors pay for community seats | `social.sponsored` |
| **PPP pricing** | Purchasing Power Parity discounts | `social.ppp` |

### Payment Rails

| Gateway | Integration | Priority |
|---|---|---|
| **Stripe** | Primary — subscriptions, usage, invoicing | P0 |
| **PayPal** | Secondary — one-time, international | P1 |
| **Apple Pay** | Mobile + web | P1 |
| **Google Pay** | Mobile + web | P1 |
| **Bank transfer** | Enterprise / invoicing | P2 |
| **Crypto** | Optional — Bitcoin, USDC | P3 |

### Billing Service Architecture

```
services/billing-service/
  src/
    plans.ts               # Plan definitions loader
    metering.ts            # Usage tracking (tokens, calls, minutes)
    stripe.ts              # Stripe integration
    paypal.ts              # PayPal integration
    invoicing.ts           # Invoice generation
    webhooks.ts            # Payment event handlers
    checkout.ts            # Checkout session creation
    marketplace.ts         # Revenue-share for plugins
  config/
    plans.yaml
    usage-metrics.yaml
    app-combos.yaml
    revenue-share.yaml
```

---

## 15. Distribution Pack (Master Layout)

```
distribution/
├── headyos/
│   ├── desktop/
│   │   ├── windows/           # .exe installer
│   │   ├── mac/               # .dmg installer
│   │   └── linux/             # .AppImage, .deb, .rpm
│   ├── browser-shell/
│   │   ├── local/             # Chromium + Heady, local models
│   │   ├── hybrid/            # Chromium + Heady, local+cloud
│   │   └── cloud/             # Chromium + Heady, cloud only
│   ├── web-shell/
│   │   └── deploy/            # Next.js build + deployment configs
│   ├── mobile-shell/
│   │   ├── android/
│   │   │   └── headyos-mobile.apk
│   │   └── ios/               # TestFlight profile + manifest
│   ├── cli/
│   │   └── heady-cli          # Binary / npm package
│   └── embedded/
│       └── yocto-image/       # HeadyOS embedded build
│
├── browser/
│   ├── heady-browser-local/   # Full browser, local AI
│   ├── heady-browser-hybrid/  # Full browser, hybrid AI
│   ├── heady-browser-cloud/   # Full browser, cloud AI
│   └── extensions/
│       ├── chrome/            # .crx / .zip
│       ├── firefox/           # .xpi
│       ├── edge/              # .crx (same as Chrome)
│       ├── safari/            # .app extension
│       ├── brave/             # Uses Chrome build
│       ├── opera/             # Uses Chrome build
│       ├── vivaldi/           # Uses Chrome build
│       ├── arc/               # Uses Chrome build
│       └── build-all.sh
│
├── mobile/
│   └── android/
│       ├── apks/
│       │   ├── heady-chat.apk
│       │   ├── heady-dev.apk
│       │   ├── heady-voice.apk
│       │   ├── heady-automations.apk
│       │   ├── heady-browser.apk
│       │   └── headyos-mobile.apk
│       └── install-all-android.sh
│
├── ide/
│   ├── vscode/                # .vsix
│   ├── jetbrains/             # .zip plugin
│   ├── neovim/                # Lua plugin files
│   ├── vim/                   # Vimscript plugin
│   ├── visual-studio/         # .vsix
│   ├── sublime/               # Python plugin
│   ├── xcode/                 # Source editor extension
│   ├── emacs/                 # Elisp package
│   └── install-ide-extensions.md
│
├── mcp/
│   ├── servers/
│   │   ├── github/
│   │   ├── slack/
│   │   ├── notion/
│   │   ├── drive/
│   │   ├── docker/
│   │   ├── calendar/
│   │   ├── filesystem/
│   │   ├── terminal/
│   │   ├── browser/
│   │   └── duckduckgo/
│   └── configs/
│       ├── default-mcp.yaml
│       ├── enterprise-mcp.yaml
│       └── minimal-mcp.yaml
│
├── docker/
│   ├── docker-compose.base.yml
│   └── profiles/
│       ├── local-offline.yml
│       ├── local-dev.yml
│       ├── hybrid.yml
│       ├── cloud-saas.yml
│       ├── api-only.yml
│       ├── full-suite.yml
│       ├── browser-only.yml
│       ├── voice-enabled.yml
│       ├── dev-tools.yml
│       └── minimal.yml
│
├── bundles/
│   ├── personal-suite.yaml
│   ├── pro-suite.yaml
│   ├── dev-pack.yaml
│   ├── creator-pack.yaml
│   ├── automations-pack.yaml
│   ├── enterprise-suite.yaml
│   ├── social-impact-pack.yaml
│   └── browser-assistant-only.yaml
│
├── billing-config/
│   ├── plans.yaml
│   ├── usage-metrics.yaml
│   ├── app-combos.yaml
│   └── revenue-share.yaml
│
├── api-clients/
│   ├── javascript/            # npm package
│   ├── python/                # pip package
│   ├── go/                    # Go module
│   └── cli/                   # CLI binary
│
├── automations/
│   ├── zapier/                # Zapier integration configs
│   ├── n8n/                   # n8n workflow templates
│   ├── make/                  # Make.com scenarios
│   └── custom-webhooks/       # Webhook templates
│
├── connectors/
│   ├── slack-bot/
│   ├── discord-bot/
│   ├── teams-bot/
│   ├── email-agent/           # IMAP/SMTP
│   ├── calendar-agent/
│   ├── crm-connector/
│   └── document-stores/       # Drive, Dropbox, Notion
│
└── docs/
    ├── install/
    │   ├── quick-start.md
    │   ├── install-desktop.md
    │   ├── install-mobile-android.md
    │   ├── install-browser-extensions.md
    │   ├── install-ide-extensions.md
    │   ├── deploy-docker.md
    │   ├── deploy-kubernetes.md
    │   ├── deploy-cloud.md
    │   ├── setup-mcp.md
    │   └── setup-payments.md
    ├── admin/
    │   ├── billing-admin.md
    │   ├── user-management.md
    │   └── security-hardening.md
    └── developer/
        ├── api-reference.md
        ├── sdk-guide.md
        ├── plugin-development.md
        ├── mcp-tool-development.md
        └── white-label-guide.md
```

---

## 16. App Bundles & Combos

### Single-App SKUs

| SKU | App | Price (example) |
|---|---|---|
| `heady-browser-assistant` | Browser extension + AI sidebar | Free / $5/mo |
| `heady-mobile-chat` | Mobile chat app | Free / $5/mo |
| `heady-desktop-assistant` | Desktop tray + overlay | $10/mo |
| `heady-dev-extension` | VS Code / JetBrains plugin | $12/mo |
| `heady-voice` | Voice companion | $8/mo |
| `heady-automations` | Automation workflows | $10/mo |

### Bundle SKUs

| Bundle | Includes | Price (example) |
|---|---|---|
| **Personal** | Browser ext + Mobile chat | Free / $8/mo |
| **Creator** | Browser + Mobile + Voice + Desktop | $15/mo |
| **Dev** | Browser + IDE extensions + Mobile + CLI | $20/mo |
| **Pro** | Everything except enterprise features | $30/mo |
| **Enterprise** | Everything + admin + SSO + SLA + custom agents | Custom |
| **Social Impact** | Full suite, sliding scale / sponsored | $0–$15/mo |

### Browser + AI Assistant Modes in Bundles

| Mode | What Ships | Model Source |
|---|---|---|
| **Local** | Full browser + local Ollama | On-device only |
| **Hybrid** | Full browser + local + cloud fallback | Prefer local |
| **Cloud** | Thin browser ext + cloud API | Cloud only |

Each bundle YAML specifies which apps, modes, and features are included.

---

## 17. Every Docker Container Combination

### Docker Compose Profiles

| Profile | Containers | Use Case |
|---|---|---|
| `local-offline` | api, orchestrator, rag, model-runner, postgres | Fully offline, privacy-max |
| `local-dev` | api, orchestrator, rag, model-runner, postgres, redis, mcp-gateway | Dev with all local services |
| `hybrid` | api, orchestrator, rag, postgres, redis, mcp-gateway | Local services + cloud models |
| `cloud-saas` | api, orchestrator, rag, web, billing, postgres, redis | Full SaaS deployment |
| `api-only` | api, orchestrator, rag, postgres | Headless API backend |
| `full-suite` | ALL containers | Everything running |
| `browser-only` | heady-browser, model-runner | Standalone AI browser |
| `voice-enabled` | api, orchestrator, voice-io, model-runner, postgres | Voice-first assistant |
| `dev-tools` | api, orchestrator, rag, mcp-gateway, tool-bridge, postgres | Developer-focused tools |
| `minimal` | api, model-runner | Bare minimum AI chat |

### Usage

```bash
# Fully offline
docker compose -f docker-compose.base.yml -f profiles/local-offline.yml up

# Hybrid (local + cloud)
docker compose -f docker-compose.base.yml -f profiles/hybrid.yml up

# Full SaaS
docker compose -f docker-compose.base.yml -f profiles/cloud-saas.yml up

# Everything
docker compose -f docker-compose.base.yml -f profiles/full-suite.yml up
```

---

## 18. Every Connection Method

### Complete Connection Matrix

| Method | Type | Where | Config Location |
|---|---|---|---|
| HeadyOS Desktop | Native app | Windows/Mac/Linux | `distribution/headyos/desktop/` |
| HeadyOS Browser Shell | Native browser | Windows/Mac/Linux | `distribution/headyos/browser-shell/` |
| HeadyOS Web | Web app | Any browser | `distribution/headyos/web-shell/` |
| HeadyOS Mobile | Native app | Android/iOS | `distribution/headyos/mobile-shell/` |
| HeadyOS CLI | Terminal | Any OS | `distribution/headyos/cli/` |
| HeadyOS Embedded | IoT/Kiosk | Yocto/Buildroot | `distribution/headyos/embedded/` |
| Chrome Extension | Browser ext | Chrome/Brave/Vivaldi/Arc | `distribution/browser/extensions/chrome/` |
| Firefox Extension | Browser ext | Firefox | `distribution/browser/extensions/firefox/` |
| Edge Extension | Browser ext | Edge | `distribution/browser/extensions/edge/` |
| Safari Extension | Browser ext | Safari | `distribution/browser/extensions/safari/` |
| VS Code Extension | IDE plugin | VS Code/Codium | `distribution/ide/vscode/` |
| JetBrains Plugin | IDE plugin | IntelliJ/PyCharm/etc. | `distribution/ide/jetbrains/` |
| Neovim Plugin | IDE plugin | Neovim | `distribution/ide/neovim/` |
| Vim Plugin | IDE plugin | Vim | `distribution/ide/vim/` |
| Visual Studio Ext | IDE plugin | Visual Studio | `distribution/ide/visual-studio/` |
| Sublime Plugin | IDE plugin | Sublime Text | `distribution/ide/sublime/` |
| Xcode Extension | IDE plugin | Xcode | `distribution/ide/xcode/` |
| Emacs Package | IDE plugin | Emacs | `distribution/ide/emacs/` |
| REST API | HTTP | Any client | `distribution/api-clients/` |
| WebSocket API | WS | Real-time clients | `distribution/api-clients/` |
| JavaScript SDK | npm | Node.js apps | `distribution/api-clients/javascript/` |
| Python SDK | pip | Python apps | `distribution/api-clients/python/` |
| Go SDK | module | Go apps | `distribution/api-clients/go/` |
| MCP Protocol | MCP | AI tools/IDEs | `distribution/mcp/` |
| Slack Bot | Bot | Slack workspaces | `distribution/connectors/slack-bot/` |
| Discord Bot | Bot | Discord servers | `distribution/connectors/discord-bot/` |
| MS Teams Bot | Bot | Teams orgs | `distribution/connectors/teams-bot/` |
| Email Agent | IMAP/SMTP | Any email | `distribution/connectors/email-agent/` |
| Calendar Agent | API | Google/Outlook | `distribution/connectors/calendar-agent/` |
| CRM Connector | API | Salesforce/HubSpot | `distribution/connectors/crm-connector/` |
| Document Stores | API | Drive/Dropbox/Notion | `distribution/connectors/document-stores/` |
| Zapier | Automation | Zapier workflows | `distribution/automations/zapier/` |
| n8n | Automation | n8n workflows | `distribution/automations/n8n/` |
| Make.com | Automation | Make scenarios | `distribution/automations/make/` |
| Custom Webhooks | HTTP | Any system | `distribution/automations/custom-webhooks/` |
| Docker (local) | Container | Any Docker host | `distribution/docker/` |
| Kubernetes | Orchestration | K8s clusters | HeadyConnectionKits/30-*/ |
| SSH (phone) | Terminal | Android/Termux | `scripts/phone-ssh-setup.sh` |
| Android APK | Sideload | Android | `distribution/mobile/android/apks/` |

---

## 19. E:\ Drive Mirror (Phone + Portable)

Mirror the distribution pack to `E:\` (OnePlus Open CrossDevice folder) for instant access from phone and portable use.

```
E:\
  HeadyStack/
    distribution/          # Full mirror of distribution/ folder
      headyos/
      browser/
      mobile/
      ide/
      mcp/
      docker/
      bundles/
      billing-config/
      api-clients/
      automations/
      connectors/
      docs/
    apks/                  # Symlink → distribution/mobile/android/apks/
    install/
      install-all-android.sh
      install-browser-extensions.md
      install-ide-extensions.md
      deploy-docker.md
      quick-start.md
    heady-config/          # Personal configs
      .env
      mcp-config.yaml
      workspace.yaml
    logs/
    notes/
```

### Sync Script

```powershell
# scripts/sync-to-e-drive.ps1
$Source = "C:\Users\erich\Heady\distribution"
$Dest = "E:\HeadyStack\distribution"
robocopy $Source $Dest /MIR /XD node_modules .git /XF *.log
Write-Host "Distribution pack synced to E:\ drive"
```

---

## 20. Localization & Multi-Tenant

### Localization

- Store UI strings in `packages/ui-kit/locales/`
- Use i18n libraries and `scripts/generate-locales.ts`
- Support mid-conversation language switching for voice

### Multi-Tenant

- `organization_id` and `workspace_id` in all API calls
- Separate HeadyConnection (nonprofit) and HeadySystems (C-Corp) orgs with shared but permissioned knowledge
- Per-org billing, per-org tool permissions, per-org model policies

---

## 21. Safety, Governance & Social Impact

### Safety Prompts

Stored in `packages/prompts/safety/`:
- Base safety system prompt
- Per-org override (stricter for kids, more open for research)
- Guardrails for tool use (require approval for destructive actions)

### Social Impact Defaults

| Feature | Behavior |
|---|---|
| **Tool recommendations** | Prefer open-source / cooperative platforms |
| **Equity planner agent** | Helps users set aside resources for social good |
| **Donation planner agent** | Analyzes budgets, suggests donation patterns |
| **Round-up donations** | "Round up invoice amounts to donate to HeadyConnection" |
| **Impact meter** | Track positive impact per session (carbon, donations, open-source contributions) |
| **Sponsored seats** | Corporate sponsors pay for community/student seats |
| **PPP pricing** | Automatic Purchasing Power Parity discounts |

### Governance

- Transparent logs of model calls per organization
- Opt-in sharing of anonymized insights with HeadyConnection for global happiness research
- Per-workspace model, tool, and data policies

---

## 22. Popular Features Baked In

| Feature | Description |
|---|---|
| **Rich long-term memory** | Explicit controls (pin, forget, anonymize) |
| **Omnichannel context** | Seamless across voice, chat, SMS, email, desktop |
| **Human handoff** | Route to human collaborator with AI-generated summary |
| **Multi-language** | STT/TTS with many languages, mid-conversation switching |
| **Multi-modal** | Image/file/screenshot/camera input |
| **Collaboration** | Shared project spaces, multiple humans + AI in one thread |
| **Context-aware panels** | Auto-summarize focused window (doc, web page, email) |
| **Automation board** | Kanban view for triggers, actions, agents, logs |
| **Trust & consent UI** | Clear toggles for file access, keyboard, MCP tools |
| **Teaching/mentorship** | "Explain what I just did" mode, auto-generate tutorials |
| **Happiness check-ins** | Soft daily prompts, wellbeing coach agent |
| **Cross-device clipboard** | Copy on phone → paste on desktop (encrypted) |
| **Screen region understanding** | Screenshot analysis via vision models |
| **Interruptible voice** | Barge-in support, low-latency streaming |

---

## 23. 90-Day Implementation Plan

### Days 1–14: Architecture & Repo

| Task | Priority |
|---|---|
| Initialize headystack mono-repo with folder structure | P0 |
| Add `packages/core-sdk`, `apps/heady-api`, `apps/heady-orchestrator` | P0 |
| Create `infra/docker/docker-compose.base.yml` + 3 profiles | P0 |
| Set up billing-service with Stripe integration | P0 |
| Create `distribution/` folder structure | P0 |

### Days 15–30: MVP Assistant

| Task | Priority |
|---|---|
| Integrate LangChain + OpenAI API | P0 |
| Add local model via Ollama container | P0 |
| Implement RAG against pgvector | P0 |
| Build Model Router service | P1 |
| Create 3 starter agents (researcher, coder, summarizer) | P1 |

### Days 31–60: HeadyOS v0

| Task | Priority |
|---|---|
| Build Tauri desktop client (chat, file upload, voice input) | P0 |
| Wire to local API from Docker Compose | P0 |
| Build Chrome + Firefox extensions (sidebar, page actions) | P0 |
| Build VS Code extension (chat, explain, refactor) | P0 |
| Create Android mobile chat app | P1 |

### Days 61–90: Distribution & Monetization

| Task | Priority |
|---|---|
| Implement all pricing models in billing-service | P0 |
| Create bundle definitions | P0 |
| Package desktop installers (Windows, Mac, Linux) | P0 |
| Publish browser extensions to stores | P0 |
| Publish VS Code extension to marketplace | P0 |
| Build marketing site + web app | P1 |
| Create distribution pack + mirror to E:\ | P1 |

---

## 24. Error Elimination & Testing

Per the **Iterative Rebuild Protocol** (`docs/ITERATIVE_REBUILD_PROTOCOL.md`):

- Every build cycle starts clean
- Test pyramid: unit → integration → E2E → property-based → regression
- Browser extension testing: automated tests against Chrome/Firefox/Edge
- IDE extension testing: VS Code Extension Test Runner
- API testing: Postman/Newman collections
- Docker testing: container health checks + integration tests
- Payment testing: Stripe test mode for all checkout flows

---

## 25. Registry Integration

All distribution components registered in `heady-registry.json`:

| Component ID | Type | Status |
|---|---|---|
| `headystack-distribution` | distribution-pack | planned |
| `headybrowser-mobile` | mobile-app | scaffold |
| `headybrowser-desktop` | desktop-app | scaffold |
| `headybuddy-mobile` | mobile-app | scaffold |
| `heady-ide` | web-ide | planned |
| `termux-bootstrap` | script | active |
| `billing-service` | service | planned |
| `model-router` | service | planned |
| `voice-io` | service | planned |
| `mcp-gateway` | service | planned |
| `browser-extensions` | extensions | planned |
| `ide-extensions` | extensions | planned |

---

## Revision History

| Date | Version | Change |
|---|---|---|
| 2026-02-06 | 1.0.0 | Initial protocol — all 25 sections |
