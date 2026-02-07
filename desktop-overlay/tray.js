/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                 ║
 * ║  ━━━━━━━━━━━━━━                                                ║
 * ║  ∞ Sacred Geometry Architecture ∞                              ║
 * ║                                                                ║
 * ║  tray.js — Tray icon generation utility                        ║
 * ║  Generates a Sacred Geometry tray icon programmatically        ║
 * ║  when no icon file is available.                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

const { nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");

/**
 * Loads the tray icon from file or creates a fallback.
 * @returns {Electron.NativeImage}
 */
function loadTrayIcon() {
  const candidates = [
    path.join(__dirname, "icons", "tray-icon.png"),
    path.join(__dirname, "icons", "icon.png"),
  ];

  for (const iconPath of candidates) {
    if (fs.existsSync(iconPath)) {
      const img = nativeImage.createFromPath(iconPath);
      if (!img.isEmpty()) return img.resize({ width: 16, height: 16 });
    }
  }

  // Fallback: create a simple 16x16 green circle icon
  const size = 16;
  const canvas = Buffer.alloc(size * size * 4, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = 6;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * size + x) * 4;

      if (dist <= r) {
        const alpha = dist > r - 1 ? Math.max(0, (r - dist)) * 255 : 255;
        canvas[idx] = 34;     // R (heady-cyan)
        canvas[idx + 1] = 211; // G
        canvas[idx + 2] = 238; // B
        canvas[idx + 3] = Math.round(alpha); // A
      }
    }
  }

  return nativeImage.createFromBuffer(canvas, { width: size, height: size });
}

module.exports = { loadTrayIcon };
