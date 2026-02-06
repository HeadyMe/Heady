/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  CollapsedPill.jsx - Compact floating pill widget state        ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import React from "react";
import SacredAvatar from "./SacredAvatar";
import SuggestionChips from "./SuggestionChips";

const STATUS_LABEL = {
  idle: "Ready",
  listening: "Listening…",
  thinking: "Thinking…",
  success: "Done!",
  error: "Retrying…",
};

export default function CollapsedPill({ status, onExpand, onSuggestion, resourceData }) {
  const resStatus = getResourceStatus(resourceData);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
      {/* Suggestion chips float above the pill */}
      <div className="mb-2 flex justify-end">
        <SuggestionChips onSelect={onSuggestion} compact />
      </div>

      {/* The pill itself */}
      <button
        onClick={onExpand}
        className="
          glass glow-cyan rounded-full
          flex items-center gap-3 px-4 py-2.5
          border border-heady-border hover:border-heady-cyan/40
          shadow-xl cursor-pointer
          transition-all duration-300 hover:scale-105
          focus:outline-none focus:ring-2 focus:ring-heady-cyan/30
        "
      >
        <SacredAvatar status={status} size={32} />

        <div className="flex flex-col items-start">
          <span className="text-[11px] font-bold text-heady-cyan tracking-wide uppercase">
            HeadyBuddy
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-heady-muted">
              {STATUS_LABEL[status] || "Ready"}
            </span>
            {resStatus && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${resStatus.dot} ${resStatus.pulse ? "animate-pulse" : ""}`}
                title={resStatus.title}
              />
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

function getResourceStatus(data) {
  if (!data) return null;
  const cpu = data.cpu?.currentPercent || 0;
  const ram = data.ram?.currentPercent || 0;
  const worst = Math.max(cpu, ram);
  if (worst >= 85) return { dot: "bg-red-400", pulse: true, title: `CPU ${cpu}% RAM ${ram}%` };
  if (worst >= 70) return { dot: "bg-heady-amber", pulse: false, title: `CPU ${cpu}% RAM ${ram}%` };
  return { dot: "bg-heady-emerald", pulse: false, title: `CPU ${cpu}% RAM ${ram}%` };
}
