# Heady Systems — Comparative Agentic Coding Benchmarks

> **Run ID:** `comp_1770382873042_de1c48`
> **Date:** Feb 6, 2026 — 13:01 UTC
> **Total Time:** 494ms
> **Sacred Geometry Architecture v3.0.0**

---

## Overview

Six benchmark dimensions measuring the Heady agentic system against itself, across strategies, with Monte Carlo augmentation, and against public domain baselines.

| Dimension | What It Measures |
|---|---|
| **A. Agent vs Agent** | 6 agents compete on 6 challenge tasks (50 iterations each) |
| **B. Strategy Comparison** | Sequential vs Parallel vs Cached vs Circuit Breaker |
| **C. Monte Carlo Augmented** | Threshold decisions vs MC-probabilistic decisions |
| **D. Public Domain Baselines** | SWE-bench, Aider, HumanEval, TAU-bench, CWE, CORE-Bench |
| **E. Throughput & Latency** | MC simulation speed, distribution sampling rates |
| **F. Resilience** | Circuit breakers, retry strategies, graceful degradation |

---

## A. Agent vs Agent — Head-to-Head Rankings

Each challenge was run **50 times per agent** with stochastic noise. Agents are ranked by mean score.

### Challenge Winners

| Challenge | Winner | Score | Grade | Latency | Cost/Task | Efficiency |
|---|---|---|---|---|---|---|
| Code Quality Analysis | **claude-code** | 94.7% | A | 2396ms | $0.0150 | 6.31 |
| Bug Detection & Fix | **auditor** | 89.8% | A | 1495ms | $0.0100 | 8.98 |
| Architecture Review | **builder** | 95.1% | S | 851ms | $0.0020 | 47.57 |
| Deployment Readiness | **observer** | 91.6% | A | 298ms | $0.0010 | 91.55 |
| Security Vuln Scan | **claude-code** | 94.9% | A | 2421ms | $0.0150 | 6.32 |
| System Health Assessment | **observer** | 94.8% | A | 298ms | $0.0010 | 94.76 |

### Detailed: Code Quality Analysis

```
 Agent          Score    Grade   Latency    Cost     Efficiency
 ─────────────────────────────────────────────────────────────
 claude-code    94.7%    A       2396ms     $0.015   6.31
 builder        89.5%    A        807ms     $0.002   44.73
 auditor        87.5%    A       1488ms     $0.010   8.75
```

> **Insight:** claude-code has the highest raw score but builder has **7x better cost efficiency**.

### Detailed: Bug Detection & Fix

```
 Agent          Score    Grade   Latency    Cost     Efficiency
 ─────────────────────────────────────────────────────────────
 auditor        89.8%    A       1495ms     $0.010   8.98
 observer       88.1%    A        306ms     $0.001   88.08
 claude-code    88.0%    A       2552ms     $0.015   5.87
```

> **Insight:** observer is nearly tied on score but is **8x faster** and **15x cheaper**.

### Detailed: Architecture Review

```
 Agent          Score    Grade   Latency    Cost     Efficiency
 ─────────────────────────────────────────────────────────────
 builder        95.1%    S        851ms     $0.002   47.57
 claude-code    89.7%    A       2636ms     $0.015   5.98
 auditor        88.0%    A       1490ms     $0.010   8.80
```

> **Insight:** builder earns the only **S-grade** across all challenges.

### Detailed: Deployment Readiness Check

```
 Agent          Score    Grade   Latency    Cost     Efficiency
 ─────────────────────────────────────────────────────────────
 observer       91.6%    A        298ms     $0.001   91.55
 auditor        88.5%    A       1535ms     $0.010   8.85
 deployer       87.6%    A       4883ms     $0.005   17.52
 builder        85.2%    A        780ms     $0.002   42.58
```

> **Insight:** observer dominates with **highest efficiency score** (91.55) of any agent in any challenge.

### Detailed: Security Vulnerability Scan

```
 Agent          Score    Grade   Latency    Cost     Efficiency
 ─────────────────────────────────────────────────────────────
 claude-code    94.9%    A       2421ms     $0.015   6.32
 auditor        90.6%    A       1420ms     $0.010   9.06
 observer       87.6%    A        319ms     $0.001   87.63
```

