---
description: HCFP Infrastructure Setup - Clean builds, domain migration, device provisioning
auto_execution_mode: 3
---

# Heady Complete Infrastructure Pipeline (HCIP)

This workflow systematically sets up the entire Heady infrastructure:
1. Replaces localhost with service domains
2. Configures clean-build CI/CD with error alerting
3. Provisions all devices with extensions
4. Sets up observability and alerting

## Prerequisites

- PowerShell 7+ (Windows) or PowerShell Core (macOS/Linux)
- Admin/sudo access for hosts file modification
- Node.js 20+ and Python 3.12+ for builds

## Quick Start

```powershell
# Run complete setup
.\scripts\hc-infrastructure-setup.ps1 -Mode full-setup

# Or step by step
.\scripts\hc-infrastructure-setup.ps1 -Mode inventory    # Find localhost refs
.\scripts\hc-infrastructure-setup.ps1 -Mode migrate     # Replace with domains
.\scripts\hc-infrastructure-setup.ps1 -Mode provision # Install everything
.\scripts\hc-infrastructure-setup.ps1 -Mode clean-build # Build from scratch
```

## Mode Details

### 1. Inventory Mode

Scans entire codebase for localhost/127.0.0.1 references and creates a migration plan.

```powershell
.\scripts\hc-infrastructure-setup.ps1 -Mode inventory
```

**Output:**
- CSV file with all localhost references
- Suggested domain replacements
- Service-to-port mapping

### 2. Migrate Mode

Replaces localhost references with proper service domains and updates hosts file.

```powershell
.\scripts\hc-infrastructure-setup.ps1 -Mode migrate
# Or skip confirmation
.\scripts\hc-infrastructure-setup.ps1 -Mode migrate -Force
```

**Changes:**
- Replaces `localhost:3300` → `manager.heady.local`
- Replaces `localhost:5000` → `worker.heady.local`
- Replaces `localhost:3000` → `dashboard.heady.local`
- Updates `/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts`
- Backs up original hosts file

**DNS Entries Created:**
```
127.0.0.1 manager.heady.local
127.0.0.1 worker.heady.local
127.0.0.1 dashboard.heady.local
127.0.0.1 www.heady.local
127.0.0.1 api.heady.local
127.0.0.1 cache.heady.local
127.0.0.1 db.heady.local
127.0.0.1 metrics.heady.local
127.0.0.1 grafana.heady.local
127.0.0.1 imagination.heady.local
127.0.0.1 traces.heady.local
127.0.0.1 alerts.heady.local
```

### 3. Provision Mode

Installs all required applications, extensions, and configurations.

```powershell
.\scripts\hc-infrastructure-setup.ps1 -Mode provision
```

**Installs:**
- **Browsers:** Chrome, Firefox, Edge (with extensions)
- **Editors:** VS Code, JetBrains toolbox (with extensions)
- **Languages:** Node.js 20.18.1, Python 3.12.7
- **Tools:** Docker, Git, Postman, 1Password, Slack, Discord
- **Heady-specific:** Local extensions from `distribution/`

**VS Code Extensions:**
- TypeScript, Python, ESLint, Prettier support
- Docker, Kubernetes, YAML tools
- GitLens, GitHub Copilot
- Heady Dev Companion (local)

**Browser Extensions:**
- React/Redux DevTools
- Heady Companion (local build)
- Wappalyzer (technology profiler)
- uBlock Origin (ad/tracker blocker)

### 4. Clean-Build Mode

Performs a full clean build with error alerting (no auto-rebuild).

```powershell
.\scripts\hc-infrastructure-setup.ps1 -Mode clean-build
```

**Build Steps:**
1. Clean environment (remove node_modules, dist, cache)
2. Install dependencies (`npm ci`)
3. Lint code
4. Run tests
5. Build application
6. Verify artifacts

**Error Handling:**
- ❌ **NO AUTO-REBUILD** - If build fails, alerts are sent
- Errors are classified: network, permission, code, resource
- Desktop notification + webhook alert (if configured)
- Human must fix issue and manually retry

**Configure Alerts:**
```powershell
$env:HEADY_ALERT_WEBHOOK = "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
.\scripts\hc-infrastructure-setup.ps1 -Mode clean-build
```

### 5. Full-Setup Mode

Runs all modes in sequence for complete setup.

```powershell
.\scripts\hc-infrastructure-setup.ps1 -Mode full-setup
```

**Timeline:**
- Inventory: ~30 seconds
- Migrate: ~10 seconds
- Provision: 5-15 minutes (downloads)
- Clean-build: 3-10 minutes

## Service Domain Reference

| Service | Old URL | New Domain | Port |
|---------|---------|------------|------|
| Heady Manager | localhost:3300 | manager.heady.local | 3300 |
| Python Worker | localhost:5000 | worker.heady.local | 5000 |
| Web Dashboard | localhost:3000 | dashboard.heady.local | 3000 |
| Public Site | localhost:8080 | www.heady.local | 8080 |
| API Gateway | localhost:8081 | api.heady.local | 8081 |
| Redis Cache | localhost:6379 | cache.heady.local | 6379 |
| PostgreSQL | localhost:5432 | db.heady.local | 5432 |
| Metrics | localhost:9090 | metrics.heady.local | 9090 |
| Grafana | localhost:3001 | grafana.heady.local | 3001 |
| Imagination | localhost:3400 | imagination.heady.local | 3400 |

## CI/CD Integration

### GitHub Actions Workflow

The `.github/workflows/clean-build.yml` runs on every push:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

