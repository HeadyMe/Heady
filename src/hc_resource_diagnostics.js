/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  hc_resource_diagnostics.js — Resource Allocation Diagnostics  ║
 * ║  Analyzes resource usage patterns, identifies bottlenecks,     ║
 * ║  and generates actionable fix recommendations.                 ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

const os = require("os");

// ─── DIAGNOSTIC CATEGORIES ──────────────────────────────────────────────

const DIAG_CATEGORY = {
  CPU_SATURATION: "cpu_saturation",
  RAM_PRESSURE: "ram_pressure",
  GPU_UNDERUSE: "gpu_underuse",
  GPU_OVERUSE: "gpu_overuse",
  DISK_IO: "disk_io",
  QUEUE_BACKLOG: "queue_backlog",
  TIER_MISMATCH: "tier_mismatch",
  SERIAL_BOTTLENECK: "serial_bottleneck",
  CACHE_MISS: "cache_miss",
  DB_CONTENTION: "db_contention",
};

const SEVERITY = { LOW: "low", MEDIUM: "medium", HIGH: "high", CRITICAL: "critical" };

// ─── DIAGNOSTIC FINDING ─────────────────────────────────────────────────

function createFinding(category, severity, title, description, fixes) {
  return {
    category,
    severity,
    title,
    description,
    fixes: fixes.map((f, i) => ({
      id: `fix_${category}_${i}`,
      action: f.action,
      impact: f.impact,
      effort: f.effort || "low",
      immediate: f.immediate || false,
      configChange: f.configChange || null,
    })),
    ts: new Date().toISOString(),
  };
}

// ─── DIAGNOSTIC ENGINE ──────────────────────────────────────────────────

class HCResourceDiagnostics {
  constructor(options = {}) {
    this.resourceManager = options.resourceManager || null;
    this.taskScheduler = options.taskScheduler || null;
    this.lastDiagnosis = null;
  }

  /**
   * Run a full diagnostic sweep and return structured findings + recommendations.
   */
  diagnose() {
    const findings = [];
    const snapshot = this.resourceManager ? this.resourceManager.getSnapshot() : this._fallbackSnapshot();
    const events = this.resourceManager ? this.resourceManager.getRecentEvents(50) : [];
    const schedulerStatus = this.taskScheduler ? this.taskScheduler.getStatus() : null;

    // 1. CPU analysis
    findings.push(...this._diagnoseCPU(snapshot, events));

    // 2. RAM analysis
    findings.push(...this._diagnoseRAM(snapshot, events));

    // 3. GPU analysis
    findings.push(...this._diagnoseGPU(snapshot));

    // 4. Disk analysis
    findings.push(...this._diagnoseDisk(snapshot));

    // 5. Queue/scheduler analysis
    if (schedulerStatus) {
      findings.push(...this._diagnoseScheduler(schedulerStatus));
    }

    // 6. Tier routing analysis
    if (this.taskScheduler) {
      findings.push(...this._diagnoseTierUsage());
    }

    // 7. Pattern analysis from event history
    findings.push(...this._diagnosePatterns(events));

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    findings.sort((a, b) => (severityOrder[a.severity] || 3) - (severityOrder[b.severity] || 3));

    const diagnosis = {
      ok: findings.filter(f => f.severity === "critical" || f.severity === "high").length === 0,
      totalFindings: findings.length,
      critical: findings.filter(f => f.severity === "critical").length,
      high: findings.filter(f => f.severity === "high").length,
      medium: findings.filter(f => f.severity === "medium").length,
      low: findings.filter(f => f.severity === "low").length,
      findings,
      quickWins: this._extractQuickWins(findings),
      systemProfile: this._buildSystemProfile(snapshot, schedulerStatus),
      ts: new Date().toISOString(),
    };

    this.lastDiagnosis = diagnosis;
    return diagnosis;
  }

  // ─── CPU Diagnostics ──────────────────────────────────────────────