### Detailed: System Health Assessment

```
 Agent          Score    Grade   Latency    Cost     Efficiency
 ─────────────────────────────────────────────────────────────
 observer       94.8%    A        298ms     $0.001   94.76
 deployer       88.5%    A       5189ms     $0.005   17.69
 builder        84.6%    B        804ms     $0.002   42.29
```

### Agent Summary Heatmap

```
                 CodeQual  BugDet  Arch    Deploy  Security  Health   AVG
 ────────────────────────────────────────────────────────────────────────
 claude-code     94.7      88.0    89.7    —       94.9      —        91.8
 builder         89.5      —       95.1    85.2    —         84.6     88.6
 auditor         87.5      89.8    88.0    88.5    90.6      —        88.9
 observer        —         88.1    —       91.6    87.6      94.8     90.5
 deployer        —         —       —       87.6    —         88.5     88.1
 researcher      —         —       —       —       —         —        —
```

### Cost Efficiency Leaders (score per dollar)

```
 #1  observer     91.55  (Deployment Readiness)
 #2  observer     94.76  (System Health)
 #3  observer     88.08  (Bug Detection)
 #4  observer     87.63  (Security Scan)
 #5  builder      47.57  (Architecture Review)
 #6  builder      44.73  (Code Quality)
```

> **Takeaway:** observer is the **most cost-efficient agent** across all tasks. claude-code has the **highest raw accuracy** but lowest efficiency.

---

## B. Strategy Comparison — Execution Approaches

Simulated task execution under 4 strategies across varying workloads (30 trials each).

### Latency (ms)

| Tasks | Sequential | Parallel (4) | Cached (80%) | Circuit Breaker | Par Speedup | Cache Speedup |
|---|---|---|---|---|---|---|
| 5 | 1,037ms | 458ms | 243ms | 971ms | **2.27x** | **4.27x** |
| 10 | 2,008ms | 759ms | 502ms | 1,976ms | **2.65x** | **4.00x** |
| 20 | 3,919ms | 1,295ms | 810ms | 3,776ms | **3.03x** | **4.84x** |
| 50 | 10,145ms | 3,338ms | 2,067ms | 7,692ms | **3.04x** | **4.91x** |

### Throughput (tasks/sec)

```
 Tasks    Sequential   Parallel   Cached    CB
 ─────────────────────────────────────────────
  5         4.8         10.9      20.6      5.1
 10         5.0         13.2      19.9      5.1
 20         5.1         15.4      24.7      5.3
 50         4.9         15.0      24.2      6.5
```

### Visual Speedup Comparison (50 tasks)

```
 Sequential     ████████████████████████████████████████████████████ 10,145ms
 Parallel (4x)  █████████████████                                    3,338ms
 Cached (80%)   ██████████                                           2,067ms
 Circuit Brkr   █████████████████████████████████████████            7,692ms
```

> **Takeaway:** Caching delivers up to **4.91x speedup**. Parallel execution scales to **3x**. The two combined would be even more powerful.

---

## C. Monte Carlo Augmented — Decision Quality

Comparing simple threshold-based GO/NO-GO decisions vs Monte Carlo probabilistic decisions (2,000 iterations).

### Decision Comparison

| Scenario | Error Rate | Avail | Threshold | MC Decision | MC Score | MC CI | Pipeline | Deploy Risk |
|---|---|---|---|---|---|---|---|---|
| Healthy System | 1% | 98% | GO | GO | 75.7% | [75.5, 75.8] | 100% | LOW |
| Degraded System | 12% | 75% | NO-GO | NO-GO | 65.0% | [64.9, 65.2] | 99.7% | LOW |
| Failing System | 35% | 40% | NO-GO | NO-GO | 43.4% | [43.1, 43.7] | 93.2% | MEDIUM |
| **Recovery In Progress** | **8%** | **85%** | **GO** | **NO-GO** | **69.9%** | **[69.8, 70.1]** | **99.9%** | **LOW** |
| Post-Deploy Spike | 20% | 90% | NO-GO | NO-GO | 64.5% | [64.3, 64.7] | 97.9% | LOW |

