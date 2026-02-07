---
description: Full guide to using Heady's self-aware, speed-optimized, pattern-recognizing system with pricing and multi-channel connections
---

# Heady Full System Usage Guide

## 1. Start the System
```powershell
node heady-manager.js
```
Boots with: MC Scheduler (speed_priority), Pattern Engine, Self-Critique Engine, Pricing API.

---

## SPEED OPTIMIZATION (Monte Carlo)

## 2. Set Speed Mode
```powershell
# "off" = balanced | "on" = speed priority (default) | "max" = absolute fastest
$body = @{ mode = "max" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/speed-mode" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 3. Plan a Task with MC
```powershell
$body = @{ taskType = "code_generation"; taskMeta = @{ complex = $false } } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/plan" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 4. Record Execution Result (Feedback)
```powershell
$body = @{ taskType = "code_generation"; strategyId = "fast_parallel"; actualLatencyMs = 800; success = $true; qualityScore = 92 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/result" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 5. Check MC Metrics
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/metrics" | ConvertTo-Json -Depth 5
```

## 6. Check Drift Alerts
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/drift" | ConvertTo-Json -Depth 5
```

---

## PATTERN RECOGNITION

## 7. View Recent Patterns
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/patterns/recent" | ConvertTo-Json -Depth 5
```

## 8. View Bottleneck Patterns
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/patterns/bottlenecks" | ConvertTo-Json -Depth 5
```

## 9. View Pattern Summary
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/patterns/summary" | ConvertTo-Json -Depth 5
```

## 10. View Improvement Tasks (from stagnant/degrading patterns)
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/patterns/improvements" | ConvertTo-Json -Depth 5
```

---

## SELF-AWARENESS & SELF-CRITIQUE

## 11. View System Self-Knowledge
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/self/knowledge" | ConvertTo-Json -Depth 5
```

## 12. View Self-Critique Status
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/self/status" | ConvertTo-Json -Depth 5
```

## 13. Record a Critique (manual or automated)
```powershell
$body = @{
  context = "pipeline_execution"
  weaknesses = @("Cold start latency too high", "Pattern engine needs more data")
  severity = "high"
  suggestedImprovements = @("Add warm pool for pipeline agents", "Seed pattern engine with baseline data")
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/self/critique" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 14. View Recent Critiques
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/self/critiques" | ConvertTo-Json -Depth 5
```

## 15. Record an Improvement
```powershell
$body = @{
  description = "Switched to fast_parallel strategy for code_generation"
  type = "routing_change"
  before = "balanced (3200ms avg)"
  after = "fast_parallel (800ms avg)"
  status = "applied"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/self/improvement" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 16. Run Bottleneck Diagnostic
```powershell
$body = @{
  scope = "system"
  latencyData = @{ code_generation = 3200; pipeline_stage = 8000; deployment = 15000 }
  errorRates = @{ code_generation = 0.02; deployment = 0.08 }
} | ConvertTo-Json -Depth 3
Invoke-RestMethod -Uri "http://localhost:3300/api/self/diagnose" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 17. View Diagnostics History
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/self/diagnostics" | ConvertTo-Json -Depth 5
```

---

## CONNECTION HEALTH

## 18. Check a Channel's Health
```powershell
$body = @{ channelId = "ide_extension"; metrics = @{ latencyMs = 450; errorRate = 0.5 } } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/self/connection-health" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 19. View All Connection Health
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/self/connections" | ConvertTo-Json -Depth 5
```

## 20. Run Meta-Analysis (periodic self-review)
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/self/meta-analysis" -Method POST -ContentType "application/json" | ConvertTo-Json -Depth 5
```

---

## PRICING & PAYMENT TIERS

## 21. View Pricing Tiers
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/pricing/tiers" | ConvertTo-Json -Depth 5
```

## 22. View Fair Access Programs
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/pricing/fair-access" | ConvertTo-Json -Depth 5
```

## 23. View Pricing Metrics to Track
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/pricing/metrics" | ConvertTo-Json -Depth 5
```

---

## SPEED HINTS (Use in Prompts)
- "Do X, optimized for fastest possible completion."
- "Plan Y using the minimum-latency path; trade complexity for speed."
- "This is far too slow — re-optimize using fastest Monte Carlo option."
- "Show me the current fastest plan you use for X and how you chose it."
- "Notice this pattern and remember it."
- "What patterns do you see in our recent slowdowns?"
- "Why is this slow? Run a bottleneck diagnostic."

## PRICING TIERS SUMMARY
| Tier | Price | Key Features |
|------|-------|-------------|
| Free | $0 | Basic autocomplete, 20 msgs/day, 1 workspace |
| Pro | $12/mo | Unlimited chat, full services, MC + patterns, 5 workspaces |
| Team | $35/seat/mo | Shared configs, dashboards, admin, unlimited workspaces |
| Enterprise | Custom | SSO, audit, VPC/on-prem, custom models, SLA |

## FAIR ACCESS
- **Students**: Free Pro tier (edu email verification)
- **Nonprofits**: 75% off Team tier
- **Low-income regions**: PPP-adjusted Pro pricing
- **Sponsored seats**: Companies/donors fund seats for others
