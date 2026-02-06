/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  hc_resource_manager.js - Intelligent Resource Management      ║
 * ║  Monitors local resources, classifies events, applies          ║
 * ║  mitigation policies, and escalates to HeadyBuddy when needed. ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

const os = require("os");
const fs = require("fs");
const path = require("path");
const { EventEmitter } = require("events");
const { execSync } = require("child_process");

// ─── RESOURCE TYPES & SEVERITY ─────────────────────────────────────────────

const RESOURCE_TYPES = [
  "CPU", "RAM", "DISK", "GPU_COMPUTE", "GPU_VRAM", "NETWORK", "LOCAL_DB",
];

const SEVERITY = { INFO: "INFO", WARN_SOFT: "WARN_SOFT", WARN_HARD: "WARN_HARD", CRITICAL: "CRITICAL" };
const TREND    = { RISING: "RISING", FALLING: "FALLING", STABLE: "STABLE", UNKNOWN: "UNKNOWN" };

// ─── DEFAULT THRESHOLDS ────────────────────────────────────────────────────

const DEFAULT_THRESHOLDS = {
  CPU:         { softPercent: 75, hardPercent: 90, windowSec: 30 },
  RAM:         { softPercent: 70, hardPercent: 85, windowSec: 15 },
  DISK:        { softPercent: 80, hardPercent: 92, windowSec: 60 },
  GPU_COMPUTE: { softPercent: 75, hardPercent: 90, windowSec: 15 },
  GPU_VRAM:    { softPercent: 70, hardPercent: 85, windowSec: 10 },
  NETWORK:     { softPercent: 70, hardPercent: 90, windowSec: 30 },
  LOCAL_DB:    { softPercent: 75, hardPercent: 90, windowSec: 60 },
};

// ─── RESOURCE USAGE EVENT ──────────────────────────────────────────────────

let eventCounter = 0;

function createResourceUsageEvent(resourceType, usage, thresholds, contributors = []) {
  const eventId = `res_${Date.now()}_${++eventCounter}`;
  const severity = classifySeverity(usage.currentPercent, thresholds);

  return {
    eventId,
    resourceType,
    severity,
    currentUsagePercent: usage.currentPercent,
    currentUsageAbsolute: usage.absoluteValue,
    capacityAbsolute: usage.capacity,
    thresholdSoftPercent: thresholds.softPercent,
    thresholdHardPercent: thresholds.hardPercent,
    timeWindowSeconds: thresholds.windowSec,
    trend: TREND.UNKNOWN,
    contributors,
    timestamp: new Date().toISOString(),
    hostId: os.hostname(),
    environment: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
    sloImpact: {
      interactiveAtRisk: severity === SEVERITY.WARN_HARD || severity === SEVERITY.CRITICAL,
      criticalPipelinesAtRisk: severity === SEVERITY.CRITICAL,
      backgroundJobsAtRisk: severity !== SEVERITY.INFO,
    },
    observabilityLinks: {},
  };
}

function classifySeverity(percent, thresholds) {
  if (percent >= thresholds.hardPercent) return SEVERITY.CRITICAL;
  if (percent >= thresholds.softPercent + ((thresholds.hardPercent - thresholds.softPercent) / 2))
    return SEVERITY.WARN_HARD;
  if (percent >= thresholds.softPercent) return SEVERITY.WARN_SOFT;
  return SEVERITY.INFO;
}

// ─── RESOURCE COLLECTORS ───────────────────────────────────────────────────

function collectCPU() {
  const cpus = os.cpus();
  let totalIdle = 0, totalTick = 0;
  for (const cpu of cpus) {
    for (const type in cpu.times) totalTick += cpu.times[type];
    totalIdle += cpu.times.idle;
  }
  const percent = Math.round(((totalTick - totalIdle) / totalTick) * 100);
  return {
    currentPercent: Math.min(percent, 100),
    absoluteValue: cpus.length - (totalIdle / totalTick * cpus.length),
    capacity: cpus.length,
    unit: "cores",
  };
}

