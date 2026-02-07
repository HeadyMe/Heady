#!/bin/bash
# ╔══════════════════════════════════════════════════════════╗
# ║  Heady — Install All Android APKs                       ║
# ║  Run from PC with phone connected via USB/ADB           ║
# ╚══════════════════════════════════════════════════════════╝

set -e

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║  Heady — Android APK Installer       ║"
echo "  ║  ∞ SACRED GEOMETRY ∞                 ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Check ADB
if ! command -v adb &>/dev/null; then
  echo "ERROR: adb not found. Install Android SDK Platform Tools."
  echo "  Windows: winget install Google.PlatformTools"
  echo "  Linux:   sudo apt install adb"
  exit 1
fi

# Check device
DEVICE=$(adb devices | grep -w device | head -1)
if [ -z "$DEVICE" ]; then
  echo "ERROR: No Android device connected."
  echo "  1. Enable USB Debugging on your phone"
  echo "  2. Connect via USB"
  echo "  3. Accept the debugging prompt on your phone"
  exit 1
fi

echo "Device found: $DEVICE"
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APK_DIR="$SCRIPT_DIR/apks"

if [ ! -d "$APK_DIR" ]; then
  echo "No APKs directory found at $APK_DIR"
  echo "APKs will be available after build. For now, this script is a placeholder."
  echo ""
  echo "To build APKs:"
  echo "  1. HeadyBrowser:     cd heady-browser-android && ./gradlew assembleRelease"
  echo "  2. HeadyBuddy:       cd headybuddy-mobile && ./gradlew assembleRelease"
  echo "  3. HeadyOS Mobile:   cd headyos-mobile && flutter build apk"
  exit 0
fi

# Install each APK
INSTALLED=0
FAILED=0

for apk in "$APK_DIR"/*.apk; do
  if [ -f "$apk" ]; then
    NAME=$(basename "$apk")
    echo "Installing: $NAME"
    if adb install -r "$apk" 2>/dev/null; then
      echo "  ✓ $NAME installed"
      INSTALLED=$((INSTALLED + 1))
    else
      echo "  ✗ $NAME failed"
      FAILED=$((FAILED + 1))
    fi
  fi
done

echo ""
echo "═══════════════════════════════════"
echo "  Installed: $INSTALLED"
echo "  Failed:    $FAILED"
echo "═══════════════════════════════════"
echo ""
echo "Post-install steps for OnePlus Open:"
echo "  1. Settings → Battery → Battery Optimization → Each Heady app → Don't Optimize"
echo "  2. Settings → Apps → Each Heady app → Allow background activity"
echo "  3. Open HeadyBuddy → Grant notification permission → Enable Always-On"
echo ""
