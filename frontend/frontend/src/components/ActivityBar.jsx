import {
  LayoutDashboard,
  Cpu,
  GitBranch,
  Container,
  Plug,
  Terminal,
  MessageCircle,
  Settings,
  Infinity,
} from "lucide-react";

const activities = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", color: "text-green-400" },
  { id: "nodes", icon: Cpu, label: "AI Nodes", color: "text-cyan-400" },
  { id: "pipeline", icon: GitBranch, label: "Pipeline", color: "text-purple-400" },
  { id: "docker", icon: Container, label: "Docker", color: "text-blue-400" },
  { id: "connections", icon: Plug, label: "Connections", color: "text-yellow-400" },
  { id: "terminal", icon: Terminal, label: "Terminal", color: "text-orange-400" },
  { id: "chat", icon: MessageCircle, label: "HeadyBuddy", color: "text-pink-400" },
];

export default function ActivityBar({ active, onSelect }) {
  return (
    <div className="w-12 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-2 gap-1 shrink-0">
      {/* Heady Logo */}
      <button
        onClick={() => onSelect("dashboard")}
        className="w-10 h-10 flex items-center justify-center mb-2 group"
        title="Heady Systems"
      >
        <Infinity className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors animate-pulse" />
      </button>

      <div className="w-6 h-px bg-gray-800 mb-1" />

      {activities.map((act) => {
        const Icon = act.icon;
        const isActive = active === act.id;
        return (
          <button
            key={act.id}
            onClick={() => onSelect(act.id)}
            title={act.label}
            className={`
              w-10 h-10 flex items-center justify-center rounded-lg transition-all relative
              ${isActive
                ? `bg-gray-800/80 ${act.color}`
                : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/40"
              }
            `}
          >
            {isActive && (
              <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-current rounded-r" />
            )}
            <Icon className="w-5 h-5" />
          </button>
        );
      })}

      <div className="flex-1" />

      <button
        onClick={() => onSelect("settings")}
        title="Settings"
        className={`
          w-10 h-10 flex items-center justify-center rounded-lg transition-all
          ${active === "settings"
            ? "bg-gray-800/80 text-gray-200"
            : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/40"
          }
        `}
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