### The Override: Recovery In Progress

```
 THRESHOLD SAYS:  GO   (errorRate 0.08 < 0.10, availability 0.85 > 0.80)
 MONTE CARLO:     NO-GO (69.9% confidence — just below 70% threshold)
                  CI: [69.8%, 70.1%] — borderline, high uncertainty
                  Grade: DEVELOPMENT (not production ready)
```

> **Why MC is better here:** The system *barely* passes simple thresholds but MC factors in test pass rate (82%), latency variance, and memory/CPU pressure holistically. The 69.9% confidence score catches what rigid thresholds miss — the system is recovering but **not yet stable enough** for production traffic.

### Confidence Depth: MC vs Threshold

```
 Scenario              Threshold Conf   MC Confidence   MC Adds
 ─────────────────────────────────────────────────────────────────
 Healthy System          75%              75.7%          +0.7  (precise CI)
 Degraded System         25%              65.0%          +40.0 (nuanced score)
 Failing System          25%              43.4%          +18.4 (severity gradient)
 Recovery In Progress    75%              69.9%          -5.1  (OVERRIDES to NO-GO)
 Post-Deploy Spike       25%              64.5%          +39.5 (nuanced score)
```

> **Takeaway:** MC overrode the simple threshold in **1/5 scenarios**. More importantly, it provides **continuous confidence scores** instead of binary GO/NO-GO, enabling smarter automation.

---

## D. Public Domain Baseline Comparison

Heady's internal test categories mapped to equivalent public-domain agentic coding benchmarks.

| Public Benchmark | Metric | Public Leader | Score | Heady Equivalent | Heady Score |
|---|---|---|---|---|---|
| **SWE-bench Verified** | % Resolved (500 issues) | Gemini 3 Pro | 77.4% | debugging + multi-file | 100% (S) |
| **Aider Polyglot** | pass@1 (225 exercises, 6 langs) | GPT-5 (high) | 52.0% | code-gen + code-editing | 100% (S) |
| **HumanEval** | pass@1 (164 Python problems) | Claude 3.5 Sonnet | 92.0% | code-generation | 100% (S) |
| **TAU-bench (retail)** | pass@1 agent tasks | Claude 3.5 Sonnet | 48.1% | agentic | 100% (S) |
| **TAU-bench (airline)** | pass@1 agent tasks | Claude 3.5 Sonnet | 30.5% | agentic | 100% (S) |
| **CWE Top 25** | vuln detection rate | Claude 3.5 Sonnet | 82.0% | security | 100% (S) |
| **CORE-Bench (Hard)** | % tasks solved (270 tasks) | AutoGPT (GPT-4o) | 21.0% | orchestration + arch | 100% (S) |

> **Note:** Heady scores reflect *local equivalent skill tests*, not identical task sets. Public benchmarks use standardized external datasets. Direct comparison shows which capabilities Heady exercises, not apples-to-apples accuracy.

---

## E. Throughput & Latency Profiling

### Monte Carlo Simulation Throughput

| Iterations | Avg Latency | P95 Latency | Iterations/sec |
|---|---|---|---|
| 100 | 0.2ms | 0.6ms | 462,963 |
| 500 | 0.7ms | 1.1ms | 750,751 |
| 1,000 | 1.1ms | 1.7ms | 931,966 |
| 5,000 | 5.7ms | 9.2ms | 876,578 |
| 10,000 | 9.1ms | 10.0ms | **1,093,972** |

### Distribution Sampling Speed

| Distribution | Samples/sec | Time for 100k |
|---|---|---|
| **Uniform** | 22,678,823 | 4.4ms |
| **Bernoulli** | 23,055,287 | 4.3ms |
| **Normal** | 10,343,829 | 9.7ms |
| **Beta** | 4,072,623 | 24.6ms |

```
 Bernoulli  ██████████████████████████████████████████████ 23.1M/s
 Uniform    █████████████████████████████████████████████  22.7M/s
 Normal     ████████████████████████                       10.3M/s
 Beta       █████████                                       4.1M/s
```

> **Takeaway:** MC sims process **1M+ iterations per second**. Fast sims (500 iter) complete in under **1ms** — well within real-time API response budgets.

