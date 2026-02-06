/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  SuggestionChips.jsx - Context-aware suggestion buttons        ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import React from "react";
import {
  Sparkles,
  ClipboardList,
  Code2,
  Calendar,
  FileText,
} from "lucide-react";

const DEFAULT_SUGGESTIONS = [
  { label: "Plan my day", icon: Calendar, prompt: "Help me plan my day — what should I focus on?" },
  { label: "Summarize this", icon: FileText, prompt: "Summarize the content I'm currently looking at." },
  { label: "Turn into tasks", icon: ClipboardList, prompt: "Turn the selected text into an actionable task list." },
  { label: "Open HeadyAutoIDE", icon: Code2, prompt: "Open HeadyAutoIDE and help me start a project." },
  { label: "Surprise me", icon: Sparkles, prompt: "Suggest something useful I can do right now." },
];

export default function SuggestionChips({
  suggestions = DEFAULT_SUGGESTIONS,
  onSelect,
  compact = false,
  maxChips = 5,
}) {
  const items = suggestions.slice(0, compact ? 3 : maxChips);

  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "" : "px-1"}`}>
      {items.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.label}
            onClick={() => onSelect(s.prompt)}
            className="
              flex items-center gap-1.5 px-3 py-1.5
              rounded-full text-xs font-medium
              bg-heady-border/60 text-heady-text/80
              hover:bg-heady-cyan/15 hover:text-heady-cyan
              border border-heady-border hover:border-heady-cyan/30
              transition-all duration-200 cursor-pointer
              focus:outline-none focus:ring-1 focus:ring-heady-cyan/40
            "
          >
            {Icon && <Icon size={13} className="opacity-70" />}
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
