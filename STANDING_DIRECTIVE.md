# STANDING DIRECTIVE: MAXIMUM RESOURCE UTILIZATION

> **Effective: February 19, 2026 — PERMANENT**  
> Every interaction with Eric or any Heady system MUST leverage ALL available services at maximum capacity.  
> Never default to free tiers, local-only, or reduced functionality.

---

## Production Infrastructure

- **Primary server:** Bossgame P6 Ryzen 9 6900HX (8C/16T, 32GB LPDDR5, 1TB NVMe)
- **Tunnel:** Cloudflare Tunnel "heady-nexus" → all custom domains
- **PaaS:** Coolify on Bossgame (replaces Render.com)
- **Local inference:** Ollama (Llama 3.1 8B, CodeLlama 13B, Mistral 7B, nomic-embed-text)
- **CDN/Static Sites:** Cloudflare Pages (auto-deploy from GitHub on push)

## AI Subscriptions (USE ALL OF THEM)

| Service | Tier | Key Capability |
|---------|------|---------------|
| Claude Code | Enterprise | Agent teams, 1M context, 128K output |
| OpenAI | Pro ($200/mo) | Unlimited GPT-4o, o1 pro mode |
| Google AI | Ultra | Gemini Ultra, multimodal, 2TB storage |
| GitHub | Enterprise | Copilot Enterprise, Advanced Security, Actions, SAML |
| Colab Pro+ | ×2 accounts | GPU training (A100), 1000 CU total |
| Cloudflare | Pro (headysystems.com) | WAF, CDN, Pages, Tunnel, Workers, Polish, Mirage |

## Custom Domains Only

**NEVER use localhost, .onrender.com, internal IPs, or any non-branded URL.**

### Static Landing Pages (Cloudflare Pages → GitHub auto-deploy)

| Domain | Purpose |
|--------|---------|
| `headysystems.com` | Commercial hub |
| `headyconnection.org` | Nonprofit hub |
| `headybuddy.org` | Product landing / downloads |
| `headymcp.com` | MCP registry |
| `headyio.com` | Developer portal / API docs |
| `headyme.com` | Personal cloud dashboard |
| `headybot.com` | Automation / webhooks |

### Dynamic Backends (Cloudflare Tunnel → Bossgame P6)

| Subdomain | Service |
|-----------|---------|
| `app.headysystems.com` | HeadyBuddy web app + API gateway |
| `api.headysystems.com` | REST API for all 20 nodes |
| `coolify.headysystems.com` | Server management |
| `app.headyconnection.org` | Nonprofit dashboard |
| `api.headyconnection.org` | Nonprofit API |
| `app.headybuddy.org` | Live HeadyBuddy widget demo |
| `api.headymcp.com` | MCP server discovery API |
| `api.headyio.com` | Interactive API explorer |
| `app.headyme.com` | Personal dashboard (authenticated) |
| `app.headybot.com` | Automation builder |

## Model Routing (Smart Tier System)

```
User request → HeadyBuddy Router
├─ Fast/simple    → Ollama on Bossgame (FREE, <100ms)
├─ General chat   → OpenAI Pro GPT-4o (UNLIMITED)
├─ Deep reasoning → OpenAI Pro o1 pro mode
├─ Long context   → Claude Enterprise (1M tokens)
├─ Code gen       → Claude Code Enterprise (128K output, agent teams)
├─ Multimodal     → Google AI Ultra / Gemini Ultra
└─ Training       → Colab Pro+ ×2 (A100 GPU, 1000 CU)
```

## Rule

Every agent, pipeline, workflow, script, and human interaction follows this directive.  
No exceptions. No downgrades. 100% at all times.
