<!--
    ╭─────────────────────────────────────────────────────────────╮
    │  ██╗  ██╗███████╗ █████╗ ██████╗ ██╗   ██╗                  │
    │  ██║  ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝                  │
    │  ███████║█████╗  ███████║██║  ██║ ╚████╔╝                   │
    │  ██╔══██║██╔══╝  ██╔══██║██║  ██║  ╚██╔╝                    │
    │  ██║  ██║███████╗██║  ██║██████╔╝   ██║                     │
    │  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝                     │
    │                                                              │
    │  ∞ HeadyBuddy — Visual Design Specification ∞                │
    ╰─────────────────────────────────────────────────────────────╯
-->

# HeadyBuddy Design Specification

> Visual identity, interaction model, and motion guidelines for the
> HeadyBuddy desktop overlay AI companion widget.

---

## 1. Design Principles

| Principle | Meaning |
|-----------|---------|
| **Calm** | Dark surfaces, muted backgrounds, soft luminance — never aggressive. |
| **Organic** | Rounded corners (1.25 rem "sacred" radius), breathing animations, natural motion curves. |
| **Expressive** | Avatar state changes communicate activity without words. |
| **Trustworthy** | Honest UI — loading states, error states, and progress are always visible. |
| **Accessible** | WCAG AA contrast on all text, keyboard-navigable, screen-reader labels. |

---

## 2. Brand Tokens

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `heady-bg` | `#0a0e17` | App / overlay background |
| `heady-surface` | `#111827` | Card surfaces, message bubbles |
| `heady-border` | `#1e293b` | Borders, dividers |
| `heady-cyan` | `#22d3ee` | Primary accent, avatar idle, links |
| `heady-emerald` | `#34d399` | Success states |
| `heady-amber` | `#fbbf24` | Warning, error highlight |
| `heady-magenta` | `#c084fc` | Thinking state, special operations |
| `heady-text` | `#e2e8f0` | Primary text |
| `heady-muted` | `#64748b` | Secondary / placeholder text |

### Typography

| Level | Font | Weight | Size |
|-------|------|--------|------|
| Header | Inter / Segoe UI | Bold (700) | 14 px |
| Body | Inter / Segoe UI | Regular (400) | 13 px |
| Caption | Inter / Segoe UI | Medium (500) | 10–11 px |
| Code | JetBrains Mono / Consolas | Regular | 12 px |

### Spacing & Radius

| Token | Value |
|-------|-------|
| `rounded-sacred` | 1.25 rem (20 px) |
| Widget padding | 16 px |
| Chip padding | 6 px 12 px |
| Chip radius | 9999 px (full pill) |

---

## 3. Widget States

### 3.1 Collapsed Pill

```
┌──────────────────────────────────┐
│  [Avatar]  HeadyBuddy            │
│            Ready                 │
└──────────────────────────────────┘
   [Plan my day] [Summarize] [IDE]    ← suggestion chips float above
```

- **Dimensions**: ~320 × 120 px (with chips area)
- **Position**: Bottom-right, 24 px from edges
- **Behavior**: Click → expands to Main Widget. Chips → immediate action.
- **Glass effect**: `rgba(17,24,39,0.85)` + `blur(16px)`
- **Border**: 1 px `heady-border`, hover → `heady-cyan/40`

### 3.2 Main Widget

```
┌─────────────────────────────────────┐
│ [Avatar] HeadyBuddy    [⚙] [▾]     │  ← header
│ Perfect Day Companion               │
├─────────────────────────────────────┤
│                                     │
│  Hey! I'm HeadyBuddy.              │  ← chat / greeting
│  Your perfect day AI companion.     │
│                                     │
│  [user bubble] ...                  │
│  [assistant bubble] ...             │
│                                     │
├─────────────────────────────────────┤
│ [Plan day] [Tasks] [IDE] [Surprise] │  ← suggestion chips
├─────────────────────────────────────┤
│ [  Ask anything…         ] [🎤] [→] │  ← input bar
└─────────────────────────────────────┘
```

- **Dimensions**: 380 × 560 px max
- **Sections**: Header (56 px) · Chat (flex) · Chips (40 px) · Input (52 px)
- **Scroll**: Chat area scrolls; header, chips, input are fixed.
- **Collapse**: `Esc` key or `▾` button → returns to pill.

### 3.3 Expanded / Detail View

```
┌─────────────────────────────────────┐
│ [Avatar] HeadyBuddy — Expanded  [▾] │
├─────────────────────────────────────┤
│ [Overview] [Steps] [History]        │  ← tab bar
├─────────────────────────────────────┤
│                                     │
│  Current Task: Build landing page   │
│  Progress: 3/5 steps               │
│  Focused: 47 min                   │
│  Next Break: 13 min                │
│                                     │
│  ── Steps ──────────────────────── │
│  ✓ 1. Scaffold project             │
│  ✓ 2. Hero section                 │
│  ● 3. Feature grid (in progress)   │
│  ○ 4. Footer                       │
│  ○ 5. Deploy                       │
│                                     │
├─────────────────────────────────────┤
│ [  Continue conversation…    ] [→]  │
└─────────────────────────────────────┘
```

