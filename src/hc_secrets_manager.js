/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  HC Secrets Manager — Token & Secret Lifecycle Management        ║
 * ║  Tracks expiry, auto-refreshes, rotation alerts, audit trail     ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 *
 * Every secret in the Heady ecosystem is registered here.
 * The manager knows:
 *   - What secrets exist and where they come from
 *   - When they expire (or if they never expire)
 *   - How to refresh them (if auto-refreshable)
 *   - Who last rotated them and when
 *   - What depends on them
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const CACHE_DIR = path.join(__dirname, "..", ".heady_cache");
const STATE_FILE = path.join(CACHE_DIR, "secrets_state.json");

// ─── Secret Definition Schema ─────────────────────────────────────
// Each secret has:
//   id:           unique key (e.g. "cloudflare_oauth")
//   name:         human-readable name
//   source:       where it comes from (env, file, api)
//   envVar:       environment variable name (if applicable)
//   filePath:     config file path (if applicable)
//   expiresAt:    ISO timestamp or null (never expires)
//   refreshable:  boolean — can we auto-refresh?
//   refreshFn:    async function to refresh (set at runtime)
//   lastRefreshed: ISO timestamp
//   lastChecked:  ISO timestamp
//   status:       "valid" | "expiring_soon" | "expired" | "unknown" | "missing"
//   dependents:   list of services that use this secret
//   tags:         categorization tags

class SecretsManager {
  constructor() {
    this.secrets = new Map();
    this.auditLog = [];
    this.checkIntervalMs = 60_000; // check every 60s
    this.warnBeforeMs = 15 * 60_000; // warn 15 min before expiry
    this.intervalId = null;
    this._loadState();
  }

  // ─── Registration ───────────────────────────────────────────────
  register(config) {
    const secret = {
      id: config.id,
      name: config.name || config.id,
      source: config.source || "env",
      envVar: config.envVar || null,
      filePath: config.filePath || null,
      fileKey: config.fileKey || null,
      expiresAt: config.expiresAt || null,
      refreshable: config.refreshable || false,
      refreshFn: config.refreshFn || null,
      lastRefreshed: config.lastRefreshed || null,
      lastChecked: null,
      status: "unknown",
      dependents: config.dependents || [],
      tags: config.tags || [],
      masked: true,
      meta: config.meta || {},
    };
    this.secrets.set(config.id, secret);
    this._audit(config.id, "registered", `Registered secret: ${config.name}`);
    return secret;
  }

  // ─── Update Expiry ──────────────────────────────────────────────
  updateExpiry(id, expiresAt) {
    const s = this.secrets.get(id);
    if (!s) return null;
    s.expiresAt = expiresAt;
    s.status = this._computeStatus(s);
    this._audit(id, "expiry_updated", `Expiry set to ${expiresAt}`);
    this._saveState();
    return s;
  }

  // ─── Mark Refreshed ─────────────────────────────────────────────
  markRefreshed(id, newExpiresAt) {
    const s = this.secrets.get(id);
    if (!s) return null;
    s.lastRefreshed = new Date().toISOString();
    s.expiresAt = newExpiresAt || s.expiresAt;
    s.status = this._computeStatus(s);
    this._audit(id, "refreshed", `Token refreshed, new expiry: ${newExpiresAt}`);
    this._saveState();
    return s;
  }

  // ─── Check All Secrets ──────────────────────────────────────────
  async checkAll() {
    const results = [];
    const now = new Date();

    for (const [id, s] of this.secrets) {
      s.lastChecked = now.toISOString();
      const oldStatus = s.status;
      s.status = this._computeStatus(s);

      // Auto-refresh if expiring soon or expired
      if ((s.status === "expiring_soon" || s.status === "expired") && s.refreshable && s.refreshFn) {
        try {
          const refreshResult = await s.refreshFn(s);
          if (refreshResult && refreshResult.expiresAt) {
            s.expiresAt = refreshResult.expiresAt;
            s.lastRefreshed = now.toISOString();
            s.status = this._computeStatus(s);
            this._audit(id, "auto_refreshed", `Auto-refreshed. New expiry: ${refreshResult.expiresAt}`);
          }
        } catch (err) {
          this._audit(id, "refresh_failed", `Auto-refresh failed: ${err.message}`);
        }
      }

      // Status change audit
      if (oldStatus !== s.status && oldStatus !== "unknown") {
        this._audit(id, "status_changed", `${oldStatus} -> ${s.status}`);
      }

      results.push({
        id,
        name: s.name,
        status: s.status,
        expiresAt: s.expiresAt,
        expiresIn: s.expiresAt ? this._timeUntil(s.expiresAt) : null,
        refreshable: s.refreshable,
        lastRefreshed: s.lastRefreshed,
        tags: s.tags,
      });
    }

    this._saveState();
    return results;
  }

