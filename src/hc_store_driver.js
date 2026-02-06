/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                    ║
 * ║  ━━━━━━━━━━━━━━                                                   ║
 * ║  ∞ Sacred Geometry Architecture ∞                                 ║
 * ║                                                                   ║
 * ║  hc_store_driver.js - Store/Driver Layer                          ║
 * ║  Long-term memory, pattern catalog, execution logs, node registry ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const MEMORY_DIR = path.join(__dirname, "..", ".heady-memory");
const LOGS_PATH = path.join(MEMORY_DIR, "execution_logs.json");
const INVENTORY_PATH = path.join(MEMORY_DIR, "inventory", "catalog.json");

// ─── Execution Log Store ────────────────────────────────────────────
function loadLogs() {
  try { return JSON.parse(fs.readFileSync(LOGS_PATH, "utf8")); }
  catch { return { logs: [], metadata: { created: new Date().toISOString() } }; }
}

function saveLogs(data) {
  fs.mkdirSync(path.dirname(LOGS_PATH), { recursive: true });
  // Keep only last 10000 logs to prevent unbounded growth
  if (data.logs.length > 10000) {
    data.logs = data.logs.slice(-10000);
  }
  fs.writeFileSync(LOGS_PATH, JSON.stringify(data, null, 2), "utf8");
}

function logExecution({ task_id, pattern_id, prompt_id, node_id, trace_id, action, inputs, outputs, latency_ms, cost, quality_score, error }) {
  const store = loadLogs();
  const entry = {
    id: uuidv4(),
    trace_id: trace_id || uuidv4(),
    task_id: task_id || null,
    pattern_id: pattern_id || null,
    prompt_id: prompt_id || null,
    node_id: node_id || null,
    action: action || "unknown",
    inputs_summary: typeof inputs === "string" ? inputs.slice(0, 500) : JSON.stringify(inputs || {}).slice(0, 500),
    outputs_summary: typeof outputs === "string" ? outputs.slice(0, 500) : JSON.stringify(outputs || {}).slice(0, 500),
    latency_ms: latency_ms || null,
    cost: cost || null,
    quality_score: quality_score || null,
    error: error || null,
    success: !error,
    ts: new Date().toISOString(),
  };
  store.logs.push(entry);
  saveLogs(store);
  return entry;
}

// ─── Inventory / Pattern Catalog Store ──────────────────────────────
function loadInventory() {
  try { return JSON.parse(fs.readFileSync(INVENTORY_PATH, "utf8")); }
  catch { return { patterns: [], metadata: { created: new Date().toISOString() } }; }
}

function saveInventory(data) {
  fs.mkdirSync(path.dirname(INVENTORY_PATH), { recursive: true });
  fs.writeFileSync(INVENTORY_PATH, JSON.stringify(data, null, 2), "utf8");
}

