# HeadyBuddy Mobile

**Always-On AI Companion for Android** — a foreground service app that keeps HeadyBuddy running persistently on your phone with a floating bubble, notification quick actions, and share target.

## Architecture

```
┌─────────────────────────────────────────────┐
│  HeadyBuddyService (Foreground Service)      │
│  Type: FOREGROUND_SERVICE_TYPE_DATA_SYNC     │
│                                               │
│  ├── Persistent Notification                 │
│  │   ├── "HeadyBuddy is active"              │
│  │   ├── Quick Action: Ask Heady             │
│  │   └── Quick Action: Summarize Clipboard   │
│  │                                            │
│  ├── FloatingBubbleView (Overlay)            │
│  │   ├── Sacred Geometry avatar              │
│  │   ├── Tap → expand chat                   │
│  │   └── Drag to reposition                  │
│  │                                            │
│  ├── HeadyManagerClient                      │
│  │   ├── REST client to heady-manager API    │
│  │   ├── WebSocket for real-time updates     │
│  │   └── Offline queue (Room DB)             │
│  │                                            │
│  └── ContextListener                         │
│      ├── Clipboard monitor                   │
│      ├── App switch detector                 │
│      └── Share intent receiver               │
│                                               │
├── BootReceiver (auto-start on boot)          │
├── ShareActivity (receive shares from apps)   │
└── ChatActivity (full chat UI)                │
└─────────────────────────────────────────────┘
```

## Tech Stack

- **Kotlin** + **Jetpack Compose** for native Android UI
- **Room** for local message/state persistence
- **Retrofit** for heady-manager API calls
- **Hilt** for dependency injection
- **WorkManager** for periodic sync jobs

## Prerequisites

- Android Studio Hedgehog+
- Android SDK 34+
- Java 17+

## Quick Start

```bash
# Open in Android Studio
# Build → Run on device/emulator

# Or via command line:
cd headybuddy-mobile
./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

## Permissions Required

| Permission | Purpose |
|-----------|---------|
| `FOREGROUND_SERVICE` | Always-on background service |
| `FOREGROUND_SERVICE_DATA_SYNC` | Service type declaration |
| `RECEIVE_BOOT_COMPLETED` | Auto-start on device boot |
| `SYSTEM_ALERT_WINDOW` | Floating bubble overlay |
| `INTERNET` | API communication |
| `POST_NOTIFICATIONS` | Persistent notification |

## Battery Optimization

For reliable always-on operation on OnePlus Open:

1. Settings → Battery → Battery Optimization → HeadyBuddy → Don't Optimize
2. Settings → Apps → HeadyBuddy → Battery → Allow Background Activity
3. Lock the app in Recent Apps (swipe down on card)

---

*Built by HeadySystems. Sacred Geometry Architecture.*
