/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS — Story Driver                                    ║
 * ║  Sacred Geometry Architecture v1.0.0                             ║
 * ║                                                                   ║
 * ║  Turns system events into coherent narratives at project,        ║
 * ║  feature, incident, and experiment scopes.                       ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

const { EventEmitter } = require("events");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// ─── Phrasing Templates ──────────────────────────────────────────────
const PHRASING = {
  PIPELINE_CYCLE_COMPLETE: (refs) =>
    `Pipeline cycle #${refs.cycleNumber || "?"} completed. Gates: ${refs.gatesSummary || "all passed"}.`,
  PIPELINE_GATE_FAIL: (refs) =>
    `Pipeline gate "${refs.gate || "unknown"}" failed. Reason: ${refs.reason || "unspecified"}.`,
  BUILD_FAILED: (refs) =>
    `Build #${refs.buildId || "?"} failed due to ${refs.reason || "unknown errors"}.`,
  BUILD_SUCCESS: (refs) =>
    `Build #${refs.buildId || "?"} succeeded.`,
  DEPLOY_SUCCESS: (refs) =>
    `Deployment to ${refs.target || "production"} completed successfully.`,
  DEPLOY_FAILED: (refs) =>
    `Deployment to ${refs.target || "production"} failed: ${refs.reason || "unknown"}.`,
  ARENA_WINNER_CHOSEN: (refs) =>
    `Arena Mode selected ${refs.candidate || "winner"} (${refs.score || "?"}% pass probability) and squashed into main.`,
  ARENA_SQUASH_MERGE: (refs) =>
    `Winner candidate squash-merged into main. Old branches archived.`,
  RESOURCE_CRITICAL: (refs) =>
    `Resources critical: ${refs.resourceType || "system"} at ${refs.percent || "?"}%. ${refs.mitigation || "Mitigation applied"}.`,
  RESOURCE_SAFE_MODE_ENTER: () =>
    `System entered safe mode to protect interactive responsiveness.`,
  RESOURCE_SAFE_MODE_EXIT: () =>
    `System exited safe mode. Resources stabilized.`,
  SCHEMA_MIGRATED: (refs) =>
    `Schema migrated: ${refs.description || "update applied"}.`,
  NODE_ACTIVATED: (refs) =>
    `Node "${refs.nodeId || "?"}" activated.`,
  NODE_DEACTIVATED: (refs) =>
    `Node "${refs.nodeId || "?"}" deactivated.`,
  PATTERN_ADDED: (refs) =>
    `New pattern added: "${refs.patternName || "?"}".`,
  PATTERN_DEPRECATED: (refs) =>
    `Pattern deprecated: "${refs.patternName || "?"}".`,
  USER_DIRECTIVE: (refs) =>
    `User directive: "${refs.directive || refs.description || "?"}"`,
  USER_PIVOT: (refs) =>
    `Project pivot: "${refs.reason || refs.description || "?"}"`,
  USER_ANNOTATION: (refs) =>
    `Note: "${refs.text || refs.description || "?"}"`,
};

// Events to always ignore in narratives (too noisy)
const IGNORE_EVENTS = new Set(["RESOURCE_INFO", "TEST_PASS"]);

// Events that always get included
const ALWAYS_INCLUDE = new Set([
  "BUILD_FAILED", "ARENA_WINNER_CHOSEN", "PIPELINE_GATE_FAIL",
  "RESOURCE_CRITICAL", "SCHEMA_MIGRATED", "USER_DIRECTIVE", "USER_PIVOT",
]);

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
}

// ─── Story Driver ────────────────────────────────────────────────────

