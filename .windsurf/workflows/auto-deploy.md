---
description: Auto-deploy workflow with AI service selection (v2.1)
---

## Scripts
- `scripts/run-auto-deploy.ps1` - Standalone deploy runner (no function wrapping)
- `scripts/hc-sandbox-deploy.ps1` - Full pipeline with modular functions
- `configs/auto-deploy-config.json` - Central configuration

## Permission Model
- SSH identity authenticates as **HeadyMe**
- `heady-me` remote: **can push** (HeadyMe/Heady.git)
- `origin` / `heady-sys` remotes: **cannot push** (HeadySystems/Heady.git, requires collaborator access or deploy key)
- Production push gracefully handles 403 denied

## Pipeline Phases

// turbo
1. **Phase 1: Commit and Push to HeadyMe**
   - Stage and commit pending changes (--no-verify)
   - Push to heady-me remote (primary, always works)
   - Health check HeadyMe cloud endpoint

2. **Phase 2: Validation**
   - Pre-flight system readiness
   - Code quality analysis (threshold: 80/100)
   - Pattern recognition (track degradation)
   - HeadySims drift detection
   - Self-critique confidence scoring

3. **Phase 3: Production Gate (100 pct)**
   - 6 checks must pass: pipeline, services, quality, regressions, drift, cloud reachability
   - Pattern degradation and cloud unreachability are non-blocking warnings
   - Gate score must be 100 pct (or use -ForceProduction to override)

4. **Phase 4: Production Push (permission-aware)**
   - Attempts push to origin (HeadySystems) - expects 403 denial
   - Attempts push to heady-sys mirror - same expectation
   - Logs ACTION REQUIRED if both denied
   - Use -SkipProductionPush to skip entirely

5. **Phase 5: Auto-Train (cascading fallback)**
   - Tries brain.headysystems.com first
   - Falls back to headysystems.com/api
   - Falls back to HeadyMe endpoint
   - Non-blocking if all unavailable
   - Use -SkipTrain to skip

6. **Phase 6: Monorepo Sync**
   - Syncs local Heady-Sandbox directory if it exists

## Known Issues
- Initial push to HeadyMe is ~700MB (git history contains large objects from before .gitignore)
- HeadyMe lacks push access to HeadySystems repos (need collaborator invite or deploy key)
- brain.headysystems.com is intermittently unreachable
