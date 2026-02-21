---
description: HCFP Error Recovery & Clean Build Protocol - Prevent catastrophic rebuilds with intelligent error classification
---

# HCFP Error Recovery & Clean Build Protocol

## Overview

This workflow ensures that **every change triggers a full clean build** with **strong error handling** that prevents blind, catastrophic rebuilds. Errors are classified, retried intelligently, and escalated appropriately.

## Core Principles

1. **Clean Build on Every Change**: No incremental artifacts, no cache hiding issues
2. **Error Classification**: Transient vs. non-recoverable errors handled differently
3. **Intelligent Retries**: Transient errors retry automatically (network, timeouts)
4. **Human Escalation**: Code/config errors require human intervention
5. **No Panic Rebuilds**: Never nuke the project on failure—diagnose first

## Error Classification Matrix

### Transient (Auto-Retry)
- Network timeouts (ETIMEDOUT, ECONNREFUSED)
- Registry/package manager issues (npm registry down)
- Flaky tests (intermittent failures)
- Resource contention (temporary OOM, disk full)
- **Action**: Retry same step up to 3 times, then escalate

### Non-Recoverable (Fail Fast)
- Syntax errors (SyntaxError, ReferenceError)
- Missing files or corrupted repo state
- Configuration errors (invalid YAML, missing env vars)
- Test failures (consistent, reproducible)
- **Action**: Fail immediately, open ticket, require human fix

### Infrastructure (Escalate)
- Permission errors (EPERM, EACCES)
- Disk/memory exhaustion
- Docker/container issues
- **Action**: Alert ops team, provide diagnostics

## Workflow Steps

### 1. Pre-flight Checks (Always Run)
```bash
# Check for forbidden localhost references
grep -r "http://localhost\|127.0.0.1" --include="*.js" --include="*.json" --include="*.yaml"

# Verify service discovery config is valid
node scripts/validate-domains.js

# Check for uncommitted changes
git status --porcelain

# Verify all required env vars are set
node scripts/validate-env.js
```

### 2. Clean Build (Full Rebuild)
```bash
# Remove ALL build artifacts
rm -rf node_modules dist .heady_cache coverage

# Clean package manager caches
npm cache clean --force

# Install from lock file (deterministic)
npm ci

# Run full test suite
npm test

# Build application
npm run build

# Verify artifacts exist
test -d dist && echo "✅ Build successful"
```

### 3. Error Detection & Classification
```bash
# Capture all output
npm test 2>&1 | tee test-output.txt

# Classify error
if grep -q "ETIMEDOUT\|ECONNREFUSED" test-output.txt; then
  echo "error_type=transient:network"
elif grep -q "SyntaxError\|ReferenceError" test-output.txt; then
  echo "error_type=non-recoverable:code"
elif grep -q "EPERM\|EACCES" test-output.txt; then
  echo "error_type=infrastructure:permission"
else
  echo "error_type=unknown"
fi
```

### 4. Retry Logic (Transient Only)
```bash
# Retry transient errors
if [ "$error_type" == "transient:network" ]; then
  for attempt in {1..3}; do
    echo "Retry attempt $attempt/3..."
    npm test && break
    sleep $((attempt * 10))  # Exponential backoff
  done
fi
```

### 5. Escalation (Non-Recoverable)
```bash
# Create GitHub issue with diagnostics
gh issue create \
  --title "Build failed: $error_type" \
  --body "$(cat test-output.txt)" \
  --label "build-failure,needs-investigation"

# Send Slack alert
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"🚨 Build failed: $error_type\",\"blocks\":[...]}"

# Block deployment
exit 1
```

## Implementation in CI/CD

### GitHub Actions Integration

```yaml
# .github/workflows/clean-build.yml
- name: Run tests
  id: test
  run: npm test 2>&1 | tee test-output.txt
  continue-on-error: true

- name: Classify error
  id: classify
  if: failure()
  run: |
    if grep -q "ETIMEDOUT\|ECONNREFUSED" test-output.txt; then
      echo "error_type=transient" >> $GITHUB_OUTPUT
    elif grep -q "SyntaxError" test-output.txt; then
      echo "error_type=non-recoverable" >> $GITHUB_OUTPUT
    fi

- name: Retry transient errors
  if: steps.classify.outputs.error_type == 'transient'
  run: |
    for i in {1..3}; do
      npm test && exit 0
      sleep $((i * 10))
    done
    exit 1

- name: Escalate non-recoverable
  if: steps.classify.outputs.error_type == 'non-recoverable'
  run: |
    gh issue create --title "Build failed: code error" --body "$(cat test-output.txt)"
    exit 1
```

## Local Development

### Before Committing

```bash
# Run clean build locally
npm run clean-build

# Verify no localhost references
npm run check:domains

# Run full test suite
npm test

# Lint and format
npm run lint
npm run format
```

### If Build Fails Locally

1. **Check error type**: Is it transient or code?
2. **For transient**: Retry manually, check network/resources
3. **For code**: Fix the issue, don't rebuild blindly
4. **Verify fix**: Run clean build again
5. **Commit**: Only commit after clean build passes

## Monitoring & Alerts

### Build Metrics
- Build duration (target: <10 min)
- Success rate (target: >95%)
- Error type distribution
- Retry effectiveness

### Alerts
- **Critical**: Non-recoverable errors → GitHub issue + Slack
- **Warning**: Transient errors after 3 retries → Slack
- **Info**: Successful builds → Slack summary

### Dashboard
```
Build Status Dashboard (http://localhost:3300/api/build-status)
├── Last 24 hours: 47 builds, 44 passed (93.6%)
├── Error breakdown:
│   ├── Transient (retried): 2
│   ├── Non-recoverable: 1
│   └── Infrastructure: 0
└── Slowest stages:
    ├── Integration tests: 5m 23s
    ├── Security scan: 3m 12s
    └── Build manager: 2m 45s
```

## Troubleshooting

### "Build failed but I don't know why"
1. Check the error classification: `grep error_type build-output.txt`
2. Look at the full logs: `cat test-output.txt | tail -50`
3. Check if it's transient: Try running locally again
4. If non-recoverable: Fix the code issue

### "Transient error keeps happening"
1. Check network connectivity
2. Check if npm registry is down
3. Check disk space: `df -h`
4. Check memory: `free -h`
5. If persistent, escalate to ops

### "I want to skip the clean build"
**Don't.** The clean build is there to catch issues early. If you skip it:
- Hidden issues will appear in production
- Caches may hide bugs
- Deployments become unreliable

Instead, optimize the build (parallel stages, better caching of inputs).

## Integration with HCFP

This error recovery protocol is integrated into the HCFullPipeline:

1. **Channel Entry** → Pre-flight checks
2. **Ingest** → Validate inputs
3. **Plan** → HeadySims selects build strategy
4. **Execute** → Clean build with error classification
5. **Recover** → Retry or escalate based on error type
6. **Self-Critique** → Analyze build failures
7. **Optimize** → Improve build times
8. **Finalize** → Deploy only if build passed

## References

- Clean Build CI: `.github/workflows/clean-build.yml`
- Error Classification: `scripts/classify-error.js`
- Validation Scripts: `scripts/validate-*.js`
- Monitoring: `src/hc_build_monitor.js`