function collectRAM() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const percent = Math.round((usedMem / totalMem) * 100);
  return {
    currentPercent: percent,
    absoluteValue: Math.round(usedMem / (1024 * 1024)),
    capacity: Math.round(totalMem / (1024 * 1024)),
    unit: "MB",
  };
}

function collectDisk() {
  try {
    if (process.platform === "win32") {
      // PowerShell fallback (wmic is deprecated on modern Windows)
      const out = execSync(
        'powershell -NoProfile -Command "Get-PSDrive C | Select-Object Used,Free | ConvertTo-Json"',
        { timeout: 8000, encoding: "utf-8" }
      );
      const info = JSON.parse(out.trim());
      const used = info.Used || 0;
      const free = info.Free || 0;
      const total = used + free;
      if (total > 0) {
        return {
          currentPercent: Math.round((used / total) * 100),
          absoluteValue: Math.round(used / (1024 * 1024 * 1024)),
          capacity: Math.round(total / (1024 * 1024 * 1024)),
          unit: "GB",
        };
      }
    } else {
      const out = execSync("df -k / | tail -1", { timeout: 5000, encoding: "utf-8" });
      const parts = out.trim().split(/\s+/);
      const total = parseInt(parts[1], 10) * 1024;
      const used = parseInt(parts[2], 10) * 1024;
      if (total > 0) {
        return {
          currentPercent: Math.round((used / total) * 100),
          absoluteValue: Math.round(used / (1024 * 1024 * 1024)),
          capacity: Math.round(total / (1024 * 1024 * 1024)),
          unit: "GB",
        };
      }
    }
  } catch (_) { /* fall through */ }
  return { currentPercent: 0, absoluteValue: 0, capacity: 0, unit: "GB" };
}

function collectGPU() {
  try {
    const out = execSync(
      "nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits",
      { timeout: 5000, encoding: "utf-8" }
    );
    const parts = out.trim().split(",").map(s => parseFloat(s.trim()));
    return {
      compute: { currentPercent: parts[0] || 0, absoluteValue: parts[0] || 0, capacity: 100, unit: "%" },
      vram: {
        currentPercent: parts[2] > 0 ? Math.round((parts[1] / parts[2]) * 100) : 0,
        absoluteValue: Math.round(parts[1] || 0),
        capacity: Math.round(parts[2] || 0),
        unit: "MB",
      },
    };
  } catch (_) {
    return null;
  }
}

// ─── TREND CALCULATOR ──────────────────────────────────────────────────────

class TrendTracker {
  constructor(windowSize = 6) {
    this.history = {};
    this.windowSize = windowSize;
  }

  record(resourceType, percent) {
    if (!this.history[resourceType]) this.history[resourceType] = [];
    this.history[resourceType].push({ percent, ts: Date.now() });
    if (this.history[resourceType].length > this.windowSize * 2)
      this.history[resourceType] = this.history[resourceType].slice(-this.windowSize);
  }

  getTrend(resourceType) {
    const h = this.history[resourceType];
    if (!h || h.length < 3) return TREND.UNKNOWN;
    const recent = h.slice(-3);
    const diffs = [];
    for (let i = 1; i < recent.length; i++) diffs.push(recent[i].percent - recent[i - 1].percent);
    const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    if (avgDiff > 2) return TREND.RISING;
    if (avgDiff < -2) return TREND.FALLING;
    return TREND.STABLE;
  }
}

// ─── PROCESS CONTRIBUTOR DETECTION ─────────────────────────────────────────

function detectTopContributors() {
  const contributors = [];
  try {
    if (process.platform === "win32") {
      const out = execSync(
        'powershell -NoProfile -Command "Get-Process | Sort-Object CPU -Descending | Select-Object -First 5 Id,ProcessName,CPU,WorkingSet64 | ConvertTo-Json"',
        { timeout: 8000, encoding: "utf-8" }
      );
      const procs = JSON.parse(out);
      const arr = Array.isArray(procs) ? procs : [procs];
      for (const p of arr) {
        if (!p) continue;
        contributors.push({
          taskId: null,
          planId: null,
          nodeId: null,
          processId: String(p.Id),
          description: `${p.ProcessName} (PID ${p.Id})`,
          estimatedUsagePercent: 0,
          cpuSeconds: Math.round(p.CPU || 0),
          ramMB: Math.round((p.WorkingSet64 || 0) / (1024 * 1024)),
        });
      }
    }
  } catch (_) { /* non-critical */ }
  return contributors;
}