  _diagnoseCPU(snapshot, events) {
    const findings = [];
    const cpu = snapshot.cpu;
    if (!cpu) return findings;

    if (cpu.currentPercent >= 90) {
      const recentCritical = events.filter(e => e.resourceType === "CPU" && e.severity === "CRITICAL");
      findings.push(createFinding(
        DIAG_CATEGORY.CPU_SATURATION, SEVERITY.CRITICAL,
        "CPU Saturated",
        `CPU at ${cpu.currentPercent}% across ${cpu.capacity} cores. ${recentCritical.length} critical events in recent history. Interactive tasks will lag.`,
        [
          { action: "Pause background/training jobs immediately", impact: "Frees CPU for interactive tasks", immediate: true },
          { action: "Lower batch concurrency from current to 1", impact: "Reduces context switching and CPU contention", immediate: true,
            configChange: { endpoint: "/api/scheduler/concurrency", body: { taskClass: "batch", limit: 1 } } },
          { action: "Move heavy Arena/Monte Carlo runs to off-peak hours", impact: "Prevents CPU spikes during active work", effort: "medium" },
          { action: "Enable safe mode to halt non-essential workloads", impact: "Maximum CPU relief", immediate: true,
            configChange: { endpoint: "/api/scheduler/safe-mode", body: { enabled: true } } },
        ]
      ));
    } else if (cpu.currentPercent >= 75) {
      findings.push(createFinding(
        DIAG_CATEGORY.CPU_SATURATION, SEVERITY.MEDIUM,
        "CPU Under Pressure",
        `CPU at ${cpu.currentPercent}%. Approaching soft threshold. Background jobs may be competing with interactive work.`,
        [
          { action: "Reduce batch concurrency to 1", impact: "Frees headroom for interactive tasks", immediate: true,
            configChange: { endpoint: "/api/scheduler/concurrency", body: { taskClass: "batch", limit: 1 } } },
          { action: "Downgrade non-critical tasks to S-tier models", impact: "Less compute per task", effort: "low" },
        ]
      ));
    }

    return findings;
  }

  // ─── RAM Diagnostics ──────────────────────────────────────────────

  _diagnoseRAM(snapshot, events) {
    const findings = [];
    const ram = snapshot.ram;
    if (!ram) return findings;

    if (ram.currentPercent >= 85) {
      const topContributors = events
        .filter(e => e.resourceType === "RAM" && e.contributors && e.contributors.length > 0)
        .flatMap(e => e.contributors)
        .sort((a, b) => (b.ramMB || 0) - (a.ramMB || 0))
        .slice(0, 5);

      const contribText = topContributors.length > 0
        ? `Top consumers: ${topContributors.map(c => `${c.description} (${c.ramMB}MB)`).join(", ")}`
        : "Run contributor detection for detailed breakdown.";

      findings.push(createFinding(
        DIAG_CATEGORY.RAM_PRESSURE, SEVERITY.CRITICAL,
        "RAM Critical — OOM Risk",
        `RAM at ${ram.currentPercent}% (${ram.absoluteValue}MB / ${ram.capacity}MB). ${contribText}. System may swap or OOM-kill processes.`,
        [
          { action: "Enable safe mode — halt all non-essential workloads", impact: "Immediate RAM relief", immediate: true,
            configChange: { endpoint: "/api/scheduler/safe-mode", body: { enabled: true } } },
          { action: "Force garbage collection on Node.js processes", impact: "Reclaims JS heap memory", immediate: true },
          { action: "Reduce training concurrency to 0", impact: "Training jobs are largest RAM consumers", immediate: true,
            configChange: { endpoint: "/api/scheduler/concurrency", body: { taskClass: "training", limit: 0 } } },
          { action: "Close unnecessary browser tabs and desktop apps", impact: "Frees system RAM outside Heady", effort: "low" },
          { action: "Add Redis caching with TTLs to avoid repeated large computations in memory", impact: "Long-term RAM reduction", effort: "high" },
        ]
      ));
    } else if (ram.currentPercent >= 70) {
      findings.push(createFinding(
        DIAG_CATEGORY.RAM_PRESSURE, SEVERITY.MEDIUM,
        "RAM Elevated",
        `RAM at ${ram.currentPercent}% (${ram.absoluteValue}MB / ${ram.capacity}MB). Soft threshold reached.`,
        [
          { action: "Reduce batch concurrency", impact: "Each concurrent task consumes RAM", immediate: true },
          { action: "Implement request-scoped memory limits for workers", impact: "Prevents runaway allocations", effort: "medium" },
        ]
      ));
    }

    return findings;
  }

  // ─── GPU Diagnostics ──────────────────────────────────────────────

