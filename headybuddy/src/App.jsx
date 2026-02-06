/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  App.jsx - HeadyBuddy Root Component                           ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from "react";
import CollapsedPill from "./components/CollapsedPill";
import MainWidget from "./components/MainWidget";

const HEADY_API = import.meta.env.VITE_HEADY_API || "http://localhost:3300";

export default function App() {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | listening | thinking | success | error

  const handleSend = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = { role: "user", content: text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setStatus("thinking");

    try {
      const res = await fetch(`${HEADY_API}/api/buddy/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: messages.slice(-10) }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);

      const data = await res.json();
      const assistantMsg = {
        role: "assistant",
        content: data.reply || data.message || "I'm here to help!",
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      const errMsg = {
        role: "assistant",
        content: `Connection issue — I'll keep trying. (${err.message})`,
        ts: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [messages]);

  const handleSuggestion = useCallback((chip) => {
    handleSend(chip);
  }, [handleSend]);

  if (!expanded) {
    return (
      <CollapsedPill
        status={status}
        onExpand={() => setExpanded(true)}
        onSuggestion={handleSuggestion}
      />
    );
  }

  return (
    <MainWidget
      status={status}
      messages={messages}
      onSend={handleSend}
      onCollapse={() => setExpanded(false)}
      onSuggestion={handleSuggestion}
    />
  );
}
