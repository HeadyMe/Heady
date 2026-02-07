# Heady Dev Companion — JetBrains Plugin

AI code assistant for IntelliJ IDEA, PyCharm, WebStorm, GoLand, Rider, and all JetBrains IDEs.

## Features

- **Chat sidebar** — Ask Heady about your code, get explanations, refactors
- **Inline completions** — AI-powered code suggestions as you type
- **Context-aware** — Reads open files, project structure, and selection
- **Generate tests** — Right-click → Heady → Generate Tests
- **Generate docs** — Right-click → Heady → Generate Documentation
- **Refactor** — Right-click → Heady → Refactor Selection

## Installation

### From JetBrains Marketplace
1. Open Settings → Plugins → Marketplace
2. Search "Heady Dev Companion"
3. Click Install

### From ZIP
1. Download `heady-dev-companion-jetbrains.zip`
2. Settings → Plugins → Install Plugin from Disk → Select ZIP

## Configuration

Settings → Tools → Heady Dev Companion:

| Setting | Default | Description |
|---------|---------|-------------|
| API URL | `http://localhost:3300` | Heady Manager endpoint |
| Inline Completions | `true` | Enable AI code completions |
| Prefer Local Models | `true` | Use local models first |
| Hotkey | `Ctrl+Shift+H` | Toggle Heady chat panel |

## Tech Stack

- **Kotlin** — Plugin language
- **IntelliJ Platform SDK** — IDE integration
- **Gradle** — Build system
- **HTTP Client** — Communicates with heady-manager API

## Build from Source

```bash
cd distribution/ide/jetbrains
./gradlew buildPlugin
# Output: build/distributions/heady-dev-companion-*.zip
```

---

*HeadySystems — Sacred Geometry Architecture*
