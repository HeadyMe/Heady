#!/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║  Heady Android — Install All APKs                        ║
# ║  Sideloads all Heady apps to connected Android device     ║
# ╚══════════════════════════════════════════════════════════╝
#
# Prerequisites:
#   - ADB installed and in PATH
#   - Android device connected via USB with USB Debugging enabled
#   - APKs built and placed in this directory
#
# Usage:
#   bash install-all.sh           # Install all APKs
#   bash install-all.sh --list    # List available APKs
#   bash install-all.sh chat      # Install specific app

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APK_DIR="$SCRIPT_DIR/apks"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${CYAN}[HEADY]${NC} $1"; }
ok()   { echo -e "${GREEN}  ✓${NC} $1"; }
warn() { echo -e "${YELLOW}  ⚠${NC} $1"; }
err()  { echo -e "${RED}  ✗${NC} $1"; }

# Check ADB
if ! command -v adb &>/dev/null; then
  err "ADB not found. Install Android SDK Platform Tools."
  exit 1
fi

# Check device
DEVICE=$(adb devices | grep -w "device" | head -1 | awk '{print $1}')
if [ -z "$DEVICE" ]; then
  err "No Android device connected. Enable USB Debugging and connect via USB."
  exit 1
fi

log "Connected device: $DEVICE"

# ── APK Map ─────────────────────────────────────────────────
declare -A APKS=(
  ["chat"]="heady-chat.apk"
  ["dev"]="heady-dev.apk"
  ["voice"]="heady-voice.apk"
  ["automations"]="heady-automations.apk"
  ["buddy"]="heady-buddy.apk"
  ["browser"]="heady-browser.apk"
  ["headyos"]="headyos-mobile.apk"
)

# ── List Mode ────────────────────────────────────────────────
if [ "${1:-}" = "--list" ]; then
  echo ""
  log "Available Heady APKs:"
  for key in "${!APKS[@]}"; do
    apk="${APKS[$key]}"
    if [ -f "$APK_DIR/$apk" ]; then
      ok "$key → $apk"
    else
      warn "$key → $apk (not built yet)"
    fi
  done
  exit 0
fi

# ── Install Specific App ────────────────────────────────────
if [ -n "${1:-}" ] && [ "$1" != "--all" ]; then
  apk="${APKS[$1]:-}"
  if [ -z "$apk" ]; then
    err "Unknown app: $1. Use --list to see available apps."
    exit 1
  fi
  if [ ! -f "$APK_DIR/$apk" ]; then
    err "$apk not found in $APK_DIR. Build it first."
    exit 1
  fi
  log "Installing $apk..."
  adb install -r "$APK_DIR/$apk"
  ok "$1 installed"
  exit 0
fi

# ── Install All ──────────────────────────────────────────────
log "Installing all available Heady APKs..."
installed=0
skipped=0

for key in "${!APKS[@]}"; do
  apk="${APKS[$key]}"
  if [ -f "$APK_DIR/$apk" ]; then
    log "  Installing $key ($apk)..."
    if adb install -r "$APK_DIR/$apk" 2>/dev/null; then
      ok "$key installed"
      ((installed++))
    else
      err "$key failed to install"
    fi
  else
    warn "$key skipped ($apk not found)"
    ((skipped++))
  fi
done

echo ""
log "Done: $installed installed, $skipped skipped"
log "Grant permissions: Settings → Apps → [Heady App] → Permissions"
log "Disable battery optimization for HeadyBuddy and Termux"
