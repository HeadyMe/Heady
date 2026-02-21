---
description: HCFP Clean Build & Deployment Workflow
tags: [hcfp, build, deployment, ci-cd, clean-build, error-handling]
---

# HCFP Clean Build Workflow

## Overview

**HCFP** (Heady Clean Full Pipeline) ensures every change triggers a clean build from scratch with intelligent error handling and recovery. This prevents incremental build artifacts from hiding issues and guarantees reproducible deployments.

## Core Principles

1. **Clean Build Every Time** — No incremental artifacts trusted as final verdict
2. **Intelligent Error Handling** — Classify errors as recoverable vs non-recoverable
3. **Auto-Retry Logic** — Transient errors (network, timeouts) get automatic retries
4. **Fail Fast on Code Errors** — Syntax errors, config issues fail immediately
5. **Alert on Action Required** — Notify only when human intervention needed

## Quick Start

### Run Clean Build Locally

```powershell
# Full clean build (recommended)
.\scripts\hcfp-build.ps1 -FullRebuild

# Build specific components only
.\scripts\hcfp-build.ps1 -Components "manager,frontend"

# Skip tests for faster iteration
.\scripts\hcfp-build.ps1 -SkipTests

# Build and prepare for deployment
.\scripts\hcfp-build.ps1 -Deploy
```

### CI/CD Pipeline (GitHub Actions)

The pipeline runs automatically on every push/PR:

```yaml
# .github/workflows/hcfp-clean-build.yml
# Triggers: push to main, PR to main, manual dispatch
```

View runs: https://github.com/HeadySystems/Heady/actions

## Build Phases

### Phase 1: Environment Setup

**Actions:**
- Verify Node.js version (20.18.1)
- Verify Python version (3.12.7)
- Scan for localhost references in code
- Clean dependency caches (tools only, not artifacts)

**Success Criteria:**
- All tools present and correct versions
- No critical localhost references in production code

**Failure Handling:**
- Missing tools → Install instructions shown
- Version mismatch → Warning, attempt to use available version
- localhost refs found → Warning, migration plan displayed

### Phase 2: Clean Workspace

**Actions:**
- Remove all build artifacts:
  - `dist/`
  - `build/`
  - `.next/`
  - `out/`
  - `coverage/`
  - `.nyc_output/`
  - `node_modules/.cache/`
- Clean npm/yarn/pnpm caches

**Success Criteria:**
- Workspace is pristine
- No old artifacts remain

### Phase 3: Dependency Install

**Actions:**
- `npm ci` (clean install, ignores cache)
- `pip install -r requirements.txt`
- Verify all dependencies installed

**Error Classification:**

| Error Pattern | Type | Action |
|--------------|------|--------|
| `ECONNREFUSED`, `ETIMEDOUT`, `fetch failed` | Transient Network | Retry up to 2 times with 30s delay |
| `EACCES`, `EPERM`, `permission denied` | Permission | Fail immediately, show fix instructions |
| `ENOENT`, `Module not found` | Code/Config | Fail immediately, requires code fix |
| `out of memory`, `ENOMEM` | Resource | Fail immediately, check system resources |

### Phase 4: Component Build

**Components Built:**

1. **Manager** (`npm run build:manager`)
   - Main Heady orchestrator
   - Port: 3300

2. **Worker** (`pip install` + compile)
   - Python backend worker
   - Dependencies: transformers, torch

3. **Frontend** (`npm run build:frontend`)
   - React web dashboard
   - Port: 3000

4. **Browser Extensions** (`npm run build` in chrome/ dir)
   - Chrome, Edge, Firefox builds

5. **Mobile** (optional, if configured)
   - React Native builds

**Build Retry Logic:**

```powershell
foreach ($component in $components) {
    $attempt = 0
    $maxRetries = 2
    
    while ($attempt -lt $maxRetries) {
        $attempt++
        
        try {
            Build-Component $component
            break  # Success, exit retry loop
        } catch {
            $errorType = Classify-Error $_
            
            switch ($errorType) {
                "TransientNetwork" {
                    if ($attempt -lt $maxRetries) {
                        Write-Host "🔄 Retrying in 30s..."
                        Start-Sleep 30
                    }
                }
                default {
                    throw "Non-recoverable error: $_"
                }
            }
        }
    }
}
```