  // ─── Get Status Summary ─────────────────────────────────────────
  getSummary() {
    const all = [...this.secrets.values()];
    return {
      total: all.length,
      valid: all.filter(s => s.status === "valid").length,
      expiringSoon: all.filter(s => s.status === "expiring_soon").length,
      expired: all.filter(s => s.status === "expired").length,
      missing: all.filter(s => s.status === "missing").length,
      unknown: all.filter(s => s.status === "unknown").length,
      refreshable: all.filter(s => s.refreshable).length,
      ts: new Date().toISOString(),
    };
  }

  // ─── Get Single Secret Info (masked) ────────────────────────────
  getSecret(id) {
    const s = this.secrets.get(id);
    if (!s) return null;
    return {
      id: s.id,
      name: s.name,
      source: s.source,
      envVar: s.envVar,
      status: this._computeStatus(s),
      expiresAt: s.expiresAt,
      expiresIn: s.expiresAt ? this._timeUntil(s.expiresAt) : "never",
      refreshable: s.refreshable,
      lastRefreshed: s.lastRefreshed,
      lastChecked: s.lastChecked,
      dependents: s.dependents,
      tags: s.tags,
      meta: s.meta,
    };
  }

  // ─── Get All (masked) ──────────────────────────────────────────
  getAll() {
    return [...this.secrets.entries()].map(([id]) => this.getSecret(id));
  }

  // ─── Get Alerts (expired + expiring soon) ───────────────────────
  getAlerts() {
    const alerts = [];
    for (const [id, s] of this.secrets) {
      const status = this._computeStatus(s);
      if (status === "expired") {
        alerts.push({ level: "critical", id, name: s.name, message: `EXPIRED at ${s.expiresAt}`, expiresAt: s.expiresAt, refreshable: s.refreshable });
      } else if (status === "expiring_soon") {
        alerts.push({ level: "warning", id, name: s.name, message: `Expires in ${this._timeUntil(s.expiresAt)}`, expiresAt: s.expiresAt, refreshable: s.refreshable });
      } else if (status === "missing") {
        alerts.push({ level: "error", id, name: s.name, message: `Secret not set (env: ${s.envVar})`, refreshable: false });
      }
    }
    return alerts.sort((a, b) => {
      const order = { critical: 0, error: 1, warning: 2 };
      return (order[a.level] || 3) - (order[b.level] || 3);
    });
  }

  // ─── Get Audit Log ──────────────────────────────────────────────
  getAuditLog(limit = 50) {
    return this.auditLog.slice(-limit);
  }

  // ─── Start Background Checker ───────────────────────────────────
  startMonitor(intervalMs) {
    if (this.intervalId) clearInterval(this.intervalId);
    this.checkIntervalMs = intervalMs || this.checkIntervalMs;
    this.intervalId = setInterval(() => this.checkAll(), this.checkIntervalMs);
    this.checkAll(); // immediate first check
  }

  stopMonitor() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // ─── Force Refresh ──────────────────────────────────────────────
  async forceRefresh(id) {
    const s = this.secrets.get(id);
    if (!s) return { error: `Secret '${id}' not found` };
    if (!s.refreshable || !s.refreshFn) return { error: `Secret '${id}' is not auto-refreshable` };
    try {
      const result = await s.refreshFn(s);
      if (result && result.expiresAt) {
        s.expiresAt = result.expiresAt;
        s.lastRefreshed = new Date().toISOString();
        s.status = this._computeStatus(s);
        this._audit(id, "force_refreshed", `Manually refreshed. New expiry: ${result.expiresAt}`);
        this._saveState();
        return { ok: true, id, newExpiry: result.expiresAt, status: s.status };
      }
      return { error: "Refresh returned no expiry" };
    } catch (err) {
      this._audit(id, "force_refresh_failed", err.message);
      return { error: err.message };
    }
  }

  // ─── Internal: Compute Status ───────────────────────────────────
  _computeStatus(s) {
    // Check if the secret value actually exists
    if (s.envVar && !process.env[s.envVar]) {
      // For file-based secrets, don't check envVar
      if (!s.filePath) return "missing";
    }
    if (!s.expiresAt) return "valid"; // no expiry = permanent
    const now = Date.now();
    const exp = new Date(s.expiresAt).getTime();
    if (isNaN(exp)) return "unknown";
    if (now >= exp) return "expired";
    if (exp - now <= this.warnBeforeMs) return "expiring_soon";
    return "valid";
  }