// ─── MITIGATION ENGINE ─────────────────────────────────────────────────────

const MITIGATION_ACTIONS = {
  lower_batch_concurrency: {
    label: "Lower batch concurrency",
    execute: (ctx) => { ctx.emit("mitigation:concurrency_lowered"); return true; },
  },
  reduce_model_tiers_noncritical: {
    label: "Reduce model tiers for non-critical agents",
    execute: (ctx) => { ctx.emit("mitigation:model_tier_reduced"); return true; },
  },
  pause_low_priority_batch: {
    label: "Pause low-priority batch jobs",
    execute: (ctx) => { ctx.emit("mitigation:batch_paused"); return true; },
  },
  guarantee_interactive_responsiveness: {
    label: "Guarantee interactive responsiveness",
    execute: (ctx) => { ctx.emit("mitigation:interactive_protected"); return true; },
  },
  pause_all_nonessential_pipelines: {
    label: "Pause all non-essential pipelines",
    execute: (ctx) => { ctx.emit("mitigation:pipelines_paused"); return true; },
  },
  apply_safe_mode_profile: {
    label: "Apply safe mode profile",
    execute: (ctx) => { ctx.emit("mitigation:safe_mode_activated"); return true; },
  },
  terminate_runaway_processes: {
    label: "Terminate runaway processes",
    execute: (ctx) => { ctx.emit("mitigation:runaway_terminated"); return true; },
  },
  force_garbage_collection: {
    label: "Force garbage collection",
    execute: (ctx) => {
      if (global.gc) { global.gc(); ctx.emit("mitigation:gc_forced"); return true; }
      return false;
    },
  },
};

// ─── POLICY ENGINE ─────────────────────────────────────────────────────────

const SEVERITY_POLICIES = {
  [SEVERITY.INFO]: { actions: [], userPrompt: false },
  [SEVERITY.WARN_SOFT]: {
    actions: ["lower_batch_concurrency", "reduce_model_tiers_noncritical"],
    userPrompt: false,
  },
  [SEVERITY.WARN_HARD]: {
    actions: ["guarantee_interactive_responsiveness", "pause_low_priority_batch"],
    userPrompt: false,
    escalateIfPersistent: true,
  },
  [SEVERITY.CRITICAL]: {
    actions: ["pause_all_nonessential_pipelines", "apply_safe_mode_profile", "force_garbage_collection"],
    userPrompt: true,
  },
};

// ─── RESOURCE MANAGER ──────────────────────────────────────────────────────

class HCResourceManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...options.thresholds };
    this.pollInterval = options.pollIntervalMs || 5000;
    this.trendTracker = new TrendTracker(options.trendWindow || 6);
    this.eventLog = [];
    this.mitigationLog = [];
    this.userChoiceLog = [];
    this.timer = null;
    this.safeMode = false;
    this.latestSnapshot = {};
    this.logFile = options.logFile || path.join(process.cwd(), "logs", "resource-events.jsonl");
  }

  start() {
    console.log("[HCResourceManager] Starting resource monitoring (poll: %dms)", this.pollInterval);
    this._poll();
    this.timer = setInterval(() => this._poll(), this.pollInterval);
    return this;
  }

  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    console.log("[HCResourceManager] Stopped.");
  }

  getSnapshot() {
    return { ...this.latestSnapshot, safeMode: this.safeMode, ts: new Date().toISOString() };
  }

  getRecentEvents(limit = 20) {
    return this.eventLog.slice(-limit);
  }

  recordUserChoice(eventId, choiceId) {
    this.userChoiceLog.push({ eventId, choiceId, ts: new Date().toISOString() });
    this.emit("user_choice", { eventId, choiceId });
  }

  _poll() {
    const cpu  = collectCPU();
    const ram  = collectRAM();
    const disk = collectDisk();
    const gpu  = collectGPU();

    this.latestSnapshot = { cpu, ram, disk, gpu };

    this._processResource("CPU", cpu);
    this._processResource("RAM", ram);
    if (disk.capacity > 0) this._processResource("DISK", disk);
    if (gpu) {
      this._processResource("GPU_COMPUTE", gpu.compute);
      this._processResource("GPU_VRAM", gpu.vram);
    }
  }

  _processResource(type, usage) {
    const th = this.thresholds[type];
    if (!th) return;

    this.trendTracker.record(type, usage.currentPercent);

    const event = createResourceUsageEvent(type, usage, th);
    event.trend = this.trendTracker.getTrend(type);

    if (event.severity === SEVERITY.INFO) return;

    if (event.severity === SEVERITY.WARN_HARD || event.severity === SEVERITY.CRITICAL) {
      event.contributors = detectTopContributors();
    }

    this.eventLog.push(event);
    if (this.eventLog.length > 500) this.eventLog = this.eventLog.slice(-250);

    this._persistEvent(event);
    this._applyMitigation(event);
    this.emit("resource_event", event);
  }

  _applyMitigation(event) {
    const policy = SEVERITY_POLICIES[event.severity];
    if (!policy) return;

    const actionsApplied = [];
    for (const actionId of policy.actions) {
      const action = MITIGATION_ACTIONS[actionId];
      if (action) {
        const ok = action.execute(this);
        actionsApplied.push({ actionId, label: action.label, success: ok });
      }
    }

    const record = {
      eventId: event.eventId,
      severity: event.severity,
      resourceType: event.resourceType,
      actionsApplied,
      userPromptRequired: policy.userPrompt,
      ts: new Date().toISOString(),
    };
    this.mitigationLog.push(record);
    if (this.mitigationLog.length > 200) this.mitigationLog = this.mitigationLog.slice(-100);

    if (policy.userPrompt) {
      this.emit("escalation_required", {
        event,
        mitigationRecord: record,
        options: [
          { id: "recommended", label: "Recommended", description: "Pause low-priority jobs, protect IDE and core tasks", isDefault: true },
          { id: "risky", label: "Continue All", description: "Accept risk of slowness and OOM errors", isDefault: false },
          { id: "conservative", label: "Safe Mode", description: "Stop all non-essential workloads until usage < 70%", isDefault: false },
          { id: "manual", label: "Manual Control", description: "Show detailed job list for manual decisions", isDefault: false },
        ],
      });
    }
  }

  _persistEvent(event) {
    try {
      const dir = path.dirname(this.logFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(this.logFile, JSON.stringify(event) + "\n");
    } catch (_) { /* non-critical */ }
  }
}

// ─── EXPRESS ROUTES ────────────────────────────────────────────────────────

function registerRoutes(app, manager) {
  app.get("/api/resources/snapshot", (_req, res) => {
    res.json(manager.getSnapshot());
  });

  app.get("/api/resources/events", (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 20;
    res.json(manager.getRecentEvents(limit));
  });

  app.get("/api/resources/health", (_req, res) => {
    const snap = manager.getSnapshot();
    const status = manager.safeMode ? "safe_mode"
      : (snap.ram && snap.ram.currentPercent > 85) || (snap.cpu && snap.cpu.currentPercent > 90)
        ? "constrained" : "healthy";
    res.json({
      status,
      safeMode: manager.safeMode,
      cpu: snap.cpu,
      ram: snap.ram,
      disk: snap.disk,
      gpu: snap.gpu,
      ts: snap.ts,
    });
  });

  app.post("/api/resources/user-choice", (req, res) => {
    const { eventId, choiceId } = req.body || {};
    if (!eventId || !choiceId) return res.status(400).json({ error: "eventId and choiceId required" });
    manager.recordUserChoice(eventId, choiceId);
    res.json({ ok: true, eventId, choiceId });
  });
}

// ─── EXPORTS ───────────────────────────────────────────────────────────────

module.exports = {
  HCResourceManager,
  registerRoutes,
  RESOURCE_TYPES,
  SEVERITY,
  TREND,
  DEFAULT_THRESHOLDS,
  createResourceUsageEvent,
  classifySeverity,
};
