# 70 — Email Onboarding Sequences

> Pre-written email templates for every stage of user onboarding.

## What's Here

- **Sequence of onboarding emails** from welcome to upgrade
- Each references specific connection methods from other subfolders

## Email Sequence

### Email 1: Welcome

**Subject:** Welcome to HeadySystems

> Hi [Name],
>
> Welcome to HeadySystems! Here's what you can do right now:
>
> **Browser:** Open [URL] and log in.
> **API:** Your key is [KEY] — try `GET /api/health`.
>
> We'll send a few short emails to help you get the most out of the system.
>
> — Heady Team

---

### Email 2: Setup (Day 1)

**Subject:** Get Set Up — Choose Your Connection Method

> Hi [Name],
>
> Pick the way that works best for you:
>
> - **Browser:** Just open [URL] — nothing to install.
> - **Docker:** `docker pull ghcr.io/headysystems/heady:latest` (see attached guide).
> - **CLI:** `npm install -g heady-cli` for command-line power.
> - **SDK:** `npm install heady-sdk` or `pip install heady-sdk` to integrate into your app.
>
> Full connection guide: [link to 00-Overview]
>
> — Heady Team

---

### Email 3: Activation (Day 3)

**Subject:** Your First Real Task with HeadySystems

> Hi [Name],
>
> Try this 5-minute exercise:
>
> 1. Open the dashboard → check system health.
> 2. Browse the registry → find a component.
> 3. Run a Monte Carlo plan: `POST /api/monte-carlo/plan` with `{"taskType": "build"}`.
>
> You just used three core features. Reply if you have questions!
>
> — Heady Team

---

### Email 4: Feature Highlights (Day 7)

**Subject:** 3 Things You Might Not Know About HeadySystems

> Hi [Name],
>
> Here are features users love:
>
> 1. **Pattern Engine** — Detects performance bottlenecks automatically.
> 2. **Self-Critique** — The system diagnoses its own weaknesses.
> 3. **Layer Switcher** — Switch between local/cloud with one command.
>
> Try: `GET /api/patterns/summary` or `GET /api/self/status`.
>
> — Heady Team

---

### Email 5: Help & Support (Day 14)

**Subject:** Need Help? We're Here.

> Hi [Name],
>
> Just checking in. If you're stuck on anything:
>
> - **Docs:** [link to docs/]
> - **API Reference:** [link to Postman collection]
> - **Email:** support@headysystems.com
>
> — Heady Team

---

### Email 6: Upgrade / Expand (Day 30)

**Subject:** Ready to Scale? Explore Pro Features

> Hi [Name],
>
> If you're getting value from HeadySystems, here's what Pro adds:
>
> - Unlimited experiment tracking
> - Priority support
> - Team collaboration features
> - Advanced analytics and impact metrics
>
> See pricing: `GET /api/pricing/tiers`
>
> — Heady Team
