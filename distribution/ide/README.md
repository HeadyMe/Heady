# Heady IDE Extensions

"Heady Dev Companion" for every popular IDE — same brain, same auth, same backend.

## Supported IDEs

| IDE | Folder | Tech | Status |
|-----|--------|------|--------|
| **VS Code / VS Codium** | `vscode/` | TypeScript Extension API | Active |
| **JetBrains** (IntelliJ, PyCharm, WebStorm, etc.) | `jetbrains/` | Kotlin Plugin SDK | Active |
| **Neovim / Vim** | `neovim/` | Lua + LSP | Active |
| **Visual Studio** | `visual-studio/` | C# VSIX | Planned |
| **Xcode** | `xcode/` | Swift Source Editor Extension | Planned |
| **Sublime Text** | `sublime/` | Python Plugin | Planned |
| **Eclipse** | `eclipse/` | Java OSGi Plugin | Planned |
| **Windsurf / Cursor** | `windsurf/` | Compatible via MCP | Active |

## Common Features

- **Inline Completions** — Context-aware code suggestions
- **Chat Panel** — Ask Heady about code, get explanations, refactors
- **Code Actions** — Explain, refactor, test generation, doc generation
- **Codebase RAG** — Index your repo for deep context awareness
- **Agent Mode** — Multi-step task execution (write tests, fix bugs, migrate code)
- **Voice Input** — Speak to Heady from your editor
- **Project Billing** — Per-seat dev license + usage metrics

## Authentication

All extensions use the same OAuth/token mechanism:
1. `heady login` from CLI, or
2. Sign in via the extension UI (redirects to heady.systems)
3. Token stored securely in OS keychain

## Backend

All extensions call the same `heady-orchestrator` "dev-assistant" agent via `heady-api`.