- **Dimensions**: 420 × 680 px max
- **Tabs**: Overview / Steps / History — only one visible at a time.
- **Rich content**: Code blocks, progress bars, fact sets.

---

## 4. Sacred Geometry Avatar

The avatar is a **hexagonal Sacred Geometry motif** composed of:

- Outer hexagon (stroke, filled at 7 % opacity)
- Inner Star of David (two overlapping triangles at different opacities)
- Center dot (solid accent color)

### State Animations

| State | Color | Animation |
|-------|-------|-----------|
| **Idle** | `heady-cyan` | Slow 4 s breathe (scale 1 → 1.05, opacity 0.6 → 1) |
| **Listening** | `heady-magenta` (light) | Slow 3 s pulse |
| **Thinking** | `heady-magenta` | 8 s continuous rotation |
| **Success** | `heady-emerald` | Brief flash (0.5 s), then return to idle |
| **Error** | `heady-amber` | Fast 1 s pulse, 2 cycles, then return to idle |

All animations use `ease-in-out` curves. No jarring transitions.

---

## 5. Suggestion Chips

- **Shape**: Full pill (`border-radius: 9999px`)
- **Color**: `heady-border/60` background, `heady-text/80` text
- **Hover**: `heady-cyan/15` background, `heady-cyan` text, `heady-cyan/30` border
- **Icons**: 13 px Lucide icons at 70 % opacity
- **Max chips**: 3 in collapsed pill, 4–5 in main widget
- **Contextual**: Chips change based on selected text, time, open app, idle state

---

## 6. Chat Bubbles

| Sender | Background | Border | Radius |
|--------|-----------|--------|--------|
| User | `heady-cyan/15` | none | 16 px, bottom-right 6 px |
| Assistant | `heady-surface` | `heady-border/40` | 16 px, bottom-left 6 px |
| Error | `heady-amber/10` | `heady-amber/20` | 16 px, bottom-left 6 px |

---

## 7. Motion Guidelines

| Motion | Duration | Easing | When |
|--------|----------|--------|------|
| Fade in | 300 ms | ease-out | Widget appears |
| Slide up | 300 ms | ease-out | Main widget expands from pill |
| Breathe | 4 000 ms | ease-in-out | Idle avatar loop |
| Scale hover | 200 ms | ease-out | Pill hover (1 → 1.05) |
| State transition | 500 ms | ease-in-out | Avatar color/animation change |

**Rules**:
- Prefer opacity and transform (GPU-accelerated).
- No layout-triggering animations (no width/height animations on content).
- Respect `prefers-reduced-motion` — disable breathe and pulse when set.

---

## 8. Accessibility

- All interactive elements have `focus:ring` visible on keyboard focus.
- Avatar has `role="status"` with `aria-label` reflecting current state.
- Suggestion chips are keyboard-navigable with arrow keys.
- Chat area uses `role="log"` with `aria-live="polite"`.
- Color is never the sole indicator — icons and text accompany states.
- Minimum contrast: 4.5:1 for body text, 3:1 for large text and icons.

---

## 9. Responsive Degradation

| Host | Behavior |
|------|----------|
| **Electron overlay** | Full experience: transparent, always-on-top, draggable. |
| **Docker/noVNC desktop** | Chromium window, positioned bottom-right, no transparency. |
| **Windows Widget host** | Adaptive Cards rendered by host; simplified layout. |
| **Web fallback** | Full React widget in browser tab at `/buddy`. |

---

## 10. Resource Health Indicators

### 10.1 Compact Resource Dot (Collapsed Pill)

A tiny color-coded dot beside the status text communicates resource health at a glance:

| State | Color | Animation |
|-------|-------|-----------|
| **Healthy** (<70% CPU/RAM) | `heady-emerald` | None |
| **Constrained** (70–85%) | `heady-amber` | None |
| **Critical** (>85%) | `red-400` | Pulse |

Hover tooltip shows: `CPU: XX% | RAM: XX%`.

### 10.2 Compact Resource Badge (Main Widget Header)

A small pill in the header shows `Healthy` / `Constrained` / `Critical` / `Safe Mode`:
- **Shape**: Pill (`border-radius: 9999px`)
- **Background**: `heady-border/30`
- **Text**: `heady-muted`, 9 px
- **Dot**: Color matches severity
- **Click**: Navigates to Expanded View → Resources tab

### 10.3 Full Resource Health Panel (Expanded View → Resources Tab)

