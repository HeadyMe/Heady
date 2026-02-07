/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  ResourceHealthBar.jsx - Compact resource health indicator     ║
 * ║  Shows CPU, RAM, GPU status with color-coded bars and          ║
 * ║  severity-aware animations per the Resource Management Protocol║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { Cpu, MemoryStick, HardDrive, Zap, AlertTriangle } from "lucide-react";

const RESOURCE_ICONS = {
  cpu: Cpu,
  ram: MemoryStick,
  disk: HardDrive,
  gpu: Zap,
};

const SEVERITY_COLORS = {
  healthy: "bg-heady-emerald",
  soft: "bg-heady-cyan",
  hard: "bg-heady-amber",
  critical: "bg-red-500",
};

const SEVERITY_TEXT = {
  healthy: "text-heady-emerald",
  soft: "text-heady-cyan",
  hard: "text-heady-amber",
  critical: "text-red-400",
};

function getSeverity(percent, soft = 70, hard = 85) {
  if (percent >= hard) return "critical";
  if (percent >= soft + (hard - soft) / 2) return "hard";
  if (percent >= soft) return "soft";
  return "healthy";
}

function ResourceBar({ label, icon: Icon, percent, soft, hard, unit, absolute, capacity }) {
  const severity = getSeverity(percent, soft, hard);
  const barColor = SEVERITY_COLORS[severity];
  const textColor = SEVERITY_TEXT[severity];
  const isCritical = severity === "critical";

  return (
    <div className="flex items-center gap-2 group">
      <div className={`flex-shrink-0 ${textColor} ${isCritical ? "animate-pulse" : ""}`}>
        <Icon size={12} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[9px] font-medium text-heady-muted uppercase tracking-wider">
            {label}
          </span>
          <span className={`text-[9px] font-bold ${textColor}`}>
            {percent}%
            {absolute != null && capacity != null && (
              <span className="text-heady-muted/60 font-normal ml-1">
                {absolute}/{capacity} {unit}
              </span>
            )}
          </span>
        </div>
        <div className="h-1 rounded-full bg-heady-border/40 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor} ${isCritical ? "animate-pulse" : ""}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ResourceHealthBar({ resourceData, compact = false, onClick }) {
  if (!resourceData) return null;

  const { cpu, ram, disk, gpu, safeMode } = resourceData;

  const hasWarning = (cpu?.currentPercent >= 75) || (ram?.currentPercent >= 70);
  const hasCritical = (cpu?.currentPercent >= 90) || (ram?.currentPercent >= 85);

  if (compact) {
    const worstPercent = Math.max(cpu?.currentPercent || 0, ram?.currentPercent || 0);
    const severity = getSeverity(worstPercent, 70, 85);
    const dotColor = SEVERITY_COLORS[severity].replace("bg-", "bg-");

    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px]
          bg-heady-border/30 hover:bg-heady-border/50 border border-heady-border/40
          hover:border-heady-cyan/30 transition-all cursor-pointer"
        title={`CPU: ${cpu?.currentPercent || 0}% | RAM: ${ram?.currentPercent || 0}%`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor} ${hasCritical ? "animate-pulse" : ""}`} />
        <span className="text-heady-muted">
          {safeMode ? "Safe Mode" : hasCritical ? "Critical" : hasWarning ? "Constrained" : "Healthy"}
        </span>
      </button>
    );
  }

  return (
    <div
      className={`
        rounded-xl p-3 space-y-2
        bg-heady-bg/40 border transition-colors
        ${hasCritical
          ? "border-red-500/30"
          : hasWarning
            ? "border-heady-amber/20"
            : "border-heady-border/30"
        }
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-heady-text/70 uppercase tracking-wider">
          Resource Health
        </span>
        {safeMode && (
          <span className="flex items-center gap-1 text-[9px] font-bold text-heady-amber">
            <AlertTriangle size={10} />
            Safe Mode
          </span>
        )}
      </div>

      {cpu && (
        <ResourceBar
          label="CPU" icon={Cpu}
          percent={cpu.currentPercent}
          soft={75} hard={90}
          unit={cpu.unit} absolute={null} capacity={null}
        />
      )}

      {ram && (
        <ResourceBar
          label="RAM" icon={MemoryStick}
          percent={ram.currentPercent}
          soft={70} hard={85}
          unit="MB" absolute={ram.absoluteValue} capacity={ram.capacity}
        />
      )}

      {disk && disk.capacity > 0 && (
        <ResourceBar
          label="Disk" icon={HardDrive}
          percent={disk.currentPercent}
          soft={80} hard={92}
          unit="GB" absolute={disk.absoluteValue} capacity={disk.capacity}
        />
      )}

      {gpu && gpu.compute && (
        <ResourceBar
          label="GPU" icon={Zap}
          percent={gpu.compute.currentPercent}
          soft={75} hard={90}
          unit="%" absolute={null} capacity={null}
        />
      )}

      {gpu && gpu.vram && (
        <ResourceBar
          label="VRAM" icon={Zap}
          percent={gpu.vram.currentPercent}
          soft={70} hard={85}
          unit="MB" absolute={gpu.vram.absoluteValue} capacity={gpu.vram.capacity}
        />
      )}
    </div>
  );
}