class HCStoryDriver extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.storePath = opts.storePath || path.join(__dirname, "..", ".heady", "stories.json");
    this.maxEventsPerStory = opts.maxEventsPerStory || 500;
    this.stories = {};
    this._load();
  }

  // ── Persistence ──────────────────────────────────────────────────

  _load() {
    try {
      if (fs.existsSync(this.storePath)) {
        this.stories = JSON.parse(fs.readFileSync(this.storePath, "utf8"));
      }
    } catch {
      this.stories = {};
    }
  }

  _save() {
    try {
      const dir = path.dirname(this.storePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.storePath, JSON.stringify(this.stories, null, 2), "utf8");
    } catch (err) {
      console.error("StoryDriver: Failed to save stories:", err.message);
    }
  }

  // ── Story CRUD ───────────────────────────────────────────────────

  createStory({ scope, title, links = {} }) {
    const id = uid();
    const now = new Date().toISOString();
    this.stories[id] = {
      id,
      scope: scope || "project",
      title: title || "Untitled Story",
      summary: "",
      status: "ongoing",
      timeline: [],
      links,
      pinnedEvents: [],
      createdAt: now,
      updatedAt: now,
    };
    this._save();
    this.emit("story_created", this.stories[id]);
    return this.stories[id];
  }

  getStory(storyId) {
    return this.stories[storyId] || null;
  }

  listStories({ scope, status } = {}) {
    let list = Object.values(this.stories);
    if (scope) list = list.filter((s) => s.scope === scope);
    if (status) list = list.filter((s) => s.status === status);
    return list.map((s) => ({
      id: s.id,
      scope: s.scope,
      title: s.title,
      status: s.status,
      eventCount: s.timeline.length,
      updatedAt: s.updatedAt,
    }));
  }

  completeStory(storyId) {
    const story = this.stories[storyId];
    if (!story) return null;
    story.status = "completed";
    story.updatedAt = new Date().toISOString();
    story.summary = this._generateSummary(story, "standard");
    this._save();
    return story;
  }

  archiveStory(storyId) {
    const story = this.stories[storyId];
    if (!story) return null;
    story.status = "archived";
    story.updatedAt = new Date().toISOString();
    this._save();
    return story;
  }

  // ── Event Ingestion ──────────────────────────────────────────────

  addEvent(storyId, { type, refs = {}, severity = "info", source = "system" }) {
    const story = this.stories[storyId];
    if (!story) return null;

    // Filter policy
    if (IGNORE_EVENTS.has(type) && !ALWAYS_INCLUDE.has(type)) return null;

    const description = this._generateDescription(type, refs);
    const event = {
      id: uid(),
      timestamp: new Date().toISOString(),
      type,
      description,
      refs,
      severity: ALWAYS_INCLUDE.has(type) ? "notable" : severity,
      source,
    };

    story.timeline.push(event);

    // Cap timeline length
    if (story.timeline.length > this.maxEventsPerStory) {
      story.timeline = story.timeline.slice(-this.maxEventsPerStory);
    }

    story.updatedAt = event.timestamp;
    this._save();
    this.emit("story_event", { storyId, event });
    return event;
  }

  // Ingest a raw system event and route to the right story (or create one)
  ingestSystemEvent({ type, refs = {}, source = "system", storyId = null }) {
    // If storyId provided, add directly
    if (storyId && this.stories[storyId]) {
      return this.addEvent(storyId, { type, refs, source });
    }

    // Auto-route: find the most recent ongoing story matching the source scope
    const scopeMap = {
      hcfullpipeline: "project",
      build_system: "feature",
      arena_mode: "experiment",
      resource_manager: "incident",
      registry: "project",
      buddy_conversations: "project",
    };
    const scope = scopeMap[source] || "project";

    // Find or create story
    let target = Object.values(this.stories).find(
      (s) => s.status === "ongoing" && s.scope === scope
    );
    if (!target) {
      target = this.createStory({
        scope,
        title: `${scope.charAt(0).toUpperCase() + scope.slice(1)} — ${new Date().toLocaleDateString()}`,
      });
    }

    return this.addEvent(target.id, { type, refs, source });
  }

  // ── Pinning & Annotation ─────────────────────────────────────────

  pinEvent(storyId, eventId) {
    const story = this.stories[storyId];
    if (!story) return null;
    if (!story.pinnedEvents.includes(eventId)) {
      story.pinnedEvents.push(eventId);
      this._save();
    }
    return story.pinnedEvents;
  }

  annotate(storyId, text) {
    return this.addEvent(storyId, {
      type: "USER_ANNOTATION",
      refs: { text },
      severity: "notable",
      source: "user",
    });
  }

  // ── Timeline & Summary ──────────────────────────────────────────

  getTimeline(storyId, { limit = 50, severity } = {}) {
    const story = this.stories[storyId];
    if (!story) return [];
    let events = [...story.timeline];
    if (severity) events = events.filter((e) => e.severity === severity);
    return events.slice(-limit);
  }

  getRecentEvents(limit = 20) {
    const all = [];
    for (const story of Object.values(this.stories)) {
      for (const event of story.timeline) {
        all.push({ ...event, storyId: story.id, storyTitle: story.title });
      }
    }
    all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return all.slice(0, limit);
  }

  getSummary(storyId, level = "standard") {
    const story = this.stories[storyId];
    if (!story) return null;
    return {
      id: story.id,
      title: story.title,
      scope: story.scope,
      status: story.status,
      summary: this._generateSummary(story, level),
      eventCount: story.timeline.length,
      pinnedCount: story.pinnedEvents.length,
      updatedAt: story.updatedAt,
    };
  }

  getSystemSummary() {
    const stories = Object.values(this.stories);
    const ongoing = stories.filter((s) => s.status === "ongoing");
    const completed = stories.filter((s) => s.status === "completed");
    const recentEvents = this.getRecentEvents(10);

    return {
      totalStories: stories.length,
      ongoing: ongoing.length,
      completed: completed.length,
      archived: stories.filter((s) => s.status === "archived").length,
      recentNarrative: recentEvents.map((e) => e.description).join(" "),
      stories: ongoing.map((s) => ({
        id: s.id,
        title: s.title,
        scope: s.scope,
        eventCount: s.timeline.length,
      })),
      ts: new Date().toISOString(),
    };
  }

  // ── Internal Helpers ─────────────────────────────────────────────

  _generateDescription(type, refs) {
    const template = PHRASING[type];
    if (template) return template(refs);
    return `Event: ${type}${refs.description ? " — " + refs.description : ""}`;
  }

  _generateSummary(story, level = "standard") {
    const limits = { fine: 50, standard: 20, coarse: 10 };
    const max = limits[level] || 20;

    // Pick notable events first, then most recent
    const notable = story.timeline.filter((e) => e.severity === "notable" || e.severity === "critical");
    const pinned = story.timeline.filter((e) => story.pinnedEvents.includes(e.id));
    const unique = [...new Map([...pinned, ...notable].map((e) => [e.id, e])).values()];

    let selected = unique.slice(-max);
    if (selected.length < max) {
      const remaining = story.timeline
        .filter((e) => !selected.find((s) => s.id === e.id))
        .slice(-(max - selected.length));
      selected = [...selected, ...remaining];
    }

    selected.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    return selected.map((e) => e.description).join(" ");
  }
}

