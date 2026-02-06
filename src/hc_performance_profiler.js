/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  hc_performance_profiler.js - On-Demand Diagnostic Engine      ║
 * ║  Time-to-complete tracking, anti-pattern detection,            ║
 * ║  self-optimization, and structured diagnostic reports.         ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

const os = require("os");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { EventEmitter } = require("events");

const DIAGNOSTICS_LOG = path.join(process.cwd(), "logs", "diagnostics.jsonl");
const OPTIMIZATION_LOG = path.join(process.cwd(), "logs", "self-optimization.jsonl");
const METRICS_STORE = path.join(process.cwd(), ".heady_cache", "perf_metrics.json");
const MAX_METRIC_ENTRIES = 2000;
const BASELINE_WINDOW_DAYS = 7;

// ─── METRIC STORE ───────────────────────────────────────────────────────────

let _metricsCache = null;

function loadMetrics() {
  if (_metricsCache) return _metricsCache;
  try {
    if (fs.existsSync(METRICS_STORE)) {
      _metricsCache = JSON.parse(fs.readFileSync(METRICS_STORE, "utf8"));
    } else {
      _metricsCache = { entries: [], baselines: {} };
    }
  } catch (_) {
    _metricsCache = { entries: [], baselines: {} };
  }
  return _metricsCache;
}

function saveMetrics() {
  try {
    const dir = path.dirname(METRICS_STORE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(METRICS_STORE, JSON.stringify(_metricsCache, null, 2), "utf8");
  } catch (_) { /* non-fatal */ }
}

// ─── TIME-TO-COMPLETE TRACKER ───────────────────────────────────────────────

class OperationTimer {
  constructor() {
    this.active = new Map();
  }

  start(operationId, operationType, metadata = {}) {
    this.active.set(operationId, {
      operationType,
      startedAt: Date.now(),
      metadata,
    });
    return operationId;
  }

  finish(operationId, result = "success") {
    const op = this.active.get(operationId);
    if (!op) return null;
    this.active.delete(operationId);

    const durationMs = Date.now() - op.startedAt;
    const entry = {
      id: operationId,
      operation: op.operationType,
      durationMs,
      result,
      metadata: op.metadata,
      ts: new Date().toISOString(),
    };

    recordMetric(entry);
    return entry;
  }

  getActive() {
    const result = [];
    for (const [id, op] of this.active) {
      result.push({
        id,
        operation: op.operationType,
        runningMs: Date.now() - op.startedAt,
        metadata: op.metadata,
      });
    }
    return result;
  }
}

function recordMetric(entry) {
  const metrics = loadMetrics();
  metrics.entries.push(entry);

  // Evict old entries
  if (metrics.entries.length > MAX_METRIC_ENTRIES) {
    metrics.entries = metrics.entries.slice(-MAX_METRIC_ENTRIES);
  }

  saveMetrics();
}

// ─── BASELINE COMPUTATION ───────────────────────────────────────────────────

function computeBaselines() {
  const metrics = loadMetrics();
  const cutoff = Date.now() - (BASELINE_WINDOW_DAYS * 86400000);
  const recent = metrics.entries.filter(e => new Date(e.ts).getTime() > cutoff);

  const grouped = {};
  for (const entry of recent) {
    const key = entry.operation;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry.durationMs);
  }

  const baselines = {};
  for (const [op, durations] of Object.entries(grouped)) {
    durations.sort((a, b) => a - b);
    const len = durations.length;
    baselines[op] = {
      count: len,
      medianMs: durations[Math.floor(len / 2)] || 0,
      p95Ms: durations[Math.floor(len * 0.95)] || 0,
      meanMs: Math.round(durations.reduce((a, b) => a + b, 0) / len),
      minMs: durations[0] || 0,
      maxMs: durations[len - 1] || 0,
    };
  }

  metrics.baselines = baselines;
  saveMetrics();
  return baselines;
}

function detectRegressions(thresholdPercent = 50) {
  const metrics = loadMetrics();
  const baselines = metrics.baselines || {};
  const cutoff = Date.now() - 3600000; // last hour
  const recent = metrics.entries.filter(e => new Date(e.ts).getTime() > cutoff);

  const regressions = [];
  const grouped = {};
  for (const entry of recent) {
    if (!grouped[entry.operation]) grouped[entry.operation] = [];
    grouped[entry.operation].push(entry.durationMs);
  }

  for (const [op, durations] of Object.entries(grouped)) {
    const baseline = baselines[op];
    if (!baseline || baseline.count < 3) continue;

    const recentMedian = durations.sort((a, b) => a - b)[Math.floor(durations.length / 2)];
    const deviation = ((recentMedian - baseline.medianMs) / baseline.medianMs) * 100;

    if (deviation > thresholdPercent) {
      regressions.push({
        operation: op,
        baselineMedianMs: baseline.medianMs,
        currentMedianMs: recentMedian,
        deviationPercent: Math.round(deviation),
        sampleCount: durations.length,
        severity: deviation > 200 ? "critical" : deviation > 100 ? "high" : "moderate",
      });
    }
  }

  return regressions.sort((a, b) => b.deviationPercent - a.deviationPercent);
}

