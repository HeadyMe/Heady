import { useApi } from "../hooks/useApi";
import { Circle, Wifi, WifiOff, Cpu, Clock } from "lucide-react";

export default function StatusBar() {
  const { data: health } = useApi("/health", { poll: 10000 });
  const { data: system } = useApi("/system/status", { poll: 15000 });

  const isOnline = health?.ok;
  const env = system?.environment || "unknown";
  const nodesActive = system?.capabilities?.nodes?.active || 0;
  const nodesTotal = system?.capabilities?.nodes?.total || 0;
  const uptime = health?.uptime ? formatUptime(health.uptime) : "--";

  return (
    <div className="h-6 bg-gray-900 border-t border-gray-800 flex items-center px-3 text-[11px] text-gray-500 gap-4 shrink-0 select-none">
      {/* Connection Status */}
      <div className="flex items-center gap-1.5">
        {isOnline ? (
          <>
            <Circle className="w-2.5 h-2.5 fill-green-400 text-green-400" />
            <span className="text-green-400">Connected</span>
          </>
        ) : (
          <>
            <Circle className="w-2.5 h-2.5 fill-red-400 text-red-400" />
            <span className="text-red-400">Disconnected</span>
          </>
        )}
      </div>

      <div className="w-px h-3 bg-gray-700" />

      {/* Environment */}
      <span className="text-gray-400">{env}</span>

      <div className="w-px h-3 bg-gray-700" />

      {/* Nodes */}
      <div className="flex items-center gap-1">
        <Cpu className="w-3 h-3" />
        <span>{nodesActive}/{nodesTotal} nodes</span>
      </div>

      <div className="w-px h-3 bg-gray-700" />

      {/* Uptime */}
      <div className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{uptime}</span>
      </div>

      <div className="flex-1" />

      {/* Version */}
      <span>Heady v{health?.version || "3.0.0"}</span>
      <span className="text-gray-600">|</span>
      <span className="text-green-500/70">HeadyAutoIDE</span>
    </div>
  );
}

function formatUptime(seconds) {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