// ─── Express Route Registration ──────────────────────────────────────

function registerStoryRoutes(app, storyDriver) {
  const prefix = "/api/stories";

  app.get(prefix, (req, res) => {
    const { scope, status } = req.query;
    res.json({ ok: true, stories: storyDriver.listStories({ scope, status }), ts: new Date().toISOString() });
  });

  app.get(`${prefix}/recent`, (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    res.json({ ok: true, events: storyDriver.getRecentEvents(limit), ts: new Date().toISOString() });
  });

  app.get(`${prefix}/summary`, (req, res) => {
    res.json({ ok: true, ...storyDriver.getSystemSummary() });
  });

  app.get(`${prefix}/:storyId`, (req, res) => {
    const story = storyDriver.getStory(req.params.storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });
    res.json({ ok: true, ...story });
  });

  app.get(`${prefix}/:storyId/timeline`, (req, res) => {
    const { limit, severity } = req.query;
    const events = storyDriver.getTimeline(req.params.storyId, {
      limit: parseInt(limit) || 50,
      severity,
    });
    res.json({ ok: true, events, ts: new Date().toISOString() });
  });

  app.get(`${prefix}/:storyId/summary`, (req, res) => {
    const level = req.query.level || "standard";
    const summary = storyDriver.getSummary(req.params.storyId, level);
    if (!summary) return res.status(404).json({ error: "Story not found" });
    res.json({ ok: true, ...summary });
  });

  app.post(prefix, (req, res) => {
    const { scope, title, links } = req.body;
    const story = storyDriver.createStory({ scope, title, links });
    res.status(201).json({ ok: true, ...story });
  });

  app.post(`${prefix}/:storyId/events`, (req, res) => {
    const { type, refs, severity, source } = req.body;
    if (!type) return res.status(400).json({ error: "type required" });
    const event = storyDriver.addEvent(req.params.storyId, { type, refs, severity, source });
    if (!event) return res.status(404).json({ error: "Story not found or event filtered" });
    res.status(201).json({ ok: true, ...event });
  });

  app.post(`${prefix}/:storyId/pin/:eventId`, (req, res) => {
    const pins = storyDriver.pinEvent(req.params.storyId, req.params.eventId);
    if (!pins) return res.status(404).json({ error: "Story not found" });
    res.json({ ok: true, pinnedEvents: pins });
  });

  app.post(`${prefix}/:storyId/annotate`, (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });
    const event = storyDriver.annotate(req.params.storyId, text);
    if (!event) return res.status(404).json({ error: "Story not found" });
    res.status(201).json({ ok: true, ...event });
  });

  app.post(`${prefix}/:storyId/complete`, (req, res) => {
    const story = storyDriver.completeStory(req.params.storyId);
    if (!story) return res.status(404).json({ error: "Story not found" });
    res.json({ ok: true, id: story.id, status: story.status, summary: story.summary });
  });
}

module.exports = { HCStoryDriver, registerStoryRoutes };