// ─── ANTI-PATTERN DETECTOR ──────────────────────────────────────────────────

function detectAntiPatterns(resourceManager, pipelineState) {
  const detected = [];
  const snap = resourceManager ? resourceManager.getSnapshot() : {};

  // Heavy work on gateway
  if (snap.cpu && snap.cpu.currentPercent > 80) {
    detected.push({
      id: "heavy_work_on_gateway",
      description: "heady-manager CPU high — heavy work should be delegated to workers",
      severity: "high",
      metric: `CPU at ${snap.cpu.currentPercent}%`,
      fix: "Move CPU-bound tasks to python-worker or worker_threads",
    });
  }

  // Repeated expensive operations (check cache hit rate)
  if (pipelineState && pipelineState.metrics) {
    const { cachedTasks, completedTasks } = pipelineState.metrics;
    if (completedTasks > 5 && cachedTasks / completedTasks < 0.2) {
      detected.push({
        id: "repeated_expensive_operations",
        description: "Task cache hit rate below 20% — many tasks re-computed unnecessarily",
        severity: "moderate",
        metric: `Cache hit rate: ${Math.round((cachedTasks / completedTasks) * 100)}%`,
        fix: "Increase cache TTL or review config hash stability",
      });
    }
  }

  // Unbounded parallelism
  if (snap.cpu && snap.cpu.capacity) {
    const cpuCores = snap.cpu.capacity;
    if (pipelineState && pipelineState.metrics && pipelineState.metrics.totalTasks > cpuCores * 2) {
      detected.push({
        id: "unbounded_parallelism",
        description: `Running ${pipelineState.metrics.totalTasks} tasks with only ${cpuCores} CPU cores`,
        severity: "moderate",
        metric: `${pipelineState.metrics.totalTasks} tasks / ${cpuCores} cores`,
        fix: "Cap maxConcurrentTasks at CPU count",
      });
    }
  }

  // RAM pressure
  if (snap.ram && snap.ram.currentPercent > 85) {
    detected.push({
      id: "ram_pressure",
      description: "RAM usage critical — risk of OOM and swap thrashing",
      severity: "critical",
      metric: `RAM at ${snap.ram.currentPercent}% (${snap.ram.absoluteValue}/${snap.ram.capacity} MB)`,
      fix: "Pause non-essential jobs, force GC, reduce concurrent model loads",
    });
  }

  // GPU idle while tasks queued
  if (snap.gpu && snap.gpu.compute && snap.gpu.compute.currentPercent < 20) {
    if (pipelineState && pipelineState.metrics && pipelineState.metrics.totalTasks > 0) {
      detected.push({
        id: "gpu_underutilization",
        description: "GPU mostly idle while pipeline tasks are running — possible tier misuse",
        severity: "moderate",
        metric: `GPU compute at ${snap.gpu.compute.currentPercent}%`,
        fix: "Route appropriate tasks to GPU, check model tier assignments",
      });
    }
  }

  return detected;
}

// ─── DIAGNOSTIC REPORT GENERATOR ────────────────────────────────────────────

