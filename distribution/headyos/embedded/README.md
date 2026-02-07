# HeadyOS Embedded

HeadyOS for IoT, kiosk, and embedded devices using Yocto/Buildroot.

## Build Tracks

| Track | Tool | Target | Files |
|-------|------|--------|-------|
| **Yocto** | meta-heady layer | RPi, generic ARM/x86 | `heady-os/embedded/` |
| **Buildroot** | HeadyOS defconfig | x86_64, ARM | `heady-os/linux-distro/` |
| **Docker** | Minimal container | Any Docker host | `distribution/docker/profiles/minimal.yml` |

## Quick Start (Docker Minimal)

```bash
cd distribution/docker
docker compose -f base.yml -f profiles/minimal.yml up
```

This starts only `heady-api` + `model-runner` — the bare minimum AI chat endpoint.

## For Yocto/Buildroot Builds

See `heady-os/embedded/` for the full Yocto layer and RPi configs.
See `heady-os/linux-distro/` for the Buildroot-based custom Linux distro.

## Use Cases

- **Kiosk mode** — Dedicated AI terminal in lobbies, libraries, schools
- **IoT gateway** — AI-powered device management and automation
- **Appliance** — Dedicated Heady hardware (RPi, mini-PC)