function registerPattern({ name, category, problem, context, solution, steps, roles, benefits, tradeoffs, failure_modes, success_indicators }) {
  const store = loadInventory();
  const pattern = {
    id: uuidv4(),
    name: name || "unnamed-pattern",
    category: category || "general",
    problem: problem || "",
    context: context || "",
    solution: solution || "",
    structure: {
      steps: Array.isArray(steps) ? steps : [],
      roles: Array.isArray(roles) ? roles : [],
    },
    consequences: {
      benefits: Array.isArray(benefits) ? benefits : [],
      tradeoffs: Array.isArray(tradeoffs) ? tradeoffs : [],
      known_failure_modes: Array.isArray(failure_modes) ? failure_modes : [],
    },
    metrics: {
      success_indicators: Array.isArray(success_indicators) ? success_indicators : [],
      usage_count: 0,
      avg_quality_score: null,
    },
    version: "1.0.0",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  store.patterns.push(pattern);
  saveInventory(store);
  return pattern;
}

// ─── Query Helpers ──────────────────────────────────────────────────
function queryLogs({ task_id, pattern_id, node_id, action, limit = 100, since }) {
  const store = loadLogs();
  let logs = store.logs;
  if (task_id) logs = logs.filter(l => l.task_id === task_id);
  if (pattern_id) logs = logs.filter(l => l.pattern_id === pattern_id);
  if (node_id) logs = logs.filter(l => l.node_id === node_id);
  if (action) logs = logs.filter(l => l.action === action);
  if (since) logs = logs.filter(l => l.ts >= since);
  return logs.slice(-limit);
}

function getPerformanceReport() {
  const store = loadLogs();
  const logs = store.logs;
  if (logs.length === 0) return { total: 0, message: "No execution logs yet" };

  const successCount = logs.filter(l => l.success).length;
  const avgLatency = logs.filter(l => l.latency_ms).reduce((sum, l) => sum + l.latency_ms, 0) / (logs.filter(l => l.latency_ms).length || 1);

  // Per-node breakdown
  const nodeStats = {};
  for (const log of logs) {
    const nid = log.node_id || "unknown";
    if (!nodeStats[nid]) nodeStats[nid] = { calls: 0, errors: 0, total_latency: 0 };
    nodeStats[nid].calls++;
    if (!log.success) nodeStats[nid].errors++;
    if (log.latency_ms) nodeStats[nid].total_latency += log.latency_ms;
  }
  for (const [nid, stats] of Object.entries(nodeStats)) {
    stats.avg_latency_ms = Math.round(stats.total_latency / stats.calls);
    stats.error_rate = (stats.errors / stats.calls).toFixed(4);
    delete stats.total_latency;
  }

  return {
    total_executions: logs.length,
    success_rate: (successCount / logs.length).toFixed(4),
    avg_latency_ms: Math.round(avgLatency),
    node_breakdown: nodeStats,
    oldest_log: logs[0]?.ts,
    newest_log: logs[logs.length - 1]?.ts,
    ts: new Date().toISOString(),
  };
}

function registerStoreRoutes(app) {
  // ── Execution Logs ──
  app.get("/api/store/logs", (req, res) => {
    const logs = queryLogs({
      task_id: req.query.task_id,
      pattern_id: req.query.pattern_id,
      node_id: req.query.node_id,
      action: req.query.action,
      limit: Number(req.query.limit) || 100,
      since: req.query.since,
    });
    res.json({ total: logs.length, logs, ts: new Date().toISOString() });
  });

  app.post("/api/store/logs", (req, res) => {
    const entry = logExecution(req.body);
    res.status(201).json(entry);
  });

  app.get("/api/store/performance", (req, res) => {
    res.json(getPerformanceReport());
  });

  // ── Pattern Catalog (inventory) ──
  app.get("/api/store/patterns", (req, res) => {
    const store = loadInventory();
    let patterns = store.patterns;
    if (req.query.category) patterns = patterns.filter(p => p.category === req.query.category);
    if (req.query.status) patterns = patterns.filter(p => p.status === req.query.status);
    res.json({ total: patterns.length, patterns, ts: new Date().toISOString() });
  });

  app.get("/api/store/patterns/:id", (req, res) => {
    const store = loadInventory();
    const pattern = store.patterns.find(p => p.id === req.params.id);
    if (!pattern) return res.status(404).json({ error: `Pattern '${req.params.id}' not found` });
    res.json(pattern);
  });

  app.post("/api/store/patterns", (req, res) => {
    const pattern = registerPattern(req.body);
    res.status(201).json(pattern);
  });

  // ── Health ──
  app.get("/api/store/health", (req, res) => {
    const logsExist = fs.existsSync(LOGS_PATH);
    const inventoryExist = fs.existsSync(INVENTORY_PATH);
    res.json({
      ok: true,
      stores: {
        execution_logs: logsExist ? "available" : "empty",
        pattern_catalog: inventoryExist ? "available" : "empty",
      },
      memory_dir: MEMORY_DIR,
      ts: new Date().toISOString(),
    });
  });
}

module.exports = { registerStoreRoutes, logExecution, registerPattern, queryLogs, getPerformanceReport };
