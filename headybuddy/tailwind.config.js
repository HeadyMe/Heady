/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        heady: {
          bg: "#0a0e17",
          surface: "#111827",
          border: "#1e293b",
          cyan: "#22d3ee",
          emerald: "#34d399",
          amber: "#fbbf24",
          magenta: "#c084fc",
          text: "#e2e8f0",
          muted: "#64748b",
        },
      },
      borderRadius: {
        sacred: "1.25rem",
      },
      animation: {
        breathe: "breathe 4s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