function generateDiagnosticReport(resourceManager, pipeline, storyDriver) {
  const reportId = `diag_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
  const ts = new Date().toISOString();

  // Phase 1: Resource Snapshot
  const resourceSnapshot = resourceManager ? resourceManager.getSnapshot() : {
    cpu: { currentPercent: 0, capacity: os.cpus().length },
    ram: {
      currentPercent: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
      absoluteValue: Math.round((os.totalmem() - os.freemem()) / (1024 * 1024)),
      capacity: Math.round(os.totalmem() / (1024 * 1024)),
    },
  };

  // Phase 2: Service Health
  const serviceHealth = {
    "heady-manager": { status: "up", latencyMs: 0 },
    "resource-manager": { status: resourceManager ? "up" : "not_loaded" },
    "story-driver": { status: storyDriver ? "up" : "not_loaded" },
    "pipeline-engine": { status: pipeline ? "up" : "not_loaded" },
  };

  // Phase 3: Pipeline Analysis
  let pipelineAnalysis = null;
  if (pipeline) {
    const state = pipeline.getState();
    const breakers = pipeline.getCircuitBreakers();
    pipelineAnalysis = {
      state: state ? state.status : "no_runs",
      currentStage: state ? state.currentStageId : null,
      metrics: state ? state.metrics : null,
      circuitBreakers: breakers,
      cacheStats: {
        hitRate: state && state.metrics && state.metrics.completedTasks > 0
          ? Math.round((state.metrics.cachedTasks / state.metrics.completedTasks) * 100) + "%"
          : "N/A",
      },
    };
  }

  // Phase 4: Anti-patterns
  const pipelineState = pipeline ? pipeline.getState() : null;
  const antiPatterns = detectAntiPatterns(resourceManager, pipelineState);

  // Phase 5: Regressions
  const regressions = detectRegressions();

  // Phase 6: Root causes
  const rootCauses = [];
  const cpuPct = resourceSnapshot.cpu?.currentPercent || 0;
  const ramPct = resourceSnapshot.ram?.currentPercent || 0;

  if (cpuPct > 90) rootCauses.push({ id: "cpu_saturation", severity: "critical", confidence: "high", metric: `CPU ${cpuPct}%` });
  else if (cpuPct > 75) rootCauses.push({ id: "cpu_saturation", severity: "moderate", confidence: "medium", metric: `CPU ${cpuPct}%` });

  if (ramPct > 85) rootCauses.push({ id: "ram_pressure", severity: "critical", confidence: "high", metric: `RAM ${ramPct}%` });
  else if (ramPct > 70) rootCauses.push({ id: "ram_pressure", severity: "moderate", confidence: "medium", metric: `RAM ${ramPct}%` });

  if (antiPatterns.length > 0) {
    for (const ap of antiPatterns) {
      if (!rootCauses.some(rc => rc.id === ap.id)) {
        rootCauses.push({ id: ap.id, severity: ap.severity, confidence: "medium", metric: ap.metric });
      }
    }
  }

  if (regressions.length > 0) {
    rootCauses.push({
      id: "performance_regression",
      severity: regressions[0].severity,
      confidence: "high",
      metric: `${regressions.length} operations regressed vs baseline`,
    });
  }

  if (pipelineAnalysis && pipelineAnalysis.metrics) {
    if (pipelineAnalysis.metrics.errorRate > 0.1) {
      rootCauses.push({
        id: "orchestration_inefficiency",
        severity: "moderate",
        confidence: "medium",
        metric: `Pipeline error rate: ${Math.round(pipelineAnalysis.metrics.errorRate * 100)}%`,
      });
    }
  }

  // Phase 7: Generate fast wins
  const fastWins = [];
  if (cpuPct > 75) {
    fastWins.push({ action: "Reduce pipeline concurrency from 8 to 4", impact: "~50% less peak CPU", effort: "config change" });
    fastWins.push({ action: "Pause non-critical background agents", impact: "~30% CPU freed", effort: "one command" });
  }
  if (ramPct > 70) {
    fastWins.push({ action: "Force garbage collection", impact: "Immediate RAM relief", effort: "one command" });
    fastWins.push({ action: "Clear task result cache", impact: "Free cached memory", effort: "one command" });
  }
  if (antiPatterns.some(ap => ap.id === "repeated_expensive_operations")) {
    fastWins.push({ action: "Increase task cache TTL to 2 hours", impact: "More cache hits", effort: "config change" });
  }
  if (rootCauses.some(rc => rc.id === "arena_mode_excess")) {
    fastWins.push({ action: "Reduce Arena trials to 5 per candidate", impact: "~75% Arena time savings", effort: "config change" });
  }

  // Generate summary
  const summaryParts = [];
  if (rootCauses.length === 0) {
    summaryParts.push("No significant performance issues detected.");
  } else {
    const critical = rootCauses.filter(rc => rc.severity === "critical");
    if (critical.length > 0) {
      summaryParts.push(`${critical.length} critical issue(s) found: ${critical.map(c => c.id.replace(/_/g, " ")).join(", ")}.`);
    }
    const moderate = rootCauses.filter(rc => rc.severity === "moderate" || rc.severity === "high");
    if (moderate.length > 0) {
      summaryParts.push(`${moderate.length} additional concern(s): ${moderate.map(c => c.id.replace(/_/g, " ")).join(", ")}.`);
    }
    if (fastWins.length > 0) {
      summaryParts.push(`${fastWins.length} fast win(s) available.`);
    }
  }

  const report = {
    reportId,
    ts,
    summary: summaryParts.join(" "),
    resourceSnapshot: {
      cpu: resourceSnapshot.cpu,
      ram: resourceSnapshot.ram,
      disk: resourceSnapshot.disk || null,
      gpu: resourceSnapshot.gpu || null,
      safeMode: resourceSnapshot.safeMode || false,
    },
    serviceHealth,
    pipelineAnalysis,
    rootCauses,
    antiPatterns,
    regressions,
    fastWins,
    architecturalFixes: rootCauses.map(rc => ({
      rootCause: rc.id,
      fixes: getArchitecturalFixes(rc.id),
    })).filter(f => f.fixes.length > 0),
  };

  // Persist
  persistDiagnosticReport(report);

  return report;
}

function getArchitecturalFixes(rootCauseId) {
  const fixes = {
    cpu_saturation: [
      "Offload CPU-bound tasks to dedicated worker pool",
      "Implement task deduplication to avoid redundant work",
      "Use worker_threads for parallel CPU computation",
    ],
    ram_pressure: [
      "Stream large datasets instead of buffering in memory",
      "Implement memory-bounded LRU caches",
      "Use worker_threads for memory isolation",
    ],
    gpu_contention: [
      "Implement GPU scheduler with VRAM budgeting",
      "Use mixed-precision inference for non-critical tasks",
      "Consolidate small GPU workloads into batches",
    ],
    orchestration_inefficiency: [
      "Enable parallel execution for independent pipeline stages",
      "Add request coalescing for identical concurrent API calls",
      "Use event-driven patterns instead of polling",
    ],
    performance_regression: [
      "Review recent config/code changes that correlate with slowdown",
      "Add regression tests for critical operation durations",
      "Implement automatic rollback on performance degradation",
    ],
    repeated_expensive_operations: [
      "Implement content-hash keyed caching for expensive computations",
      "Add memoization to frequently called pure functions",
    ],
    gpu_underutilization: [
      "Route GPU-suitable tasks to GPU instead of CPU",
      "Check model tier assignments match task complexity",
    ],
    heavy_work_on_gateway: [
      "Move computation to python-worker via Redis job queue",
      "Use worker_threads in heady-manager for CPU-bound routes",
    ],
  };
  return fixes[rootCauseId] || [];
}

function persistDiagnosticReport(report) {
  try {
    const dir = path.dirname(DIAGNOSTICS_LOG);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(DIAGNOSTICS_LOG, JSON.stringify(report) + "\n");
  } catch (_) { /* non-fatal */ }
}

// ─── AUTO-TUNE SUGGESTIONS ─────────────────────────────────────────────────

function generateAutoTuneSuggestions() {
  const metrics = loadMetrics();
  const baselines = metrics.baselines || {};
  const suggestions = [];

  // Check if pipeline tasks are slow
  if (baselines.pipeline_cycle) {
    if (baselines.pipeline_cycle.medianMs > 30000) {
      suggestions.push({
        parameter: "pipeline.global.maxConcurrentTasks",
        currentInferred: "8",
        suggested: "4",
        reason: `Pipeline cycles taking ${Math.round(baselines.pipeline_cycle.medianMs / 1000)}s median — reducing concurrency may help`,
      });
    }
  }

  // Check cache effectiveness
  if (baselines.task_execution) {
    const totalEntries = metrics.entries.filter(e => e.operation === "task_execution");
    const cachedEntries = totalEntries.filter(e => e.metadata && e.metadata.cached);
    if (totalEntries.length > 10 && cachedEntries.length / totalEntries.length < 0.3) {
      suggestions.push({
        parameter: "cache.ttlMs",
        currentInferred: "3600000",
        suggested: "7200000",
        reason: `Cache hit rate only ${Math.round((cachedEntries.length / totalEntries.length) * 100)}% — longer TTL may improve`,
      });
    }
  }

  return suggestions;
}

// ─── SELF-OPTIMIZATION REPORT ───────────────────────────────────────────────

function generateOptimizationReport() {
  const baselines = computeBaselines();
  const regressions = detectRegressions();
  const suggestions = generateAutoTuneSuggestions();

  const report = {
    ts: new Date().toISOString(),
    baselines,
    regressions,
    suggestions,
    metricsCount: loadMetrics().entries.length,
  };

  // Persist
  try {
    const dir = path.dirname(OPTIMIZATION_LOG);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(OPTIMIZATION_LOG, JSON.stringify(report) + "\n");
  } catch (_) { /* non-fatal */ }

  return report;
}

// ─── PERFORMANCE PROFILER (main class) ──────────────────────────────────────

class HCPerformanceProfiler extends EventEmitter {
  constructor() {
    super();
    this.timer = new OperationTimer();
    this.diagnosticHistory = [];
  }

  startOperation(operationType, metadata = {}) {
    const id = `op_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;
    return this.timer.start(id, operationType, metadata);
  }

  finishOperation(operationId, result = "success") {
    const entry = this.timer.finish(operationId, result);
    if (entry) this.emit("operation:complete", entry);
    return entry;
  }

  getActiveOperations() {
    return this.timer.getActive();
  }

  runDiagnostic(resourceManager, pipeline, storyDriver) {
    const report = generateDiagnosticReport(resourceManager, pipeline, storyDriver);
    this.diagnosticHistory.push({
      reportId: report.reportId,
      ts: report.ts,
      rootCauseCount: report.rootCauses.length,
      fastWinCount: report.fastWins.length,
    });
    if (this.diagnosticHistory.length > 50) {
      this.diagnosticHistory = this.diagnosticHistory.slice(-50);
    }
    this.emit("diagnostic:complete", report);
    return report;
  }

  getBaselines() {
    return computeBaselines();
  }

  getRegressions() {
    return detectRegressions();
  }

  getAntiPatterns(resourceManager, pipelineState) {
    return detectAntiPatterns(resourceManager, pipelineState);
  }

  getAutoTuneSuggestions() {
    return generateAutoTuneSuggestions();
  }

  getOptimizationReport() {
    return generateOptimizationReport();
  }

  getDiagnosticHistory() {
    return this.diagnosticHistory;
  }

  getMetricsSummary() {
    const metrics = loadMetrics();
    return {
      totalEntries: metrics.entries.length,
      baselines: Object.keys(metrics.baselines || {}).length,
      oldestEntry: metrics.entries.length > 0 ? metrics.entries[0].ts : null,
      newestEntry: metrics.entries.length > 0 ? metrics.entries[metrics.entries.length - 1].ts : null,
    };
  }
}

