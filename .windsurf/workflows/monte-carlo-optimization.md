---
description: Monte Carlo speed optimization and pattern recognition protocol
---

# Monte Carlo Optimization & Pattern Recognition Workflow

## Standing Directive
Speed is a first-class objective. Latency is a defect. Patterns must continuously improve.

## 1. Check Current Speed Status
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/status" | ConvertTo-Json -Depth 5
```

## 2. Check Pattern Engine Summary
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/patterns/summary" | ConvertTo-Json -Depth 5
```

## 3. Generate a Monte Carlo Plan for a Task
```powershell
$body = @{ taskType = "code_generation"; taskMeta = @{ complex = $false }; constraints = @{} } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/plan" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 4. Record Execution Result (Feedback Loop)
```powershell
$body = @{ taskType = "code_generation"; strategyId = "fast_parallel"; actualLatencyMs = 1200; success = $true; qualityScore = 90 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/result" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 5. View Metrics (Per Task Type or Global)
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/metrics" | ConvertTo-Json -Depth 5
```

## 6. Check for Drift Alerts
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/drift" | ConvertTo-Json -Depth 5
```

## 7. Surface Recent Patterns
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/patterns/recent?limit=10" | ConvertTo-Json -Depth 5
```

## 8. Check Bottleneck Patterns
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/patterns/bottlenecks" | ConvertTo-Json -Depth 5
```

## 9. Trigger Full MC Simulation Cycle
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/simulate" -Method POST | ConvertTo-Json -Depth 5
```

## 10. Promote a Pattern ("Notice This")
```powershell
$body = @{ category = "performance"; name = "latency:code_generation"; reason = "Consistently slow" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/patterns/promote" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 11. View Improvement Tasks
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/patterns/improvements" | ConvertTo-Json -Depth 5
```

## 12. Set Speed Priority Mode
```powershell
# Options: "off" (balanced), "on" (speed priority), "max" (absolute fastest)
$body = @{ mode = "on" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/speed-mode" -Method POST -Body $body -ContentType "application/json" | ConvertTo-Json -Depth 5
```

## 13. Check Current Speed Mode
// turbo
```powershell
Invoke-RestMethod -Uri "http://localhost:3300/api/monte-carlo/speed-mode" | ConvertTo-Json -Depth 5
```

## Speed Modes Explained
| Mode | Min Quality | Speed Weight | Quality Weight | When |
|------|------------|-------------|---------------|------|
| `off` | 50 | 60% | 40% | Default balanced |
| `on` | 40 | 80% | 20% | Speed-first (boot default) |
| `max` | 30 | 90% | 10% | "Almost instant" mode |

## Quality Scores (Adaptive)
Fast strategies start at baseQuality 80-85. As the system records successes,
quality estimates rise based on actual historical success rates (60% historical,
40% base). No strategy gets filtered out unless it actually fails.

## Speed Hints (Use in Prompts)
- "Do X, optimized for fastest possible completion."
- "Plan Y using the minimum-latency path; trade complexity for speed."
- "This is far too slow — re-optimize using fastest Monte Carlo option."
- "Show me the current fastest plan you use for X and how you chose it."
- "Notice this pattern and remember it."
- "What patterns do you see in our recent slowdowns?"
