/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  ChatMessage.jsx - Single message bubble in conversation       ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import React from "react";
import SacredAvatar from "./SacredAvatar";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-2.5 animate-fade-in ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <SacredAvatar
            status={message.isError ? "error" : "idle"}
            size={24}
          />
        </div>
      )}

      <div
        className={`
          max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed
          ${
            isUser
              ? "bg-heady-cyan/15 text-heady-text rounded-br-md"
              : message.isError
                ? "bg-heady-amber/10 text-heady-amber/90 border border-heady-amber/20 rounded-bl-md"
                : "bg-heady-surface text-heady-text/90 border border-heady-border/40 rounded-bl-md"
          }
        `}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    </div>
  );
}
