# Install Heady Browser Extensions

## Chrome / Edge / Brave / Vivaldi / Arc

All Chromium-based browsers use the same extension.

```
1. Open chrome://extensions (or edge://extensions, brave://extensions)
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select: distribution/browser/extensions/chrome/
5. Pin the Heady extension to your toolbar
```

**Features:** Side panel chat, page summarization, text selection actions, tab management.

## Firefox

```
1. Open about:debugging#/runtime/this-firefox
2. Click "Load Temporary Add-on"
3. Select: distribution/browser/extensions/firefox/manifest.json
```

Note: Temporary add-ons are removed on restart. For persistent install, package as .xpi and sign via Mozilla AMO.

## Safari

```
1. Open Xcode
2. Open: distribution/browser/extensions/safari/
3. Build the Safari Web Extension project
4. Enable in Safari → Preferences → Extensions
```

See `distribution/browser/extensions/safari/README.md` for detailed Xcode instructions.

## Heady Browser (Standalone)

Instead of an extension, use the full Heady Browser with AI built in:

| Mode | Location | Description |
|------|----------|-------------|
| Local | `distribution/browser/heady-browser-local/` | All AI on-device |
| Hybrid | `distribution/browser/heady-browser-hybrid/` | Local + cloud fallback |
| Cloud | `distribution/browser/heady-browser-cloud/` | Thin client, cloud AI |

---
*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