  // ─── Internal: Human-readable time until ────────────────────────
  _timeUntil(isoStr) {
    const diff = new Date(isoStr).getTime() - Date.now();
    if (diff <= 0) return "expired";
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ${mins % 60}m`;
    const days = Math.floor(hrs / 24);
    return `${days}d ${hrs % 24}h`;
  }

  // ─── Internal: Audit ────────────────────────────────────────────
  _audit(id, action, message) {
    this.auditLog.push({ ts: new Date().toISOString(), id, action, message });
    if (this.auditLog.length > 500) this.auditLog = this.auditLog.slice(-250);
  }

  // ─── Internal: Persist ──────────────────────────────────────────
  _saveState() {
    try {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
      const state = {};
      for (const [id, s] of this.secrets) {
        state[id] = {
          expiresAt: s.expiresAt,
          lastRefreshed: s.lastRefreshed,
          lastChecked: s.lastChecked,
          status: s.status,
          meta: s.meta,
        };
      }
      fs.writeFileSync(STATE_FILE, JSON.stringify({ state, audit: this.auditLog.slice(-100), ts: new Date().toISOString() }, null, 2));
    } catch { /* silent */ }
  }

  _loadState() {
    try {
      if (!fs.existsSync(STATE_FILE)) return;
      const data = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      if (data.audit) this.auditLog = data.audit;
      // state is restored after secrets are re-registered
      this._savedState = data.state || {};
    } catch { /* silent */ }
  }

  restoreState() {
    if (!this._savedState) return;
    for (const [id, saved] of Object.entries(this._savedState)) {
      const s = this.secrets.get(id);
      if (s) {
        if (saved.expiresAt) s.expiresAt = saved.expiresAt;
        if (saved.lastRefreshed) s.lastRefreshed = saved.lastRefreshed;
        if (saved.lastChecked) s.lastChecked = saved.lastChecked;
        if (saved.meta) s.meta = { ...s.meta, ...saved.meta };
        s.status = this._computeStatus(s);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// Singleton
// ═══════════════════════════════════════════════════════════════════
const secretsManager = new SecretsManager();

// ═══════════════════════════════════════════════════════════════════
// Express Route Registration
// ═══════════════════════════════════════════════════════════════════
function registerSecretsRoutes(app) {
  // Status overview
  app.get("/api/secrets/status", (req, res) => {
    res.json({ ok: true, ...secretsManager.getSummary() });
  });

  // All secrets (masked)
  app.get("/api/secrets", (req, res) => {
    const tag = req.query.tag;
    let secrets = secretsManager.getAll();
    if (tag) secrets = secrets.filter(s => s.tags.includes(tag));
    res.json({ ok: true, secrets, ts: new Date().toISOString() });
  });

  // Single secret info
  app.get("/api/secrets/:id", (req, res) => {
    const info = secretsManager.getSecret(req.params.id);
    if (!info) return res.status(404).json({ error: `Secret '${req.params.id}' not found` });
    res.json({ ok: true, ...info });
  });

  // Alerts (expired + expiring soon)
  app.get("/api/secrets/alerts", (req, res) => {
    res.json({ ok: true, alerts: secretsManager.getAlerts(), ts: new Date().toISOString() });
  });

  // Force check all
  app.post("/api/secrets/check", async (req, res) => {
    const results = await secretsManager.checkAll();
    res.json({ ok: true, results, alerts: secretsManager.getAlerts(), ts: new Date().toISOString() });
  });

  // Force refresh a specific secret
  app.post("/api/secrets/:id/refresh", async (req, res) => {
    const result = await secretsManager.forceRefresh(req.params.id);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  });

  // Audit log
  app.get("/api/secrets/audit", (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    res.json({ ok: true, log: secretsManager.getAuditLog(limit) });
  });

  // Manually update expiry (for secrets rotated outside Heady)
  app.post("/api/secrets/:id/expiry", (req, res) => {
    const { expiresAt } = req.body;
    if (!expiresAt) return res.status(400).json({ error: "expiresAt required" });
    const result = secretsManager.updateExpiry(req.params.id, expiresAt);
    if (!result) return res.status(404).json({ error: `Secret '${req.params.id}' not found` });
    res.json({ ok: true, id: req.params.id, expiresAt, status: result.status });
  });
}

module.exports = { secretsManager, registerSecretsRoutes };