// ─── EXPRESS ROUTES ─────────────────────────────────────────────────────────

function registerProfilerRoutes(app, profiler, resourceManager, pipeline, storyDriver) {
  app.get("/api/diagnostics/run", (_req, res) => {
    try {
      const report = profiler.runDiagnostic(resourceManager, pipeline, storyDriver);
      res.json({ ok: true, ...report });
    } catch (err) {
      res.status(500).json({ error: "Diagnostic failed", message: err.message });
    }
  });

  app.get("/api/diagnostics/history", (_req, res) => {
    res.json({ ok: true, history: profiler.getDiagnosticHistory(), ts: new Date().toISOString() });
  });

  app.get("/api/diagnostics/baselines", (_req, res) => {
    try {
      const baselines = profiler.getBaselines();
      res.json({ ok: true, baselines, ts: new Date().toISOString() });
    } catch (err) {
      res.status(500).json({ error: "Baseline computation failed", message: err.message });
    }
  });

  app.get("/api/diagnostics/regressions", (_req, res) => {
    const regressions = profiler.getRegressions();
    res.json({ ok: true, regressions, count: regressions.length, ts: new Date().toISOString() });
  });

  app.get("/api/diagnostics/anti-patterns", (_req, res) => {
    const pipelineState = pipeline ? pipeline.getState() : null;
    const patterns = profiler.getAntiPatterns(resourceManager, pipelineState);
    res.json({ ok: true, antiPatterns: patterns, count: patterns.length, ts: new Date().toISOString() });
  });

  app.get("/api/diagnostics/suggestions", (_req, res) => {
    const suggestions = profiler.getAutoTuneSuggestions();
    res.json({ ok: true, suggestions, count: suggestions.length, ts: new Date().toISOString() });
  });

  app.get("/api/diagnostics/optimization-report", (_req, res) => {
    try {
      const report = profiler.getOptimizationReport();
      res.json({ ok: true, ...report });
    } catch (err) {
      res.status(500).json({ error: "Optimization report failed", message: err.message });
    }
  });

  app.get("/api/diagnostics/metrics-summary", (_req, res) => {
    res.json({ ok: true, ...profiler.getMetricsSummary(), ts: new Date().toISOString() });
  });

  app.get("/api/diagnostics/active-operations", (_req, res) => {
    res.json({ ok: true, operations: profiler.getActiveOperations(), ts: new Date().toISOString() });
  });
}

// ─── EXPORTS ────────────────────────────────────────────────────────────────

module.exports = {
  HCPerformanceProfiler,
  registerProfilerRoutes,
  OperationTimer,
  computeBaselines,
  detectRegressions,
  detectAntiPatterns,
  generateDiagnosticReport,
  generateAutoTuneSuggestions,
  generateOptimizationReport,
  recordMetric,
};
