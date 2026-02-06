/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  MainWidget.jsx - Expanded companion widget with chat          ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Send, Mic, Settings } from "lucide-react";
import SacredAvatar from "./SacredAvatar";
import SuggestionChips from "./SuggestionChips";
import ChatMessage from "./ChatMessage";

export default function MainWidget({
  status,
  messages,
  onSend,
  onCollapse,
  onSuggestion,
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onCollapse();
  };

  return (
    <div
      className="
        fixed bottom-6 right-6 z-[9999]
        w-[380px] max-h-[560px]
        flex flex-col
        glass glow-cyan rounded-sacred
        border border-heady-border
        shadow-2xl animate-slide-up
        overflow-hidden
      "
      onKeyDown={handleKeyDown}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-heady-border/60">
        <div className="flex items-center gap-2.5">
          <SacredAvatar status={status} size={28} />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-heady-cyan tracking-wide">
              HeadyBuddy
            </span>
            <span className="text-[10px] text-heady-muted leading-none">
              Perfect Day Companion
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {}}
            className="p-1.5 rounded-lg text-heady-muted hover:text-heady-text hover:bg-heady-border/40 transition-colors"
            title="Settings"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={onCollapse}
            className="p-1.5 rounded-lg text-heady-muted hover:text-heady-text hover:bg-heady-border/40 transition-colors"
            title="Collapse (Esc)"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* ── Chat Area ────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[200px] max-h-[360px]"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 gap-4">
            <SacredAvatar status="idle" size={56} />
            <div>
              <p className="text-sm font-medium text-heady-text">
                Hey! I'm HeadyBuddy.
              </p>
              <p className="text-xs text-heady-muted mt-1">
                Your perfect day AI companion. How can I help?
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
        )}
      </div>

      {/* ── Suggestions ──────────────────────────────────────── */}
      <div className="px-4 pb-2">
        <SuggestionChips onSelect={onSuggestion} maxChips={4} />
      </div>

      {/* ── Input ────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-heady-border/60"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything…"
          className="
            flex-1 bg-heady-bg/60 text-sm text-heady-text
            placeholder:text-heady-muted/60
            rounded-full px-4 py-2
            border border-heady-border focus:border-heady-cyan/40
            outline-none transition-colors
          "
        />
        <button
          type="button"
          className="p-2 rounded-full text-heady-muted hover:text-heady-cyan hover:bg-heady-border/40 transition-colors"
          title="Voice input"
        >
          <Mic size={16} />
        </button>
        <button
          type="submit"
          disabled={!input.trim()}
          className="
            p-2 rounded-full
            bg-heady-cyan/20 text-heady-cyan
            hover:bg-heady-cyan/30
            disabled:opacity-30 disabled:cursor-not-allowed
            transition-all
          "
          title="Send"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
