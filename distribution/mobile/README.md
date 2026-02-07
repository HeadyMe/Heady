# Heady Mobile Distribution

All mobile apps for the Heady ecosystem, ready to sideload or publish.

## Android APKs

| APK | Description | Bundle |
|-----|-------------|--------|
| `heady-chat.apk` | AI chat companion | Free / Personal |
| `heady-dev.apk` | Developer tools + code assistant | Dev Pack |
| `heady-voice.apk` | Voice-first AI assistant | Creator Pack |
| `heady-automations.apk` | Automation workflows + triggers | Automations Pack |
| `headyos-mobile.apk` | Full HeadyOS mobile shell | Pro+ |

## Install

```bash
# Install all APKs
cd android && bash install-all-android.sh

# Install individual
adb install android/apks/heady-chat.apk
adb install android/apks/heady-dev.apk
adb install android/apks/heady-voice.apk
adb install android/apks/heady-automations.apk
adb install android/apks/headyos-mobile.apk
```

## iOS

iOS apps are distributed via TestFlight (beta) or App Store (release).
Manifests and provisioning profiles are in `ios/`.

## Features by App

### heady-chat
- Text chat with Heady AI
- Image/file upload
- Conversation history
- Workspace switching

### heady-dev
- Code review and explanation
- Git integration
- Terminal access
- Project management

### heady-voice
- Voice-first interface
- STT/TTS with multiple voices
- Hands-free mode
- Barge-in support

### heady-automations
- Trigger-based workflows
- Scheduled tasks
- Notification-driven actions
- Integration status dashboard