  _diagnoseGPU(snapshot) {
    const findings = [];
    const gpu = snapshot.gpu;

    if (!gpu) {
      findings.push(createFinding(
        DIAG_CATEGORY.GPU_UNDERUSE, SEVERITY.LOW,
        "No GPU Detected",
        "No NVIDIA GPU found. All compute runs on CPU. This is fine for development but limits ML inference throughput.",
        [
          { action: "No action needed for development", impact: "N/A" },
          { action: "Deploy GPU-heavy jobs to cloud workers with GPU instances", impact: "Offloads ML inference", effort: "high" },
        ]
      ));
      return findings;
    }

    if (gpu.compute && gpu.compute.currentPercent < 10 && gpu.vram && gpu.vram.currentPercent < 20) {
      findings.push(createFinding(
        DIAG_CATEGORY.GPU_UNDERUSE, SEVERITY.MEDIUM,
        "GPU Underutilized",
        `GPU compute at ${gpu.compute.currentPercent}%, VRAM at ${gpu.vram.currentPercent}%. GPU is idle while CPU may be overloaded.`,
        [
          { action: "Route ML inference and embedding tasks to GPU", impact: "Offloads CPU, uses idle GPU capacity", effort: "medium" },
          { action: "Batch small GPU tasks together for throughput", impact: "Better GPU utilization", effort: "medium" },
        ]
      ));
    }

    if (gpu.vram && gpu.vram.currentPercent >= 85) {
      findings.push(createFinding(
        DIAG_CATEGORY.GPU_OVERUSE, SEVERITY.HIGH,
        "GPU VRAM Near Capacity",
        `GPU VRAM at ${gpu.vram.currentPercent}% (${gpu.vram.absoluteValue}MB / ${gpu.vram.capacity}MB). Risk of OOM on GPU.`,
        [
          { action: "Use mixed precision / quantized models", impact: "Halves VRAM per model", effort: "medium" },
          { action: "Queue GPU jobs instead of running all concurrently", impact: "Prevents VRAM overflow", immediate: true },
          { action: "Consolidate models — unload unused models from VRAM", impact: "Frees VRAM immediately", immediate: true },
        ]
      ));
    }

    return findings;
  }

  // ─── Disk Diagnostics ─────────────────────────────────────────────

  _diagnoseDisk(snapshot) {
    const findings = [];
    const disk = snapshot.disk;
    if (!disk || disk.capacity === 0) return findings;

    if (disk.currentPercent >= 90) {
      findings.push(createFinding(
        DIAG_CATEGORY.DISK_IO, SEVERITY.HIGH,
        "Disk Nearly Full",
        `Disk at ${disk.currentPercent}% (${disk.absoluteValue}GB / ${disk.capacity}GB). Builds, logs, and DB writes will fail.`,
        [
          { action: "Clean build artifacts and old logs", impact: "Immediate disk relief", immediate: true },
          { action: "Rotate and compress log files", impact: "Reduces disk usage over time", effort: "low" },
          { action: "Move large datasets to external/cloud storage", impact: "Permanent disk relief", effort: "high" },
        ]
      ));
    }

    return findings;
  }

  // ─── Scheduler Diagnostics ────────────────────────────────────────

  _diagnoseScheduler(status) {
    const findings = [];
    const totalQueued = status.queues.interactive + status.queues.batch + status.queues.training;
    const totalRunning = status.running.interactive + status.running.batch + status.running.training;

    if (totalQueued > 10) {
      findings.push(createFinding(
        DIAG_CATEGORY.QUEUE_BACKLOG, SEVERITY.HIGH,
        "Large Task Backlog",
        `${totalQueued} tasks queued (${status.queues.interactive} interactive, ${status.queues.batch} batch, ${status.queues.training} training). Only ${totalRunning} running. Tasks are waiting too long.`,
        [
          { action: "Increase batch concurrency if CPU allows", impact: "Drains queue faster",
            configChange: { endpoint: "/api/scheduler/concurrency", body: { taskClass: "batch", limit: 4 } } },
          { action: "Cancel low-priority queued tasks", impact: "Reduces queue pressure", immediate: true },
          { action: "Implement task deduplication to skip redundant work", impact: "Fewer tasks overall", effort: "medium" },
        ]
      ));
    }

    if (status.stats.avgWaitMs > 5000) {
      findings.push(createFinding(
        DIAG_CATEGORY.SERIAL_BOTTLENECK, SEVERITY.MEDIUM,
        "High Average Wait Time",
        `Tasks wait ${Math.round(status.stats.avgWaitMs / 1000)}s on average before execution starts. Indicates serial bottleneck or under-provisioned concurrency.`,
        [
          { action: "Review task dependencies — parallelize independent subtasks", impact: "Reduces total elapsed time", effort: "medium" },
          { action: "Use parallel groups for independent work", impact: "Better throughput", effort: "low" },
        ]
      ));
    }

    return findings;
  }

  // ─── Tier Usage Diagnostics ───────────────────────────────────────

  _diagnoseTierUsage() {
    const findings = [];
    const recent = this.taskScheduler.getRecentCompleted(50);
    if (recent.length < 5) return findings;

    const lTierTrivial = recent.filter(t =>
      t.tier === "L" && (t.type === "classify" || t.type === "route" || t.type === "summarize" || t.type === "documentation")
    );

    if (lTierTrivial.length > 3) {
      findings.push(createFinding(
        DIAG_CATEGORY.TIER_MISMATCH, SEVERITY.MEDIUM,
        "L-Tier Models Used for Trivial Tasks",
        `${lTierTrivial.length} recent tasks of type [${[...new Set(lTierTrivial.map(t => t.type))].join(", ")}] ran on L-tier. These should use S or M tier.`,
        [
          { action: "Update tier routing config to force S-tier for classify/route/summarize/documentation", impact: "Significant cost and resource savings", effort: "low" },
          { action: "Review DEFAULT_TIER_ROUTING in hc_task_scheduler.js", impact: "Prevents future mis-routing", effort: "low" },
        ]
      ));
    }

    const sTierCritical = recent.filter(t =>
      t.tier === "S" && (t.type === "arena_evaluate" || t.type === "security_scan") && t.status === "failed"
    );

    if (sTierCritical.length > 0) {
      findings.push(createFinding(
        DIAG_CATEGORY.TIER_MISMATCH, SEVERITY.HIGH,
        "Critical Tasks Failing on S-Tier",
        `${sTierCritical.length} critical tasks (arena_evaluate, security_scan) failed on S-tier. These need higher-tier models.`,
        [
          { action: "Ensure arena_evaluate and security_scan route to L-tier minimum", impact: "Prevents quality degradation", effort: "low" },
        ]
      ));
    }

    return findings;
  }

