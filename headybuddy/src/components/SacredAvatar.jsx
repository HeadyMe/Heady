/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  SacredAvatar.jsx - Animated avatar reflecting buddy state     ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import React from "react";

const STATE_COLORS = {
  idle: "#22d3ee",
  listening: "#a78bfa",
  thinking: "#c084fc",
  success: "#34d399",
  error: "#fbbf24",
};

const STATE_ANIM = {
  idle: "animate-breathe",
  listening: "animate-pulse-slow",
  thinking: "animate-spin-slow",
  success: "",
  error: "animate-pulse",
};

export default function SacredAvatar({ status = "idle", size = 40 }) {
  const color = STATE_COLORS[status] || STATE_COLORS.idle;
  const anim = STATE_ANIM[status] || "";
  const r = size / 2;

  return (
    <div
      className={`relative flex items-center justify-center ${anim}`}
      style={{ width: size, height: size }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
        }}
      />

      {/* Sacred geometry hexagon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer hexagon */}
        <polygon
          points="24,2 44,14 44,34 24,46 4,34 4,14"
          stroke={color}
          strokeWidth="1.5"
          fill={`${color}11`}
          strokeLinejoin="round"
        />
        {/* Inner triangle up */}
        <polygon
          points="24,10 36,30 12,30"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.6"
        />
        {/* Inner triangle down */}
        <polygon
          points="24,38 12,18 36,18"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        {/* Center dot */}
        <circle cx="24" cy="24" r="3" fill={color} opacity="0.9" />
      </svg>
    </div>
  );
}
