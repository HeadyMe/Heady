# Heady Mobile — Android Distribution

## APKs

When built, the following APKs are placed here:

| APK | Description | Bundle |
|-----|-------------|--------|
| `heady-chat.apk` | Conversational AI companion | Personal, Pro |
| `heady-dev.apk` | Mobile dev assistant (PRs, code, queries) | Dev Pack, Pro |
| `heady-voice.apk` | Voice-first assistant with STT/TTS | Creator Pack, Pro |
| `heady-automations.apk` | Task automation control panel | Automations Pack, Pro |
| `headyos-mobile.apk` | Full HeadyOS mobile shell | Pro, Enterprise |

## Install

```bash
# Install all APKs via ADB
bash install-all-android.sh

# Install specific APK
adb install heady-chat.apk

# Install to specific device
adb -s <device_serial> install heady-chat.apk
```

## Building

APKs are built from:
- `headybuddy-mobile/` — HeadyBuddy Chat + Voice
- `headybrowser-mobile/` — HeadyBrowser for Android
- HeadyOS Mobile Shell (React Native / Flutter)

Build commands:
```bash
cd headybuddy-mobile && npx react-native run-android --variant=release
cd headybrowser-mobile && ./gradlew assembleRelease
```

## Signing

Release APKs must be signed with the Heady release keystore.
See `env/android.env.example` for keystore configuration.

---
*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
