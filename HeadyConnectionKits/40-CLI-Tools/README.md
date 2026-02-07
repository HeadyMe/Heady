# 40 — CLI Tools

> For power users: command-line access to HeadySystems.

## What's Here

- **Install instructions** for the Heady CLI
- **Quickstart** (login → first command → basic workflows)
- **Email template** ready to send

## Install

```bash
# npm (global)
npm install -g heady-cli

# or from source
git clone https://github.com/HeadySystems/Heady.git
cd Heady
npm install
npm link
```

## Quickstart

### 1. Login

```bash
heady login --key YOUR_API_KEY --endpoint http://localhost:3300
```

### 2. Check Health

```bash
heady health
# Output: {"ok":true,"service":"heady-manager","ts":"..."}
```

### 3. View Registry

```bash
heady registry list
```

### 4. Run a Pipeline

```bash
heady pipeline run --type hcfullpipeline
```

### 5. Check Patterns

```bash
heady patterns list --category performance
```

## Available Commands

| Command | Description |
|---|---|
| `heady health` | System health check |
| `heady registry list` | List all registered components |
| `heady registry get <id>` | Get component details |
| `heady pipeline run` | Trigger a pipeline run |
| `heady patterns list` | List detected patterns |
| `heady mc plan <taskType>` | Generate Monte Carlo plan |
| `heady layer status` | Show active layer |
| `heady layer switch <name>` | Switch active layer |

## Email Template

**Subject:** HeadySystems CLI — Power User Access

**Body:**

> Hi [Name],
>
> For command-line access to HeadySystems:
>
> ```
> npm install -g heady-cli
> heady login --key YOUR_KEY --endpoint https://your-heady-instance.com
> heady health
> ```
>
> Attached: full command reference and quickstart guide.
>
> — Heady Team