### Phase 5: Test Suite

**Tests Run:**

1. **Unit Tests** (`npm run test:unit`)
   - Fast, isolated tests
   - Coverage reporting

2. **Integration Tests** (`npm run test:integration`)
   - Service integration tests
   - Database connectivity

3. **E2E Tests** (`npm run test:e2e`)
   - Full user journey tests
   - Browser automation

**Test Failure Handling:**

- Unit test fail → Build continues, warning shown
- Integration test fail → Build continues if optional
- E2E test fail → Build continues, manual review flagged

### Phase 6: Security & Quality

**Checks:**

1. **Secret Detection** (TruffleHog)
   - Scan for hardcoded secrets
   - Check commit history

2. **Dependency Audit** (`npm audit`)
   - Vulnerability scanning
   - Moderate+ level warnings

3. **Lint & Format** (`npm run lint`)
   - ESLint checks
   - Prettier format verification

4. **Hardcoded Secret Check**
   - Pattern: `password = "..."`
   - Pattern: `api_key = "..."`
   - Pattern: `secret = "..."`
   - Pattern: `token = "..."` (20+ chars)

**Security Failure Handling:**

- Secrets found → **BUILD FAILS**, immediate notification
- High-severity vulnerabilities → **BUILD FAILS**
- Lint errors → Warning, build continues

### Phase 7: Deploy Preparation (Optional)

**Actions (when `-Deploy` flag set):**

1. Collect all build artifacts
2. Verify artifact integrity
3. Create deployment package with timestamp
4. Generate deployment manifest
5. Run HeadySync integration check

**Output:**
- `deploy-package-YYYYMMDD-HHMMSS/`
- Contains: dist/, build/, manifest.json

## Error Handling Matrix

| Error Type | Examples | Recovery Strategy | Alert Level |
|-----------|----------|-----------------|-------------|
| **Transient Network** | Timeout, DNS fail, connection refused | Auto-retry (2x), then fail | Warning |
| **Permission** | Access denied, EACCES | Fail immediately, manual fix required | Critical |
| **Code/Config** | Syntax error, missing import | Fail immediately, requires code change | Critical |
| **Resource** | Out of memory, disk full | Fail immediately, check resources | Critical |
| **Test Failure** | Assertion fail, timeout | Continue with warning | Warning |
| **Security** | Secret found, vulnerability | Fail immediately | Critical |

## Notification System

### When You Get Alerted

**Immediate (Critical):**
- Build fails with non-recoverable error
- Security vulnerability detected
- Permission errors

**Digest (Warning):**
- Transient errors that recovered after retry
- Test failures
- Lint warnings
- localhost references found

**Info Only:**
- Build successful
- Deployment completed
- Metrics within normal range

### Notification Channels

Configure in `configs/observability.yaml`:

```yaml
notifications:
  slack:
    webhook: ${{ secrets.SLACK_WEBHOOK_URL }}
    channel: "#heady-alerts"
    
  email:
    to: ["devops@heady.io", "oncall@heady.io"]
    
  push:
    provider: pushover
    
  sms:
    provider: twilio  # Critical only
```

## Localhost Migration Integration

### Automatic Scanning

The build pipeline automatically scans for localhost references:

```powershell
# During Phase 1 (Setup)
python scripts/localhost-inventory.py --root . --output localhost-check.json
```

### Migration Report

If localhost references found:

```
⚠️  Found 23 localhost references in codebase
  - manager.dev.local.heady.internal:3300 (replace localhost:3300)
  - db-postgres.dev.local.heady.internal:5432 (replace localhost:5432)
  - ...

Migration Plan:
  1. Update DNS records
  2. Configure services to bind to new domains
  3. Update all client references
  4. Add mTLS where required
  5. Update firewall rules
  6. Test connectivity
```

### CI Enforcement

The pipeline **FAILS** if new localhost references are introduced:

```yaml
localhost-lint:
  name: 🚫 Localhost Lint
  if: grep -rE "localhost|127\.0\.0\.1" src/; then exit 1; fi
```

## Device Extension Sync

### Automatic Installation