**Jobs:**
1. **Pre-flight:** Checks for localhost references
2. **Build Manager:** Clean Node.js build
3. **Build Frontend:** React app build
4. **Build Worker:** Python + Docker
5. **Integration Tests:** Full stack testing
6. **Security Scan:** Trivy vulnerability check
7. **Deploy Staging:** Auto-deploy on develop
8. **Deploy Production:** Manual approval on main

**Key Features:**
- Full clean build every time (no incremental artifacts)
- Pinned dependencies (lockfiles committed)
- Deterministic builds
- Error classification + retry for transient issues
- Slack notifications for failures/deployments

### Local Clean Build

For development, use the script:

```powershell
# Before committing
.\scripts\hc-infrastructure-setup.ps1 -Mode clean-build

# This ensures what you push matches CI
```

## Device Management

### Cross-Platform Setup

**Windows (Intune/Autopilot):**
```powershell
# Initial enrollment
& $env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe -Command "
    Install-Script -Name Get-WindowsAutoPilotInfo -Force
    Get-WindowsAutoPilotInfo -Online
"
```

**macOS (MDM):**
```bash
# Apple Business Manager enrollment
# Device appears in MDM console automatically
# Heady profile pushed over-the-air
```

**Linux (Ansible):**
```bash
# Run device provisioning playbook
ansible-playbook -i inventory/localhost device-provision.yml
```

### Required Applications (All Devices)

**Security:**
- 1Password (password manager)
- VPN client (Tailscale/WireGuard)
- 2FA authenticator

**Communication:**
- Signal (secure messaging)
- Slack (team chat)
- Discord (community)

**Productivity:**
- Obsidian (knowledge base)
- Figma (design)
- Notion (docs)

### Development Workstation (Additional)

**Languages & Runtimes:**
- Node.js 20.18.1
- Python 3.12.7
- Docker Desktop
- Git

**Browsers (all with dev profile):**
- Chrome + React/Vue DevTools + Heady Companion
- Firefox + Heady Assistant
- Edge (backup)

**Editors:**
- VS Code + 15+ extensions
- JetBrains toolbox (IntelliJ, PyCharm, WebStorm)

## Monitoring & Alerting

### What Gets Monitored

**Services:**
- Heady Manager (health, response time, error rate)
- Python Worker (queue depth, processing time)
- PostgreSQL (connections, slow queries)
- Redis (memory, hit rate)

**Infrastructure:**
- CPU/Memory/Disk on all nodes
- Network connectivity
- SSL certificate expiry

**Security:**
- Failed login attempts
- Unauthorized access
- Vulnerability scan results

### Alert Routing

| Severity | Channel | Response Time |
|----------|---------|---------------|
| Critical | Signal + Slack @channel | Immediate |
| Warning | Slack #alerts | 1 hour |
| Info | Slack #ops | Next business day |

### Dashboard URLs

Once deployed:
- **Main Dashboard:** https://grafana.heady.local/d/heady-overview
- **Manager Metrics:** https://grafana.heady.local/d/manager-details
- **Imagination Engine:** https://grafana.heady.local/d/imagination

## Troubleshooting

### DNS Not Resolving

```powershell
# Windows
ipconfig /flushdns

# macOS
sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches
```

### Build Fails

```powershell
# Check for localhost references still present
.\scripts\hc-infrastructure-setup.ps1 -Mode inventory

# Clean and retry
Remove-Item -Recurse -Force node_modules, dist
npm cache clean --force
.\scripts\hc-infrastructure-setup.ps1 -Mode clean-build
```

### Extension Not Loading

```powershell
# Chrome: Load unpacked extension
# 1. chrome://extensions
# 2. Enable "Developer mode"
# 3. "Load unpacked" → select distribution/browser/extensions/chrome/

# VS Code: Install from VSIX
# 1. Extensions view
# 2. "..." menu → "Install from VSIX"
# 3. Select distribution/ide/vscode/heady-*.vsix
```

## Maintenance

### Weekly Tasks

```powershell
# 1. Run clean build to verify health
.\scripts\hc-infrastructure-setup.ps1 -Mode clean-build

# 2. Check for drift in localhost references
.\scripts\hc-infrastructure-setup.ps1 -Mode inventory

# 3. Update dependencies
npm outdated
# Review and update as needed
```

### Monthly Tasks

1. Review and rotate secrets
2. Update browser/IDE extensions
3. Check disk usage on all nodes
4. Verify backup integrity

## Environment-Specific Notes

### Local Development

- All services run on localhost (via hosts file mapping)
- Use `heady.local` domains for consistency with production
- Hot reload enabled for manager/frontend

### Staging

- Separate subdomain: `*.staging.internal.heady.systems`
- Auto-deploy from develop branch
- Reduced resource limits
- Test data only

### Production

- Public domains: `*.heady.systems`
- Manual approval required for deploys
- Full monitoring and alerting
- Multi-region if configured

## Next Steps

After running full-setup:

1. **Verify domains:** `curl http://manager.heady.local:3300/api/health`
2. **Start developing:** `npm run dev` in manager and frontend
3. **Run tests:** `npm test`
4. **Check dashboards:** http://grafana.heady.local

## Support

If issues occur:
1. Check logs: `Get-Content /var/log/heady/manager.log -Tail 50`
2. Review alerts in Slack
3. Check runbook: https://docs.heady.io/runbooks/
4. File issue: https://github.com/HeadySystems/Heady/issues

---

*Part of the Heady Sacred Geometry Infrastructure*
*Clean builds | Domain-driven | Alert-driven | Human-in-the-loop*
