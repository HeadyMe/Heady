# Heady Browser + Buddy + IDE — Master Build & Deployment Protocol

> **Status:** Active | **Type:** Architecture + Build Protocol | **Owner:** system
> **Source of Truth:** `docs/HEADY_BROWSER_BUDDY_IDE_PROTOCOL.md`
> **Version:** 1.0.0 | **Last Updated:** 2026-02-06
> **Target Platforms:** Android (OnePlus Open) · Windows · Linux
> **Goal:** Fully functional Heady Browser, always-on Heady Buddy, and Heady IDE across all three platforms — as fast as possible, built to last.

---

## Table of Contents

0. [Design Philosophy](#0-design-philosophy)
1. [Platform Matrix](#1-platform-matrix)
2. [Heady Browser — Architecture](#2-heady-browser--architecture)
3. [Heady Browser — Android Build](#3-heady-browser--android-build)
4. [Heady Browser — Desktop Build (Windows + Linux)](#4-heady-browser--desktop-build-windows--linux)
5. [Heady Browser — Feature Fusion (Best of All Browsers)](#5-heady-browser--feature-fusion-best-of-all-browsers)
6. [Heady Buddy — Architecture](#6-heady-buddy--architecture)
7. [Heady Buddy — Always-On Android](#7-heady-buddy--always-on-android)
8. [Heady Buddy — Always-On Windows](#8-heady-buddy--always-on-windows)
9. [Heady Buddy — Always-On Linux](#9-heady-buddy--always-on-linux)
10. [Heady Buddy — Cross-Platform Sync](#10-heady-buddy--cross-platform-sync)
11. [SSH Into Android Phone](#11-ssh-into-android-phone)
12. [Heady IDE — Architecture](#12-heady-ide--architecture)
13. [Heady IDE — Desktop Setup](#13-heady-ide--desktop-setup)
14. [Heady IDE — Mobile Access](#14-heady-ide--mobile-access)
15. [Unified Backend Service](#15-unified-backend-service)
16. [Security Protocol](#16-security-protocol)
17. [Day-0 Quick Start (Get Running Today)](#17-day-0-quick-start-get-running-today)
18. [Phase 1: MVP (Week 1–2)](#18-phase-1-mvp-week-12)
19. [Phase 2: Custom Builds (Week 3–6)](#19-phase-2-custom-builds-week-36)
20. [Phase 3: Deep Integration (Month 2–6)](#20-phase-3-deep-integration-month-26)
21. [Phase 4: Polish + Social Impact (Month 6–12)](#21-phase-4-polish--social-impact-month-612)
22. [Error Elimination Across Rebuilds](#22-error-elimination-across-rebuilds)
23. [Testing Protocol](#23-testing-protocol)
24. [Responsible AI Integration](#24-responsible-ai-integration)
25. [Registry Integration](#25-registry-integration)

---

## 0. Design Philosophy

### Don't Reinvent the Engine — Own the Experience

You do **not** build a rendering engine from scratch. You stand on Blink/Gecko/WebKit and focus the "Heady" layer on:

- **UI/UX** — Sacred Geometry aesthetics, unified workspaces, AI-native affordances
- **Privacy** — Ad/tracker blocking, encrypted local storage, minimal data collection
- **AI Integration** — Heady Buddy embedded everywhere (browser sidebar, IDE panel, phone overlay)
- **Always-On** — Buddy runs as a persistent service on every platform, respecting OS battery/background rules
- **SSH Access** — Full terminal access into your phone from any computer

### Standing Rules

1. Every component must work **standalone** and **together**.
2. One backend, many clients — shared API for Buddy across all platforms.
3. Local-first where possible; cloud when needed.
4. Every build iteration eliminates errors per the Iterative Rebuild Protocol.
5. Every artifact is registered in `heady-registry.json`.

---

## 1. Platform Matrix

| Platform | Browser Engine | Buddy Persistence Model | IDE Access | SSH |
|---|---|---|---|---|
| **Android** (OnePlus Open) | GeckoView (Firefox engine) | Foreground Service + notification | Mobile web IDE | Termux + sshd |
| **Windows** | System WebView2 via Tauri | System tray app + startup entry | Desktop app (Tauri/Theia) | N/A (SSH client) |
| **Linux** | System WebKitGTK via Tauri | systemd --user service | Desktop app (Tauri/Theia) | N/A (SSH client) |

---

## 2. Heady Browser — Architecture

### 2.1 Layered Design (All Platforms)

```
┌─────────────────────────────────────────────────────────┐
│  HEADY UI LAYER (Sacred Geometry)                       │
│  Tabs · Workspaces · AI Button · Share-to-Buddy         │
│  Reading Mode · Annotations · Impact Meter              │
├─────────────────────────────────────────────────────────┤
│  CONTROL LAYER                                          │
│  Request Interception · Ad/Tracker Blocking             │
│  Auto-Summaries · Smart Read-Later · Content Rules      │
├─────────────────────────────────────────────────────────┤
│  AI LAYER (Heady Buddy)                                 │
│  Sidebar Chat · Text Selection Actions · Agent Mode     │
│  Context Awareness · Long-Term Memory                   │
├─────────────────────────────────────────────────────────┤
│  ENGINE LAYER (DO NOT REBUILD)                          │
│  Android: GeckoView | Desktop: WebView2/WebKitGTK       │
│  Handles: Rendering, JS, Networking, Security Sandbox   │
├─────────────────────────────────────────────────────────┤
│  STORAGE LAYER                                          │
│  Encrypted Local DB · Tabs · Notes · Embeddings         │
│  Sync (optional) · Heady Memory Store                   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Tech Stack Decision

| Component | Choice | Rationale |
|---|---|---|
| **Android engine** | GeckoView | Full extension support, better privacy controls than WebView, Firefox-quality rendering |
| **Desktop framework** | Tauri 2.0 | Rust backend (secure, fast), uses system webview (lighter than Electron), cross-platform Windows+Linux |
| **UI framework** | React + TailwindCSS | Shared with existing Heady frontend, Sacred Geometry design system |
| **Ad blocking** | uBlock Origin (Android via GeckoView extensions) + DNS-level rules (desktop) | Best-in-class, proven |
| **Local storage** | SQLite (via `better-sqlite3` or Rust `rusqlite`) | Encrypted, fast, portable |
| **Sync** | Optional — Heady backend API or local-only | Privacy-first default |

---

## 3. Heady Browser — Android Build

### 3.1 Project Structure

```
heady-browser-android/
├── app/
│   ├── src/main/
│   │   ├── java/com/headysystems/browser/
│   │   │   ├── MainActivity.kt
│   │   │   ├── BrowserFragment.kt
│   │   │   ├── TabManager.kt
│   │   │   ├── HeadyBuddySidebar.kt
│   │   │   ├── ContentBlocker.kt
│   │   │   ├── ShareReceiver.kt
│   │   │   └── services/
│   │   │       └── BuddyForegroundService.kt
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   ├── values/ (Sacred Geometry colors, themes)
│   │   │   └── drawable/
│   │   └── AndroidManifest.xml
│   ├── build.gradle.kts
│   └── proguard-rules.pro
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

### 3.2 Core Dependencies

```kotlin
// build.gradle.kts (app)
dependencies {
    // GeckoView — Firefox rendering engine
    implementation("org.mozilla.geckoview:geckoview:125.0.+")
    
    // Mozilla Android Components (tabs, sessions, toolbar, etc.)
    implementation("org.mozilla.components:browser-engine-gecko:125.0.+")
    implementation("org.mozilla.components:browser-session-storage:125.0.+")
    implementation("org.mozilla.components:browser-toolbar:125.0.+")
    implementation("org.mozilla.components:browser-tabstray:125.0.+")
    implementation("org.mozilla.components:feature-tabs:125.0.+")
    implementation("org.mozilla.components:feature-session:125.0.+")
    implementation("org.mozilla.components:feature-toolbar:125.0.+")
    implementation("org.mozilla.components:concept-engine:125.0.+")
    
    // Ad blocking
    implementation("org.mozilla.components:browser-engine-gecko:125.0.+")
    // GeckoView supports built-in tracking protection + uBlock via extensions
    
    // Local encrypted storage
    implementation("net.zetetic:android-database-sqlcipher:4.5.+")
    implementation("androidx.sqlite:sqlite-ktx:2.4.+")
    
    // Networking (for Buddy API calls)
    implementation("com.squareup.okhttp3:okhttp:4.12.+")
    implementation("com.squareup.moshi:moshi-kotlin:1.15.+")
    
    // Foreground service (Buddy always-on)
    implementation("androidx.work:work-runtime-ktx:2.9.+")
    
    // UI
    implementation("com.google.android.material:material:1.12.+")
    implementation("androidx.constraintlayout:constraintlayout:2.1.+")
}
```

### 3.3 GeckoView Browser Core

```kotlin
// BrowserFragment.kt — Core browser with GeckoView
class BrowserFragment : Fragment() {
    private lateinit var geckoRuntime: GeckoRuntime
    private lateinit var geckoSession: GeckoSession
    private lateinit var geckoView: GeckoView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize GeckoView runtime with Heady settings
        val settings = GeckoRuntimeSettings.Builder()
            .javaScriptEnabled(true)
            .webManifest(true)
            .consoleOutput(true)
            .contentBlocking(ContentBlocking.Settings.Builder()
                .antiTracking(
                    ContentBlocking.AntiTracking.AD or
                    ContentBlocking.AntiTracking.SOCIAL or
                    ContentBlocking.AntiTracking.ANALYTIC or
                    ContentBlocking.AntiTracking.CRYPTOMINING or
                    ContentBlocking.AntiTracking.FINGERPRINTING or
                    ContentBlocking.AntiTracking.CONTENT
                )
                .safeBrowsing(ContentBlocking.SafeBrowsing.MALWARE or
                    ContentBlocking.SafeBrowsing.PHISHING)
                .cookieBehavior(ContentBlocking.CookieBehavior.ACCEPT_NON_TRACKERS)
                .build()
            )
            .build()
        
        geckoRuntime = GeckoRuntime.create(requireContext(), settings)
        geckoSession = GeckoSession()
        geckoSession.open(geckoRuntime)
    }
    
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        geckoView = GeckoView(requireContext())
        geckoView.setSession(geckoSession)
        geckoSession.loadUri("https://heady.systems") // Default home
        return geckoView
    }
}
```

### 3.4 Key Android Browser Features

| Feature | Implementation |
|---|---|
| **Tabbed browsing** | Mozilla Android Components `browser-tabstray` + `feature-tabs` |
| **Ad/tracker blocking** | GeckoView built-in `ContentBlocking` (Enhanced Tracking Protection) + uBlock Origin extension |
| **Extension support** | GeckoView `WebExtensionController` — load .xpi files, same as Firefox |
| **Heady Buddy sidebar** | Custom `DrawerLayout` panel with WebView pointing to Buddy chat UI |
| **Share-to-Buddy** | `ShareReceiver` activity with intent filter for `text/plain` and `text/html` |
| **Reading mode** | Mozilla `feature-readerview` component |
| **Download manager** | Mozilla `feature-downloads` component |
| **Autofill** | Android Autofill Framework integration |
| **Encrypted storage** | SQLCipher for bookmarks, history, notes, Buddy memory |
| **Dark mode** | Follow system theme + GeckoView `prefersColorScheme` override |

---

## 4. Heady Browser — Desktop Build (Windows + Linux)

### 4.1 Tauri 2.0 Project Structure

```
heady-browser-desktop/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs
│   │   ├── browser/
│   │   │   ├── mod.rs
│   │   │   ├── tabs.rs
│   │   │   ├── content_blocker.rs
│   │   │   └── storage.rs
│   │   ├── buddy/
│   │   │   ├── mod.rs
│   │   │   ├── api_client.rs
│   │   │   └── tray.rs
│   │   └── commands.rs
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── icons/
├── src/                    # Frontend (React + Tailwind)
│   ├── App.tsx
│   ├── components/
│   │   ├── BrowserChrome.tsx
│   │   ├── TabBar.tsx
│   │   ├── AddressBar.tsx
│   │   ├── BuddySidebar.tsx
│   │   ├── SettingsPanel.tsx
│   │   └── WorkspaceSelector.tsx
│   ├── hooks/
│   ├── stores/
│   └── styles/
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### 4.2 Tauri Configuration

```json
{
  "productName": "Heady Browser",
  "identifier": "com.headysystems.browser",
  "build": {
    "frontendDist": "../dist"
  },
  "app": {
    "withGlobalTauri": true,
    "windows": [
      {
        "title": "Heady Browser",
        "width": 1280,
        "height": 900,
        "minWidth": 800,
        "minHeight": 600,
        "decorations": false,
        "transparent": false
      }
    ],
    "trayIcon": {
      "iconPath": "icons/tray.png",
      "tooltip": "Heady Browser + Buddy"
    },
    "security": {
      "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
    }
  },
  "plugins": {
    "shell": { "open": true },
    "fs": { "scope": ["$APPDATA/**", "$HOME/.heady/**"] },
    "http": { "scope": ["http://localhost:*", "https://*"] }
  }
}
```

### 4.3 Rust Backend Core

```rust
// src-tauri/src/main.rs
use tauri::{Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, CustomMenuItem};

fn main() {
    let quit = CustomMenuItem::new("quit", "Quit Heady");
    let show = CustomMenuItem::new("show", "Show Browser");
    let buddy = CustomMenuItem::new("buddy", "Open Buddy");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(buddy)
        .add_native_item(tauri::SystemTrayMenuItem::Separator)
        .add_item(quit);
    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => std::process::exit(0),
                "show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                }
                "buddy" => {
                    // Open Buddy sidebar or window
                    let window = app.get_window("main").unwrap();
                    window.emit("open-buddy", {}).unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            // Hide to tray instead of closing
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            // Tauri commands for browser features
        ])
        .run(tauri::generate_context!())
        .expect("error while running Heady Browser");
}
```

### 4.4 Desktop Browser Features

| Feature | Implementation |
|---|---|
| **Rendering** | System WebView2 (Windows) / WebKitGTK (Linux) via Tauri |
| **Tabs** | React tab component + Tauri multi-webview (Tauri 2.0) |
| **Ad blocking** | Rust-based filter list engine (adblock-rust crate) + DNS-level blocking |
| **Buddy sidebar** | React panel calling Buddy API over localhost |
| **System tray** | Tauri SystemTray — hide-to-tray on close, global hotkey |
| **Extensions** | WebExtension bridge (limited) or Heady plugin system |
| **Workspaces** | Named tab groups (Research, Coding, Personal) persisted to SQLite |
| **Password manager** | System keychain integration (Windows Credential Manager / Linux Secret Service) |
| **Auto-start** | Registry entry (Windows) / `.desktop` autostart (Linux) |

---

## 5. Heady Browser — Feature Fusion (Best of All Browsers)

### 5.1 Features Extracted from Top Browsers

| Feature | Source Browser | Heady Implementation |
|---|---|---|
| **Speed & rendering** | Chrome (Blink) | Use GeckoView (comparable speed, better privacy) |
| **Extension ecosystem** | Firefox/Chrome | GeckoView extension support (Android) + WebExtension bridge (desktop) |
| **Privacy/tracking protection** | Firefox/Brave | GeckoView Enhanced Tracking Protection + uBlock Origin |
| **Built-in VPN/Tor** | Brave/Tor Browser | Optional Tor integration via GeckoView network config |
| **Tab stacking/grouping** | Vivaldi/Arc | Workspace-based tab groups with Sacred Geometry visual design |
| **Sidebar panels** | Opera/Arc/Vivaldi | Heady Buddy sidebar + pinned web panels |
| **Speed dial / visual bookmarks** | Opera/Vivaldi | Sacred Geometry home screen with visual bookmark grid |
| **Reading mode** | Safari/Firefox | Mozilla `feature-readerview` component |
| **Cross-device sync** | Chrome/Firefox | Heady Sync via encrypted backend API |
| **Developer tools** | Chrome/Firefox | GeckoView DevTools (Android) + system DevTools (desktop) |
| **AI integration** | Edge (Copilot)/Arc | Heady Buddy — deeply integrated, not bolted on |
| **Picture-in-picture** | Chrome/Firefox | GeckoView PiP support (Android) + Tauri window management (desktop) |
| **Vertical tabs** | Edge/Vivaldi | Configurable tab orientation (horizontal/vertical/tree) |
| **Split view** | Samsung/Vivaldi | Multi-webview split (Tauri 2.0 multi-webview) |
| **Custom CSS injection** | Stylus extension | Built-in user stylesheet support |
| **Reader/focus mode** | Arc/Safari | Distraction-free mode: hide all chrome, show content + Buddy only |
| **QR code scanning** | Samsung/Opera | Camera integration for URL scanning (Android) |
| **Gesture navigation** | Opera/Vivaldi | Swipe gestures for back/forward/tabs (Android) |
| **Password manager** | Chrome/Firefox/1Password | System keychain + optional Heady vault |
| **Ad revenue sharing** | Brave (BAT) | Heady Impact Credits — opt-in ads, revenue to social causes |

### 5.2 "Squash Museum" — Deduplicated Feature Ownership

| Capability | Single Source of Truth | Notes |
|---|---|---|
| Rendering | Engine layer (GeckoView / system webview) | Never touch this |
| Tab management | Heady UI layer | Custom tab strip, workspaces, tree tabs |
| Ad blocking | Control layer (GeckoView ETP + uBlock) | Don't build your own filter engine |
| AI features | Buddy API layer | All AI goes through one API |
| Bookmarks / history | Storage layer (SQLite encrypted) | One schema, shared across platforms |
| Sync | Backend API | Optional, end-to-end encrypted |
| Extensions | Engine extension system | GeckoView WebExtension API |
| DevTools | Engine layer | Use built-in; don't rebuild |

---

## 6. Heady Buddy — Architecture

### 6.1 Unified Backend

```
┌───────────────────────────────────────────────┐
│  HEADY BUDDY BACKEND (Node.js or Python)      │
│                                               │
│  ┌─────────┐ ┌──────────┐ ┌───────────────┐  │
│  │ Chat API│ │Memory API│ │ Action Engine │  │
│  │         │ │          │ │ (browse, search│  │
│  │ /buddy/ │ │ /memory/ │ │  annotate)    │  │
│  │ chat    │ │ store    │ │ /actions/     │  │
│  │ stream  │ │ recall   │ │ execute       │  │
│  └────┬────┘ └────┬─────┘ └──────┬────────┘  │
│       │           │              │            │
│  ┌────┴───────────┴──────────────┴─────────┐  │
│  │        LLM Router                       │  │
│  │  Local (Ollama) ←→ Cloud (OpenAI/Claude)│  │
│  └─────────────────────────────────────────┘  │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │  Encrypted Memory Store (SQLite)        │  │
│  │  Conversations · Context · Preferences  │  │
│  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

### 6.2 API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/buddy/chat` | Send message + context, get response |
| `POST` | `/buddy/stream` | SSE streaming chat response |
| `POST` | `/buddy/summarize` | Summarize URL or text |
| `POST` | `/buddy/explain` | Explain selected text |
| `POST` | `/buddy/translate` | Translate text |
| `GET` | `/buddy/status` | Buddy health + active model |
| `POST` | `/memory/store` | Save context/fact to memory |
| `GET` | `/memory/recall` | Recall relevant memories for a query |
| `DELETE` | `/memory/forget` | Remove specific memories |
| `POST` | `/actions/execute` | Execute an action (search, open tab, annotate) |
| `GET` | `/actions/available` | List available actions |

### 6.3 LLM Router Logic

```javascript
// Simplified LLM router
async function routeToLLM(messages, options = {}) {
  const { preferLocal = true, model } = options;
  
  // Try local first (Ollama)
  if (preferLocal) {
    try {
      const localResponse = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        body: JSON.stringify({ model: model || 'llama3.2', messages, stream: false })
      });
      if (localResponse.ok) return await localResponse.json();
    } catch (e) {
      // Local unavailable, fall through to cloud
    }
  }
  
  // Fall back to cloud
  if (process.env.OPENAI_API_KEY) {
    // Route to OpenAI
  } else if (process.env.ANTHROPIC_API_KEY) {
    // Route to Anthropic
  }
  
  throw new Error('No LLM available — install Ollama locally or set cloud API keys');
}
```

---

## 7. Heady Buddy — Always-On Android

### 7.1 Foreground Service

```kotlin
// BuddyForegroundService.kt
class BuddyForegroundService : Service() {
    
    companion object {
        const val CHANNEL_ID = "heady_buddy_always_on"
        const val NOTIFICATION_ID = 1337
    }
    
    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Heady Buddy")
            .setContentText("Always on — tap to open")
            .setSmallIcon(R.drawable.ic_heady_buddy)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .addAction(R.drawable.ic_chat, "Chat", getChatPendingIntent())
            .addAction(R.drawable.ic_stop, "Stop", getStopPendingIntent())
            .build()
        
        // MUST call within 5 seconds of startForegroundService()
        startForeground(NOTIFICATION_ID, notification)
        
        // Initialize Buddy backend connection
        initBuddyConnection()
        
        // Register share intent listener
        registerShareListener()
        
        return START_STICKY // Restart if killed
    }
    
    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Heady Buddy Always On",
            NotificationManager.IMPORTANCE_LOW // Low = no sound, just persistent
        ).apply {
            description = "Keeps Heady Buddy ready to assist"
            setShowBadge(false)
        }
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
    }
    
    private fun initBuddyConnection() {
        // Connect to Buddy backend (local or cloud)
        // Keep WebSocket alive for real-time responses
    }
    
    override fun onBind(intent: Intent?): IBinder? = null
}
```

### 7.2 Android Manifest Requirements

```xml
<manifest>
    <!-- Permissions -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    
    <application>
        <!-- Buddy Foreground Service -->
        <service
            android:name=".services.BuddyForegroundService"
            android:foregroundServiceType="dataSync"
            android:exported="false" />
        
        <!-- Start on boot -->
        <receiver
            android:name=".receivers.BootReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>
        
        <!-- Share target -->
        <activity
            android:name=".ShareReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.SEND" />
                <category android:name="android.intent.category.DEFAULT" />
                <data android:mimeType="text/*" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 7.3 Battery Optimization Survival

| Step | Action | Why |
|---|---|---|
| 1 | `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` permission | Request exemption from Doze |
| 2 | Guide user to Settings → Battery → Heady Buddy → "Don't optimize" | OEM battery managers (OnePlus uses aggressive optimization) |
| 3 | `START_STICKY` return flag | OS restarts service if killed |
| 4 | `RECEIVE_BOOT_COMPLETED` receiver | Restart after reboot |
| 5 | Use `FOREGROUND_SERVICE_DATA_SYNC` type | Android 14+ requires typed foreground services |
| 6 | Keep notification visible (IMPORTANCE_LOW) | Android requires foreground notification |
| 7 | OnePlus-specific: Settings → Battery → Battery Optimization → Heady Buddy → Don't Optimize | OnePlus has aggressive background killing |
| 8 | OnePlus-specific: Settings → Apps → Heady Buddy → "Allow background activity" | Secondary toggle on OnePlus |

### 7.4 Floating Bubble (Quick Access)

```kotlin
// Optional: Floating bubble overlay for instant Buddy access
class BuddyBubbleService : Service() {
    private lateinit var windowManager: WindowManager
    private lateinit var bubbleView: View
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.END or Gravity.CENTER_VERTICAL
            x = 0
            y = 0
        }
        
        bubbleView = LayoutInflater.from(this).inflate(R.layout.buddy_bubble, null)
        bubbleView.setOnClickListener { openBuddyChat() }
        
        // Make draggable
        bubbleView.setOnTouchListener(BubbleTouchListener(params, windowManager, bubbleView))
        
        windowManager.addView(bubbleView, params)
        return START_STICKY
    }
}
```

---

## 8. Heady Buddy — Always-On Windows

### 8.1 System Tray App (Tauri)

The desktop Buddy client uses Tauri with:

- **System tray icon** — Always visible, click to open Buddy
- **Global hotkey** — `Ctrl+Space` opens Buddy from anywhere
- **Hide-to-tray** — Closing the window just hides it, Buddy stays running
- **Auto-start** — Registry entry `HKCU\Software\Microsoft\Windows\CurrentVersion\Run`

### 8.2 Auto-Start (Windows Registry)

```rust
// In Tauri setup, register auto-start
use winreg::enums::*;
use winreg::RegKey;

fn register_autostart() -> Result<(), Box<dyn std::error::Error>> {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let (key, _) = hkcu.create_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Run")?;
    let exe_path = std::env::current_exe()?.to_string_lossy().to_string();
    key.set_value("HeadyBuddy", &exe_path)?;
    Ok(())
}
```

### 8.3 Global Hotkey

```rust
// Register Ctrl+Space globally
use tauri::GlobalShortcutManager;

fn setup_hotkey(app: &tauri::App) {
    let window = app.get_window("main").unwrap();
    app.global_shortcut_manager()
        .register("CmdOrCtrl+Space", move || {
            if window.is_visible().unwrap() {
                window.hide().unwrap();
            } else {
                window.show().unwrap();
                window.set_focus().unwrap();
            }
        })
        .unwrap();
}
```

---

## 9. Heady Buddy — Always-On Linux

### 9.1 systemd User Service

```ini
# ~/.config/systemd/user/heady-buddy.service
[Unit]
Description=Heady Buddy Always-On Service
After=network.target

[Service]
Type=simple
ExecStart=/opt/heady/buddy-backend serve --port 3301
Restart=always
RestartSec=5
Environment=HEADY_API_KEY=your_key
Environment=OLLAMA_HOST=http://localhost:11434
WorkingDirectory=/opt/heady

[Install]
WantedBy=default.target
```

### 9.2 Enable and Start

```bash
# Install
systemctl --user daemon-reload
systemctl --user enable heady-buddy.service
systemctl --user start heady-buddy.service

# Enable lingering (runs even when logged out)
loginctl enable-linger $USER

# Check status
systemctl --user status heady-buddy.service
journalctl --user -u heady-buddy.service -f
```

### 9.3 Desktop Entry (Auto-Start GUI Client)

```ini
# ~/.config/autostart/heady-buddy.desktop
[Desktop Entry]
Type=Application
Name=Heady Buddy
Comment=Always-on AI assistant
Exec=/opt/heady/heady-buddy-desktop
Icon=heady-buddy
Terminal=false
StartupNotify=false
X-GNOME-Autostart-enabled=true
```

---

## 10. Heady Buddy — Cross-Platform Sync

### 10.1 Sync Architecture

```
Phone (Android)  ←→  Heady Sync API  ←→  Desktop (Windows/Linux)
                         │
                    Encrypted at rest
                    End-to-end encrypted in transit
                    Conflict resolution: last-write-wins + merge for lists
```

### 10.2 What Syncs

| Data | Sync? | Method |
|---|---|---|
| Buddy conversation history | Yes (opt-in) | E2E encrypted, stored on Heady backend |
| Buddy memory/facts | Yes | Encrypted key-value sync |
| Browser bookmarks | Yes | Encrypted bookmark JSON |
| Browser tabs (open) | Yes | Tab list sync (like Firefox Send Tab) |
| Browser history | No (local only) | Privacy-first default |
| Passwords | System keychain only | Not synced by Heady; use system manager |
| IDE settings | Yes | Settings JSON sync |

---

## 11. SSH Into Android Phone

### 11.1 Termux Setup Script

Save and run this on your phone in Termux:

```bash
#!/data/data/com.termux/files/usr/bin/bash
# heady-phone-ssh-setup.sh
# Run inside Termux on your Android phone

echo "=== Heady Phone SSH Setup ==="

# Step 1: Update and install
pkg update -y && pkg upgrade -y
pkg install -y openssh termux-services termux-auth rsync wget curl git python nodejs

# Step 2: Set password for SSH auth
echo "Set a strong password for SSH access:"
passwd

# Step 3: Generate host keys if not exist
if [ ! -f ~/.ssh/ssh_host_rsa_key ]; then
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/ssh_host_rsa_key -N ""
fi

# Step 4: Configure sshd
mkdir -p ~/.ssh
cat > $PREFIX/etc/ssh/sshd_config << 'SSHD_CONF'
# Heady Phone SSH Config
Port 8022
ListenAddress 0.0.0.0
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PrintMotd yes
Subsystem sftp /data/data/com.termux/files/usr/libexec/sftp-server
SSHD_CONF

# Step 5: Create MOTD
cat > $PREFIX/etc/motd << 'MOTD'

  ╔══════════════════════════════════════╗
  ║  HEADY SYSTEMS — Phone SSH Access   ║
  ║  ∞ SACRED GEOMETRY ∞                ║
  ╚══════════════════════════════════════╝

  Device: Android (OnePlus Open)
  Heady Buddy: Active
  Type 'heady-status' for system info.

MOTD

# Step 6: Create heady-status helper
cat > $PREFIX/bin/heady-status << 'STATUS'
#!/data/data/com.termux/files/usr/bin/bash
echo "=== Heady Phone Status ==="
echo "Hostname: $(hostname)"
echo "IP: $(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}')"
echo "SSH Port: 8022"
echo "Uptime: $(uptime)"
echo "Storage: $(df -h /data | tail -1 | awk '{print $3 "/" $2 " (" $5 " used)"}')"
echo "Buddy API: $(curl -s http://localhost:3301/buddy/status 2>/dev/null || echo 'not running')"
echo "=========================="
STATUS
chmod +x $PREFIX/bin/heady-status

# Step 7: Create start/stop scripts
cat > $PREFIX/bin/heady-ssh-start << 'START'
#!/data/data/com.termux/files/usr/bin/bash
sshd
IP=$(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}')
echo "SSH server started on port 8022"
echo "Connect from your computer:"
echo "  ssh $(whoami)@${IP} -p 8022"
START
chmod +x $PREFIX/bin/heady-ssh-start

cat > $PREFIX/bin/heady-ssh-stop << 'STOP'
#!/data/data/com.termux/files/usr/bin/bash
pkill sshd
echo "SSH server stopped"
STOP
chmod +x $PREFIX/bin/heady-ssh-stop

# Step 8: Start SSH server now
sshd
IP=$(ifconfig wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}')

echo ""
echo "=== SETUP COMPLETE ==="
echo "SSH is running on port 8022"
echo ""
echo "From your Windows/Linux computer, connect with:"
echo "  ssh $(whoami)@${IP} -p 8022"
echo ""
echo "Quick commands:"
echo "  heady-ssh-start  — Start SSH server"
echo "  heady-ssh-stop   — Stop SSH server"
echo "  heady-status     — Show phone status"
echo ""
echo "To add your computer's SSH key (no password needed):"
echo "  1. On your computer: cat ~/.ssh/id_rsa.pub"
echo "  2. On phone (Termux): echo 'YOUR_PUB_KEY' >> ~/.ssh/authorized_keys"
echo ""
```

### 11.2 Auto-Start SSH on Boot (Termux:Boot)

Install **Termux:Boot** from F-Droid, then:

```bash
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/start-ssh.sh << 'BOOT'
#!/data/data/com.termux/files/usr/bin/bash
termux-wake-lock
sshd
BOOT
chmod +x ~/.termux/boot/start-ssh.sh
```

### 11.3 SSH Key Setup (No Password Login)

From your **Windows** computer:

```powershell
# Generate key if you don't have one
if (-not (Test-Path ~/.ssh/id_ed25519)) {
    ssh-keygen -t ed25519 -C "heady-desktop"
}

# Copy your public key (manually paste into Termux)
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
Write-Host "Public key copied to clipboard. Paste into Termux:"
Write-Host '  echo "PASTE_HERE" >> ~/.ssh/authorized_keys'

# Connect
# ssh u0_a123@PHONE_IP -p 8022
```

From your **Linux** computer:

```bash
# Generate key if needed
[ -f ~/.ssh/id_ed25519 ] || ssh-keygen -t ed25519 -C "heady-desktop"

# Copy to phone
ssh-copy-id -p 8022 u0_a123@PHONE_IP

# Or manually
cat ~/.ssh/id_ed25519.pub
# Paste into Termux: echo "KEY" >> ~/.ssh/authorized_keys

# Connect
ssh u0_a123@PHONE_IP -p 8022
```

### 11.4 SSH Security Hardening

After keys are working, disable password auth:

```bash
# In Termux, edit sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' $PREFIX/etc/ssh/sshd_config
pkill sshd && sshd
```

| Security Measure | Status |
|---|---|
| Key-only authentication | Enable after setup |
| Non-standard port (8022) | Default in Termux |
| Local network only | Default (don't port-forward) |
| Firewall | Android's built-in; don't expose to internet |
| Strong keys (ed25519) | Use ed25519 over RSA |

---

## 12. Heady IDE — Architecture

### 12.1 IDE Base Options

| Option | Pros | Cons | Recommendation |
|---|---|---|---|
| **Theia** | VS Code extension compatible, open source, browser + desktop, AI-native | Heavier setup | **Best for full IDE** |
| **Code Server** (VS Code in browser) | Familiar UI, instant access from any device | Single-user, less customizable | Good for quick access |
| **Tauri IDE** (custom) | Full control, Sacred Geometry UI | Massive effort | Future phase |
| **Zed** | Rust-native, fast, collaborative | Less extension ecosystem | Watch for maturity |

**Recommended:** Start with **Theia** (self-hosted) for immediate IDE access, plan a custom Tauri-based IDE for Phase 3+.

### 12.2 Theia + Heady Integration

```
┌──────────────────────────────────────────────┐
│  Theia IDE (Browser or Desktop)              │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│  │ Editor   │ │ Terminal  │ │ Buddy Panel │  │
│  │ (Monaco) │ │ (xterm)  │ │ (Chat + AI) │  │
│  └──────────┘ └──────────┘ └─────────────┘  │
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │ Heady Extensions                        ││
│  │ • Buddy Code Assist (explain, refactor) ││
│  │ • Sacred Geometry Theme                 ││
│  │ • Registry Browser                     ││
│  │ • Pipeline Runner                      ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
         ↕ HTTP/WS
┌──────────────────────────────────────────────┐
│  Heady Backend                               │
│  heady-manager.js (:3300)                    │
│  buddy-backend (:3301)                       │
└──────────────────────────────────────────────┘
```

---

## 13. Heady IDE — Desktop Setup

### 13.1 Quick Deploy with Docker

```yaml
# docker-compose.ide.yml
version: "3.8"
services:
  heady-ide:
    image: theiaide/theia:latest
    ports:
      - "3400:3000"
    volumes:
      - ./:/home/project:cached
      - theia-plugins:/home/theia/.theia
    environment:
      - HEADY_ENDPOINT=http://host.docker.internal:3300
      - BUDDY_ENDPOINT=http://host.docker.internal:3301
    restart: unless-stopped
    
volumes:
  theia-plugins:
```

### 13.2 Access

- **Local:** `http://localhost:3400`
- **From phone (same network):** `http://COMPUTER_IP:3400`
- **From phone (via SSH tunnel):** `ssh -L 3400:localhost:3400 user@COMPUTER_IP`

---

## 14. Heady IDE — Mobile Access

From your Android phone:

1. Open **Heady Browser** → navigate to `http://COMPUTER_IP:3400`
2. Or use SSH tunnel: `ssh -L 3400:localhost:3400 user@COMPUTER -p 22`
3. The IDE runs in the browser — responsive enough for quick edits on mobile

For deeper mobile coding:

- **Termux** on phone with `nvim` or `micro` editor for terminal-based editing
- **Code Server** (VS Code in browser) as an alternative to Theia

---

## 15. Unified Backend Service

### 15.1 Service Map

```
Port    Service                 Description
3300    heady-manager.js        Main API gateway, registry, pipeline, patterns, MC
3301    buddy-backend           Buddy chat, memory, actions
3400    heady-ide (Theia)       Browser-based IDE
8022    sshd (phone only)       SSH access into Android
11434   ollama (optional)       Local LLM inference
```

### 15.2 Health Check Script (All Platforms)

```bash
#!/bin/bash
# heady-health-all.sh
echo "=== Heady System Health ==="
echo -n "HeadyManager (3300): "
curl -sf http://localhost:3300/api/health | jq -r '.ok // "DOWN"' 2>/dev/null || echo "DOWN"
echo -n "Buddy Backend (3301): "
curl -sf http://localhost:3301/buddy/status | jq -r '.ok // "DOWN"' 2>/dev/null || echo "DOWN"
echo -n "Heady IDE (3400):     "
curl -sf http://localhost:3400 >/dev/null 2>&1 && echo "UP" || echo "DOWN"
echo -n "Ollama (11434):       "
curl -sf http://localhost:11434/api/tags >/dev/null 2>&1 && echo "UP" || echo "DOWN"
echo "=========================="
```

---

## 16. Security Protocol

### 16.1 Threat Model

| Threat | Mitigation |
|---|---|
| SSH brute force on phone | Key-only auth, non-standard port, local network only |
| Buddy API exposed to network | Bind to localhost by default; use SSH tunnels for remote access |
| LLM data leakage (cloud) | Prefer local models (Ollama); if cloud, use API keys with minimal scope |
| Extension malware | Only install from trusted sources (Mozilla AMO, verified publishers) |
| Stolen device | Encrypted storage (SQLCipher), Android screen lock, remote wipe |
| MITM on sync | E2E encryption for all sync data |

### 16.2 Credential Management

| Credential | Storage |
|---|---|
| SSH keys | `~/.ssh/` with 600 permissions |
| API keys (Buddy, LLM) | Environment variables; never in code |
| Browser passwords | System keychain (Windows Credential Manager / Linux Secret Service) |
| Encryption keys (SQLCipher) | Derived from device-specific key + user PIN |

---

## 17. Day-0 Quick Start (Get Running Today)

### Android Phone

| Step | Action | Time |
|---|---|---|
| 1 | Install **Termux** from F-Droid | 2 min |
| 2 | In Termux: `pkg install openssh && passwd && sshd` | 3 min |
| 3 | Install **Iceraven Browser** (Firefox fork, GeckoView, full extension support) from GitHub/F-Droid | 2 min |
| 4 | In Iceraven: install **uBlock Origin** extension | 1 min |
| 5 | Note your phone IP: in Termux run `ifconfig wlan0` | 1 min |
| 6 | From PC: `ssh u0_aXXX@PHONE_IP -p 8022` — verify SSH works | 2 min |

### Windows Desktop

| Step | Action | Time |
|---|---|---|
| 1 | Install **Zen Browser** or **Floorp** (Firefox-based, customizable) | 3 min |
| 2 | Install uBlock Origin + any AI sidebar extension | 2 min |
| 3 | Start HeadyManager: `cd C:\Users\erich\Heady && node heady-manager.js` | 1 min |
| 4 | Install **Ollama** for local LLM: `winget install Ollama.Ollama` | 5 min |
| 5 | Pull a model: `ollama pull llama3.2` | 10 min |
| 6 | SSH to phone: `ssh u0_aXXX@PHONE_IP -p 8022` — verify | 1 min |

### Linux

| Step | Action | Time |
|---|---|---|
| 1 | Install Firefox or Zen Browser | 2 min |
| 2 | Install Ollama: `curl -fsSL https://ollama.com/install.sh \| sh` | 3 min |
| 3 | Pull model: `ollama pull llama3.2` | 10 min |
| 4 | Start HeadyManager: `cd ~/Heady && node heady-manager.js` | 1 min |
| 5 | SSH to phone: `ssh u0_aXXX@PHONE_IP -p 8022` | 1 min |

**Total Day-0 time: ~45 minutes** to have browser + SSH + local AI on all platforms.

---

## 18. Phase 1: MVP (Week 1–2)

| Deliverable | Platform | Tech | Priority |
|---|---|---|---|
| Buddy Backend API | All | Node.js + Express + Ollama router | P0 |
| Buddy Desktop Client (tray + hotkey) | Windows/Linux | Tauri 2.0 | P0 |
| Buddy Android App (foreground service + chat) | Android | Kotlin + Compose | P0 |
| Phone SSH setup script | Android | Bash (Termux) | P0 |
| Browser extension (Buddy sidebar) | Desktop browsers | WebExtension (Manifest V3) | P1 |
| Theia IDE deployment | Desktop | Docker | P1 |

---

## 19. Phase 2: Custom Builds (Week 3–6)

| Deliverable | Platform | Tech | Priority |
|---|---|---|---|
| Heady Browser Android (GeckoView) | Android | Kotlin + Mozilla Android Components | P0 |
| Heady Browser Desktop (Tauri) | Windows/Linux | Tauri 2.0 + React | P0 |
| Buddy integration in both browsers | All | Shared API | P0 |
| Tab sync across devices | All | Encrypted sync API | P1 |
| Workspace management (tab groups) | All | Custom UI | P1 |
| Reading mode + annotations | All | Mozilla readerview / custom | P2 |

---

## 20. Phase 3: Deep Integration (Month 2–6)

| Deliverable | Description |
|---|---|
| Custom Heady IDE (Tauri-based) | Full IDE with Sacred Geometry theme, Buddy panel, registry browser |
| Agent mode in Buddy | Buddy can browse on your behalf (headless browser actions) |
| Voice interface | "Hey Heady" wake word → Buddy responds |
| Cross-device clipboard | Copy on phone → paste on desktop (encrypted) |
| Buddy plugins | Third-party actions (calendar, email, file management) |
| Vertical templates | Pre-configured browser profiles for different workflows |

---

## 21. Phase 4: Polish + Social Impact (Month 6–12)

| Deliverable | Description |
|---|---|
| Heady Impact Credits | Opt-in ads, revenue shared with social causes |
| Community annotations | Privacy-preserving shared annotations on web pages |
| Heady Paths | Community-curated learning paths through web content |
| Accessibility | Full screen reader support, high contrast, keyboard navigation |
| Internationalization | Multi-language UI and Buddy responses |
| App store releases | Google Play, Microsoft Store, Snap/Flatpak |

---

## 22. Error Elimination Across Rebuilds

Per the **Iterative Rebuild Protocol** (`docs/ITERATIVE_REBUILD_PROTOCOL.md`):

- Every build cycle starts clean; no assumptions carried from previous builds.
- Every error discovered becomes an Error-Candidate entry.
- Recurring errors trigger process review.
- Architecture reviews after every phase completion.
- Test pyramid: unit → integration → E2E → property-based → regression.
- Technical debt items resolved within 2 iterations.

### Browser-Specific Error Categories

| Category | What to Watch |
|---|---|
| **Rendering** | Pages that break, missing fonts, CSS issues — test with top-100 sites |
| **Memory** | GeckoView process leaks, tab accumulation, unbounded history |
| **Networking** | DNS failures, certificate errors, proxy misconfig, timeout handling |
| **Extensions** | Extension crashes, permission escalation, content script conflicts |
| **Buddy API** | Timeout handling, LLM fallback logic, streaming interrupts |
| **Sync** | Conflict resolution, encryption key rotation, offline resilience |
| **Android background** | Service killed by OS, battery drain, notification issues |
| **Desktop tray** | Hotkey conflicts, tray icon disappearing, multi-monitor issues |

---

## 23. Testing Protocol

### 23.1 Browser Testing

```bash
# Test top sites render correctly
SITES=("https://google.com" "https://github.com" "https://youtube.com" "https://reddit.com")
for site in "${SITES[@]}"; do
  echo "Testing: $site"
  # Headless GeckoView or Playwright test
done
```

### 23.2 Buddy API Testing

```bash
# Health check
curl -sf http://localhost:3301/buddy/status

# Chat test
curl -X POST http://localhost:3301/buddy/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello, Buddy!"}]}'

# Memory test
curl -X POST http://localhost:3301/memory/store \
  -H "Content-Type: application/json" \
  -d '{"key":"test","value":"Heady Buddy works"}'

curl http://localhost:3301/memory/recall?query=buddy
```

### 23.3 SSH Testing

```bash
# From computer → phone
ssh -o ConnectTimeout=5 u0_aXXX@PHONE_IP -p 8022 "echo 'SSH OK'"

# File transfer test
scp -P 8022 test.txt u0_aXXX@PHONE_IP:~/test.txt
```

---

## 24. Responsible AI Integration

Per `docs/responsible-ai-policy.md`:

- **AI is a servant, not the center** — Buddy assists, never decides for the user on ethics/relationships/mission
- **Data dignity** — User owns all data; Buddy memory is user-controlled and deletable
- **Consent** — Explicit opt-in for cloud LLM usage; local models by default
- **Bias auditing** — Buddy responses audited for bias across demographics
- **Transparency** — Users can inspect what Buddy remembers and what data is sent where

---

## 25. Registry Integration

All components from this protocol must be registered in `heady-registry.json`:

| Component ID | Type | Source of Truth |
|---|---|---|
| `heady-browser-android` | mobile-app | `heady-browser-android/` |
| `heady-browser-desktop` | desktop-app | `heady-browser-desktop/` |
| `buddy-backend` | service | `src/buddy-backend/` |
| `buddy-android` | mobile-app | (part of heady-browser-android) |
| `buddy-desktop` | desktop-app | (part of heady-browser-desktop) |
| `heady-ide` | dev-environment | `docker-compose.ide.yml` |
| `phone-ssh` | infrastructure | `scripts/phone-ssh-setup.sh` |

---

## Revision History

| Date | Version | Change |
|---|---|---|
| 2026-02-06 | 1.0.0 | Initial protocol — all 25 sections |
