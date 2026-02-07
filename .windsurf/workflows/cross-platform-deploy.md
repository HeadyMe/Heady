---
description: Deploy HeadyBrowser + HeadyBuddy + HeadyIDE across Android, Windows, and Linux
---

# Cross-Platform Deploy Workflow

Deploy the full Heady ecosystem to all target platforms.

## Prerequisites
- Node.js 18+
- Rust (via rustup) for Tauri desktop browser
- Android SDK + Java 17 for mobile builds
- Termux + Termux:Boot on Android phone
- heady-manager.js running on at least one device

## Phase 0: Immediate Setup (Today)

### Phone (Android)
1. Install Termux from F-Droid (NOT Play Store)
2. Install Termux:Boot and Termux:API from F-Droid
3. Run bootstrap: `bash scripts/termux-bootstrap.sh`
4. Set SSH password and copy public key from PC
5. Disable battery optimization for Termux
6. Install Iceraven Browser as interim browser (from GitHub releases)
7. Test SSH from PC: `ssh <user>@<phone-ip> -p 8022`

### Desktop (Windows)
// turbo
8. Build HeadyBuddy widget: `cd headybuddy && npm install && npm run build`
9. Start HeadyBuddy desktop: `cd desktop-overlay && npm install && npm run dev`
10. Install code-server: `npm install -g code-server`
// turbo
11. Start code-server: `code-server --bind-addr 0.0.0.0:8443 --auth password`
// turbo
12. Start heady-manager: `cd C:\Users\erich\Heady && npm start`

### Desktop (Linux)
13. Install code-server: `curl -fsSL https://code-server.dev/install.sh | sh`
14. Enable code-server service: `sudo systemctl enable --now code-server@$USER`
15. Create systemd user service for heady-manager (see protocol doc)

## Phase 1: MVP Build (1-2 Weeks)

### HeadyBrowser Mobile
16. Init React Native project: `npx react-native init HeadyBrowserMobile --template react-native-template-typescript`
17. Copy scaffold from `headybrowser-mobile/src/` into the project
18. Install dependencies: `npm install`
19. Run on device: `npx react-native run-android`
20. Build release APK: `cd android && ./gradlew assembleRelease`
21. Sideload APK to phone via USB or `adb install`

### HeadyBuddy Mobile
22. Open `headybuddy-mobile/` in Android Studio
23. Build and deploy to device
24. Grant permissions: Overlay, Notifications, Boot
25. Disable battery optimization for HeadyBuddy
26. Test foreground service persistence (reboot phone)

### HeadyBrowser Desktop
27. Install Tauri CLI: `cargo install tauri-cli`
28. Build desktop browser: `cd headybrowser-desktop && npm install && npm run tauri:dev`
29. Package for Windows: `npm run tauri:build`

## Phase 2: Integration (2-6 Weeks)
30. Wire cross-device sync API in heady-manager
31. Implement GeckoView on mobile (replace WebView)
32. Add content-level ad blocking
33. Build HeadyIDE custom VS Code extension
34. Deploy to all platforms and verify

## Verification
- [ ] SSH to phone works from desktop
- [ ] heady-manager health check passes on all devices
- [ ] HeadyBuddy desktop shows tray icon and responds to Ctrl+Shift+H
- [ ] HeadyBuddy mobile shows persistent notification
- [ ] HeadyBrowser mobile loads pages and AI panel works
- [ ] code-server accessible from phone browser
- [ ] Cross-device tab sync works (Phase 2)