  // ─── Event Pattern Diagnostics ────────────────────────────────────

  _diagnosePatterns(events) {
    const findings = [];
    if (events.length < 5) return findings;

    // Check for repeated same-type critical events
    const criticalByType = {};
    for (const e of events) {
      if (e.severity === "CRITICAL") {
        criticalByType[e.resourceType] = (criticalByType[e.resourceType] || 0) + 1;
      }
    }

    for (const [type, count] of Object.entries(criticalByType)) {
      if (count >= 3) {
        findings.push(createFinding(
          DIAG_CATEGORY.CPU_SATURATION, SEVERITY.HIGH,
          `Recurring ${type} Critical Events`,
          `${count} critical ${type} events in recent history. This is a persistent issue, not a transient spike.`,
          [
            { action: "Review and tighten resource policies for this resource type", impact: "Prevents recurring crises", effort: "medium" },
            { action: "Consider adding capacity or offloading work to remote workers", impact: "Structural fix", effort: "high" },
          ]
        ));
      }
    }

    return findings;
  }

  // ─── Quick Wins Extraction ────────────────────────────────────────

  _extractQuickWins(findings) {
    const wins = [];
    for (const f of findings) {
      for (const fix of f.fixes) {
        if (fix.immediate && (f.severity === "critical" || f.severity === "high")) {
          wins.push({
            title: fix.action,
            impact: fix.impact,
            severity: f.severity,
            configChange: fix.configChange || null,
          });
        }
      }
    }
    return wins.slice(0, 5);
  }

  // ─── System Profile ───────────────────────────────────────────────

  _buildSystemProfile(snapshot, schedulerStatus) {
    return {
      platform: process.platform,
      arch: process.arch,
      cpuCores: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || "unknown",
      totalMemMB: Math.round(os.totalmem() / (1024 * 1024)),
      freeMemMB: Math.round(os.freemem() / (1024 * 1024)),
      nodeUptime: Math.round(process.uptime()),
      heapUsedMB: Math.round(process.memoryUsage().heapUsed / (1024 * 1024)),
      heapTotalMB: Math.round(process.memoryUsage().heapTotal / (1024 * 1024)),
      gpuAvailable: !!(snapshot.gpu),
      schedulerActive: !!schedulerStatus,
      safeModeActive: schedulerStatus?.safeModeActive || false,
    };
  }

  // ─── Fallback when no resource manager is available ───────────────

  _fallbackSnapshot() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    return {
      cpu: { currentPercent: 0, capacity: os.cpus().length, unit: "cores" },
      ram: {
        currentPercent: Math.round(((totalMem - freeMem) / totalMem) * 100),
        absoluteValue: Math.round((totalMem - freeMem) / (1024 * 1024)),
        capacity: Math.round(totalMem / (1024 * 1024)),
        unit: "MB",
      },
      disk: { currentPercent: 0, absoluteValue: 0, capacity: 0, unit: "GB" },
      gpu: null,
    };
  }
}

// ─── EXPRESS ROUTES ─────────────────────────────────────────────────────

function registerDiagnosticRoutes(app, diagnostics) {
  app.get("/api/resources/diagnose", (_req, res) => {
    const diagnosis = diagnostics.diagnose();
    res.json(diagnosis);
  });

  app.get("/api/resources/quick-wins", (_req, res) => {
    const diagnosis = diagnostics.lastDiagnosis || diagnostics.diagnose();
    res.json({ ok: true, quickWins: diagnosis.quickWins, ts: diagnosis.ts });
  });

  app.get("/api/resources/system-profile", (_req, res) => {
    const diagnosis = diagnostics.lastDiagnosis || diagnostics.diagnose();
    res.json({ ok: true, profile: diagnosis.systemProfile, ts: diagnosis.ts });
  });
}

// ─── EXPORTS ────────────────────────────────────────────────────────────

module.exports = {
  HCResourceDiagnostics,
  registerDiagnosticRoutes,
  DIAG_CATEGORY,
};