```
┌─────────────────────────────────────┐
│  Resource Health                    │
├─────────────────────────────────────┤
│  CPU  ████████░░░░  75%            │
│  RAM  ██████████░░  83% 13.4/16 GB │
│  Disk ████░░░░░░░░  38% 180/480 GB │
│  GPU  ██████░░░░░░  60%            │
│  VRAM ████████░░░░  72% 5.8/8 GB   │
├─────────────────────────────────────┤
│  [Explain slowdown] [Pause jobs]   │
│  [Review GPU] [Safe mode]          │
└─────────────────────────────────────┘
```

**Bar colors** match severity thresholds defined in
`configs/resource-management-protocol.yaml`:

| Severity | Bar Color | Condition |
|----------|-----------|-----------|
| Healthy | `heady-emerald` | Below soft threshold |
| Soft Warning | `heady-cyan` | At soft threshold |
| Hard Warning | `heady-amber` | Above midpoint |
| Critical | `red-500` | At hard threshold, pulsing |

**Safe Mode banner**: Amber background with `heady-amber` text when active.

### 10.4 Escalation Card

When the resource manager requires user input, HeadyBuddy presents a
structured card inside the chat:

```
┌─────────────────────────────────────┐
│ ⚠ Resource Alert                    │
│                                     │
│ GPU VRAM at 93%, RAM at 87%.        │
│ Primary contributors:               │
│   • pyrefly.exe (PID 32624) 2.9 GB │
│   • python.exe (PID 11096) 57 MB   │
│                                     │
│ Impact: IDE may slow, OOM risk.     │
│                                     │
│ [★ Recommended] [Continue All]      │
│ [Safe Mode] [Manual Control]        │
└─────────────────────────────────────┘
```

---

## 11. Expanded View — Tab Architecture

The Expanded View now supports four tabs:

| Tab | Icon | Content |
|-----|------|---------|
| **Overview** | `LayoutDashboard` | Pipeline status, resource summary, activation state |
| **Steps** | `ListChecks` | HCFullPipeline stage progress (7 stages) |
| **Resources** | `Activity` | Full resource health panel + quick actions |
| **Story** | `BookOpen` | Narrative timeline, project/feature/incident stories |
| **History** | `MessageSquare` | Scrollable conversation history |

Tabs use `heady-cyan` underline when active, `heady-muted` text when inactive.
Only one tab is visible at a time.

---

## 12.1 Story Timeline Panel (Expanded View → Story Tab)

The Story tab surfaces the **Story Driver** — a narrative intelligence layer
that turns system events into coherent timelines.

```
┌─────────────────────────────────────┐
│  Story Timeline                     │
├─────────────────────────────────────┤
│  Project — Feb 6, 2026             │
│  Status: ongoing (12 events)        │
│                                     │
│  ── Timeline ──────────────────── │
│  📌 User directive: "Build the      │
│     landing page"                   │
│  ● Build #141 succeeded.           │
│  ⚠ Pipeline gate "resource" failed │
│  ● Arena Mode selected Candidate B │
│    (95% pass) and squashed.        │
│  ● System entered safe mode.       │
│  📝 Note: "Pivoting to new layout" │
│                                     │
├─────────────────────────────────────┤
│ [What changed?] [Annotate]         │
│ [Feature story] [Full summary]     │
└─────────────────────────────────────┘
```

### Story Event Visual Indicators

| Severity | Icon | Color |
|----------|------|-------|
| **info** | `●` (dot) | `heady-muted` |
| **notable** | `◆` (diamond) | `heady-cyan` |
| **critical** | `⚠` (warning) | `heady-amber` |
| **pinned** | `📌` (pin) | `heady-emerald` |
| **annotation** | `📝` (note) | `heady-magenta` |

### Story Scope Badges

| Scope | Badge Color | Example |
|-------|-------------|---------|
| **project** | `heady-cyan/20` bg, `heady-cyan` text | "Project — Feb 6" |
| **feature** | `heady-emerald/20` bg, `heady-emerald` text | "Feature: Landing Page" |
| **incident** | `heady-amber/20` bg, `heady-amber` text | "Incident: OOM Event" |
| **experiment** | `heady-magenta/20` bg, `heady-magenta` text | "Experiment: Arena Run #3" |

---

## 12. Gemini-Style UI Prompt (for AI-generated designs)

Use this prompt with design-generating models to produce HeadyBuddy mockups:

> Design a floating AI companion widget for **HeadyBuddy by HeadySystems**.
> Follow Gemini visual principles: calm, expressive, minimal, trustworthy.
>
> **Brand**: Optimistic, grounded, inventive, kind.
> **Colors**: bg `#0a0e17`, surface `#111827`, accent `#22d3ee`,
> success `#34d399`, warning `#fbbf24`, text `#e2e8f0`.
> **Avatar**: Sacred Geometry hexagon with Star of David inner motif.
>
> Design four states: collapsed pill, main widget, expanded view (with
> Overview / Steps / Resources / History tabs), and escalation card.
> Include resource health indicators at all widget states.
> Use Adaptive Cards semantics where possible.
> Ensure non-intrusive, accessible, dark-mode-first design.
