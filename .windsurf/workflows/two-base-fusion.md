---
description: Two-Base Fusion — Plan and build a fused app from two strong bases (e.g., Chrome + Comet)
---

# Two-Base Fusion Workflow

Reusable planning pattern for taking two strong bases, extracting their superpowers, and designing a fused app with a clean architecture and phased roadmap.

## When to Use

- Building a new app by combining two existing platforms/paradigms
- Creating vertical-specific applications from known base patterns
- Building HeadyAutoIDE itself (Windsurf/VS Code + Comet/TeamAI)
- Any "take the best of X and Y" project

## Steps

### 1. Identify the Two Bases

Ask: "What are the two bases we're fusing?"

For each base, extract:
- **Strengths** (what it does best)
- **Conceptual subsystems** (UI, data, logic, security, extensions, etc.)
- **Weaknesses** (where it falls short)

### 2. Define the Fused Mission

Force clarity on exactly three things:
- **Problem statement:** What does the fusion solve that neither base solves alone?
- **Primary user:** Who is this for? (one persona)
- **Top-3 success metrics:** How do we know it worked?

### 3. Design the Fused Architecture

Create a layer-ownership table:

| Layer | Base A Role | Base B Role | Fused Owner (who dominates) |
|---|---|---|---|
| UI / Presentation | ? | ? | ? |
| Core Logic | ? | ? | ? |
| Data / Storage | ? | ? | ? |
| Integration | ? | ? | ? |
| Security | ? | ? | ? |

### 4. Squash Museum (Resolve Overlaps)

For every overlapping capability:
- Identify which base is the **single source of truth**
- Remove the redundant implementation
- Unify naming, UX flows, and API contracts

Output: A capability-ownership table with clear "fused decision" for each row.

### 5. Create Phased Roadmap

| Phase | Focus | Key Deliverables |
|---|---|---|
| **Phase 0** | Discovery & constraints | Tech stack, hosting, budget, timeline |
| **Phase 1** | Minimum viable fusion | Core integration proving both bases work together |
| **Phase 2** | Deep features | Full capability from both bases, properly merged |
| **Phase 3** | Security & collaboration | RBAC, multi-user, compliance |
| **Phase 4** | Polish & scale | Performance, onboarding, templates, impact dashboards |

For each phase: objectives, user stories, acceptance criteria, validation tests.

### 6. Assign to HeadySystems Agents

Map tasks to agents:
- **FrontendDev** — UI layer, Sacred Geometry aesthetics
- **BackendDev** — APIs, services, data layer
- **DevOps** — Docker, CI/CD, deployment
- **ProductStrategist** — Specs, prioritization, pricing
- **MarketAnalyst** — Positioning, competitor mapping

### 7. Track Experiments

Log each major design or implementation decision as an experiment:
- **Hypothesis:** "Using Base A for the UI layer will be faster than building from scratch"
- **Outcome:** Measured result
- **Learning:** What to carry forward

### 8. Connect to Heady Ecosystem

Ensure the fused app:
- Plugs into shared layers (identity, billing, impact tracking, telemetry)
- Is registered in `heady-registry.json`
- Has a connection kit in `HeadyConnectionKits/`
- Follows the Iterative Rebuild Protocol for error elimination

## Example Pairings

| Pair | Fused Mission |
|---|---|
| Chrome + Comet | Browser-native AI development cockpit with experiment tracking |
| VS Code + TeamAI | Multi-agent IDE with experiment traces and project management |
| Figma + Notion | Design-to-docs cockpit with live collaboration |
| Slack + Jira | Communication + project management unified workspace |
| LMS + AI Tutor | Education vertical with personalized learning |
| EHR + AI Diagnostics | Health vertical with intelligent clinical support |

## Drupal Check

At Step 3, always ask: "Is Drupal-headless + containers beneficial here?"
- **Yes** if the app needs: content model, roles, workflows, multi-vertical content, app catalog.
- **No** if it's a lightweight prototype with no content model.

## Output

After running this workflow, you should have:
1. A clear fused mission and user
2. An architecture with layer ownership decided
3. A squash-museum table (no redundancies)
4. A phased roadmap with concrete tasks
5. Agent assignments
6. Connection to the Heady ecosystem
