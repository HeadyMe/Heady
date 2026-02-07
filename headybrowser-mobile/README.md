# HeadyBrowser Mobile

**Sacred Geometry AI Browser for Android** — a custom browser combining the best features of all major browsers with built-in AI assistance via HeadyBuddy.

## Features (MVP)

- Tabbed browsing with WebView
- Address bar with URL/search detection
- Tab manager with grid view
- Bookmarks
- Browsing history
- "Ask Heady" AI floating button on every page
- AI sidebar with quick action chips (Summarize, Explain, Find key points)
- Sacred Geometry dark theme
- Share to HeadyBuddy

## Tech Stack

- **React Native** 0.73+
- **react-native-webview** (Chromium WebView for MVP; GeckoView planned for v2)
- **React Navigation** (bottom tabs)
- **Zustand** (state management)
- **MMKV** (fast local storage)
- **heady-manager.js** API backend

## Quick Start

```bash
# Prerequisites: Node.js 18+, Android SDK, Java 17+
npm install
npx react-native run-android
```

## Project Structure

```
headybrowser-mobile/
├── src/
│   ├── App.tsx              # Root with tab navigation
│   ├── theme.ts             # Sacred Geometry design tokens
│   ├── screens/
│   │   ├── BrowserScreen.tsx    # Main WebView + address bar + AI FAB
│   │   ├── TabsScreen.tsx       # Tab grid manager
│   │   ├── BookmarksScreen.tsx  # Bookmarks list
│   │   └── SettingsScreen.tsx   # App settings
│   ├── stores/
│   │   └── tabStore.ts      # Zustand tab/bookmark/history state
│   └── services/
│       └── HeadyAPI.ts      # heady-manager API client
└── package.json
```

## Roadmap

- [ ] GeckoView integration (Firefox engine)
- [ ] Content-level ad blocking
- [ ] Cross-device sync via heady-manager
- [ ] Fingerprint protection
- [ ] Reader mode
- [ ] Workspaces
- [ ] Extension support (GeckoView WebExtension API)

---

*Built by HeadySystems. Sacred Geometry Architecture.*