Install all extensions across devices:

```powershell
# Install all extensions (browsers + IDEs)
.\scripts\install-extensions.ps1

# Install only Heady extensions
.\scripts\install-extensions.ps1 -HeadyOnly

# Install for specific browser/IDE
.\scripts\install-extensions.ps1 -Browser chrome -IDE vscode
```

### Sync Configuration

Extensions sync automatically via:

- **VS Code**: Settings Sync (GitHub/Microsoft account)
- **JetBrains**: Settings Repository (Git-backed)
- **Browsers**: Profile sync + Heady extension auto-update

## Dashboards & Monitoring

### Build Metrics

View at: https://grafana.heady.io/d/build-pipeline

**Metrics Tracked:**

- Build duration per component
- Success/failure rates
- Error classification counts
- Test pass rates
- localhost ref counts (should trend to 0)

### Device Fleet Health

View at: https://grafana.heady.io/d/device-fleet

**Metrics:**

- Devices online/offline
- Extension versions across fleet
- Sync status
- Disk/memory usage

### Alert History

View at: https://grafana.heady.io/d/alerts

## Troubleshooting

### Build Fails with "Module not found"

**Diagnosis:** Dependency not installed or version mismatch

**Fix:**
```powershell
# Clean reinstall
Remove-Item -Recurse -Force node_modules
npm ci
```

### Build Fails with Permission Error

**Diagnosis:** File/directory permissions issue

**Fix:**
```powershell
# Windows - Run as Administrator
# Or fix permissions:
icacls . /grant "$env:USERNAME:(OI)(CI)F" /T
```

### Network Timeout During Build

**Diagnosis:** Network issue or registry slowness

**Fix:**
```powershell
# Already auto-retried 2x by pipeline
# If persistent, check:
ping registry.npmjs.org
npm config set registry https://registry.npmmirror.com  # Mirror
```

### Tests Pass Locally but Fail in CI

**Diagnosis:** Environment difference or flaky test

**Fix:**
```powershell
# Run with same conditions as CI
.\scripts\hcfp-build.ps1 -FullRebuild -SkipTests:$false
```

## Advanced Configuration

### Custom Build Components

Edit `scripts/hcfp-build.ps1`:

```powershell
$components = @(
    @{ Name = "my-service"; Command = "npm run build:my-service"; Dir = "services/my-service" }
)
```

### Custom Error Patterns

Add to `Classify-Error` function:

```powershell
CustomErrors = @(
    "my-custom-error-pattern"
)
```

### Custom Notifications

Add webhook in `configs/observability.yaml`:

```yaml
notifications:
  custom:
    webhook: https://hooks.example.com/heady
    events: [build_failed, security_alert]
```

## Integration with Heady Systems

### HeadySync Integration

After successful build:

```powershell
# Auto-runs at end of build with -Deploy flag
.\scripts\Heady-Sync.ps1

# Syncs to:
# - heady-me (github.com/HeadyMe/Heady)
# - origin (github.com/HeadySystems/Heady)
# - sandbox (github.com/HeadySystems/sandbox)
```

### Layer Switcher Integration

Build artifacts automatically tagged with layer:

```powershell
hl status  # Shows active layer
# Build outputs labeled: heady-[layer]-[version]
```

### HeadySims Optimization

Build pipeline feeds into MC scheduler:

```powershell
# Build duration data feeds MC optimization
POST /api/HeadySims/result
{
  "taskType": "build",
  "planUsed": "cached_fast",
  "latencyMs": 45000,
  "qualityScore": 1.0
}
```

## Best Practices

1. **Always use `-FullRebuild` for production builds**
2. **Never commit with `--no-verify` unless emergency**
3. **Review all warnings, not just errors**
4. **Keep localhost ref count at 0**
5. **Update extensions monthly**
6. **Monitor build duration trends**

## Resources

- **Build Logs:** https://github.com/HeadySystems/Heady/actions
- **Runbooks:** https://docs.heady.io/runbooks
- **Metrics:** https://grafana.heady.io
- **Alerts:** https://alerts.heady.io

## Support

- **Slack:** #heady-dev
- **Email:** devops@heady.io
- **Issues:** https://github.com/HeadySystems/Heady/issues
