# Heady Safari Extension

Safari App Extension built with Xcode.

## Requirements
- macOS 12+ with Xcode 14+
- Safari 16+

## Build
1. Open `HeadySafari.xcodeproj` in Xcode
2. Build and run the containing app
3. Enable the extension in Safari → Preferences → Extensions

## Architecture
- **Containing App**: Minimal macOS app that hosts the extension
- **Safari Web Extension**: Uses WebExtensions API via `browser` namespace
- **Shared Core**: Same React side panel as Chrome/Firefox/Edge builds

## Files
- `Info.plist` — Extension metadata
- `manifest.json` — WebExtensions manifest (Safari-compatible subset)
- `Resources/` — Shared JS/CSS/HTML from the cross-browser build