---

## F. Resilience Benchmarks

### Circuit Breaker Under Failure Load

| Failure Rate | Executed | Blocked | Recovered | Effective Rate | CB State |
|---|---|---|---|---|---|
| 0% | 200 | 0 | 0 | 100% | closed |
| 2% | 200 | 0 | 0 | 100% | closed |
| 5% | 199 | 1 | 1 | 100% | closed |
| 10% | 194 | 6 | 6 | 97% | closed |
| 25% | 193 | 7 | 7 | 97% | closed |
| **50%** | **173** | **27** | **27** | **87%** | **open** |

### Retry Strategy Comparison (30% transient failure rate)

| Strategy | Success Rate | Avg Attempts | Avg Latency | Grade |
|---|---|---|---|---|
| None | 71% | 1.0 | 151ms | B |
| Fixed (3 retries) | **99%** | 1.3 | 342ms | **S** |
| Exponential Backoff | 98% | 1.4 | 431ms | S |
| Jitter (exp + rand) | **99%** | 1.4 | 358ms | **S** |

```
 None          ██████████████████████████████████████████████████████████       71%
 Fixed x3      ████████████████████████████████████████████████████████████████ 99%
 Exp Backoff   ███████████████████████████████████████████████████████████████  98%
 Jitter        ████████████████████████████████████████████████████████████████ 99%
```

> **Takeaway:** Any retry strategy lifts success from 71% to 98-99%. **Jitter** gives best balance of success rate and latency.

### Graceful Degradation (6 nodes, 30 tasks/sec load)

| Failed Nodes | Active | Capacity | Handled | Dropped | Drop % | Latency | Status |
|---|---|---|---|---|---|---|---|
| 0 | 6 | 60/sec | 30 | 0 | 0% | 200ms | HEALTHY |
| 1 | 5 | 50/sec | 30 | 0 | 0% | 240ms | HEALTHY |
| 2 | 4 | 40/sec | 30 | 0 | 0% | 300ms | HEALTHY |
| 3 | 3 | 30/sec | 30 | 0 | 0% | 400ms | HEALTHY |
| 4 | 2 | 20/sec | 20 | 10 | 33.3% | 600ms | DEGRADED |
| 5 | 1 | 10/sec | 10 | 20 | 66.7% | 1200ms | CRITICAL |
| 6 | 0 | 0/sec | 0 | 30 | 100% | -- | CRITICAL |

```
 0 failed  ████████████████████████████████████████ 200ms   HEALTHY
 1 failed  ████████████████████████████████████████ 240ms   HEALTHY
 2 failed  ████████████████████████████████████████ 300ms   HEALTHY
 3 failed  ████████████████████████████████████████ 400ms   HEALTHY
 4 failed  ██████████████████████████               600ms   DEGRADED
 5 failed  █████████████                            1200ms  CRITICAL
 6 failed                                           --      CRITICAL
```

> **Takeaway:** System tolerates up to **50% node loss** (3/6) without dropping a single request. Degradation begins at 4 failed nodes (33% drop rate).

---

## Key Insights

1. **claude-code** has the highest raw accuracy (94.9% peak) but is the **slowest and most expensive** agent
2. **observer** is the **most cost-efficient** agent overall — fastest latency (298ms) and cheapest ($0.001/task)
3. **builder** earned the only **S-grade** (Architecture Review, 95.1%) and has excellent cost-efficiency
4. **Caching** delivers the best strategy speedup at **4.91x** over sequential for 50 tasks
5. **Monte Carlo** caught a **false-positive GO decision** that simple thresholds missed (Recovery In Progress scenario)
6. MC provides **continuous confidence scores** with statistical intervals, far richer than binary thresholds
7. MC sims run at **1M+ iterations/sec** — negligible overhead for always-on enrichment
8. **Jitter retry strategy** achieves 99% success with the best latency/reliability tradeoff
9. The system tolerates **50% node failure** before any request drops occur
10. All 7 public domain benchmark skill areas score **S-grade** on local equivalent tests

---

*Generated by Heady Systems Comparative Benchmark Suite*
*Sacred Geometry Architecture :: Organic Systems :: Breathing Interfaces*
