/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  preload.js — Secure bridge between Electron and HeadyBuddy   ║
 * ║  widget. Exposes safe APIs via contextBridge.                  ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("headyDesktop", {
  // Notify main process of widget state changes (pill/main/expanded)
  setWidgetState: (state) => ipcRenderer.send("widget-state", state),

  // Get/set persistent config
  getConfig: () => ipcRenderer.invoke("get-config"),
  setConfig: (key, value) => ipcRenderer.invoke("set-config", key, value),

  // Get local system info for resource display
  getSystemInfo: () => ipcRenderer.invoke("get-system-info"),

  // Listen for quiet mode toggle from tray
  onQuietMode: (callback) => {
    ipcRenderer.on("quiet-mode", (event, enabled) => callback(enabled));
  },

  // Platform detection
  platform: process.platform,
  isElectron: true,
});
