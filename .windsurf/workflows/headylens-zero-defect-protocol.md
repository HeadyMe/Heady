---
description: HeadyLens Zero-Defect Protocol - Learning-First Development with Automatic Rebuild on Error
---

# HeadyLens Zero-Defect Protocol (HLZDP)
## Learning-First, Deterministic Development with Automatic Rebuild

> **CRITICAL**: NO CODE shall be written until this protocol is fully understood and all preconditions are met.
> **BABY MODE ACTIVE**: System is currently in learning mode - observing, understanding, organizing knowledge.

## 1. CORE PRINCIPLES

### 1.1 Absolute Rules
- **Implementation is the LAST step**, not the first impulse
- **Every design decision MUST be explicit, reviewable, and testable** before any code
- **Any ambiguity = CODING PROHIBITED** until clarified
- **Any significant error = AUTOMATIC FULL REBUILD**
- **Learning about the system and itself takes priority over building**

### 1.2 Zero-Bug Mindset
- No known significant defect is tolerated at any point
- Every "red" signal triggers immediate stop-work
- Default reaction: STOP → DIAGNOSE → IMPROVE PROCESS → REBUILD CLEAN

## 2. PRECONDITIONS BEFORE ANY CODING

### 2.1 Requirements Specification ✓ MUST EXIST
```yaml
functional_requirements:
  - Numbered list of inputs/outputs/behaviors
  - Each requirement has measurable acceptance criteria
  - Explicit out-of-scope items documented
  
non_functional_requirements:
  - Performance targets (latency < 100ms)
  - Error budgets (99.9% uptime)
  - Security constraints (OAuth 2.0, encrypted at rest)
  - Golden Ratio UI adherence (φ ≈ 1.618)
```

### 2.2 Deterministic Success Criteria ✓ MUST BE QUANTIFIED
- No subjective terms ("fast enough", "good UX")
- Precise error codes for all failure modes
- Boundary conditions fully specified
- Invalid input handling defined

### 2.3 System & Data Design ✓ MUST BE DOCUMENTED
```yaml
architecture:
  - Component responsibilities matrix
  - API contracts (request/response/errors)
  - Data model with invariants
  - State transition diagrams
  
interfaces:
  - Request/response formats
  - Timeout specifications
  - Retry policies
  - Circuit breaker thresholds
```

### 2.4 Algorithm Specification ✓ MUST BE DETERMINISTIC
- Flowcharts for non-trivial functions
- All branches/loops enumerated
- Concurrency handling specified
- Sources of nondeterminism identified and controlled

### 2.5 Testing Plan ✓ MUST MAP 1:1
- Each requirement → specific tests
- Test data generation strategy
- Reproducible test environments
- Definition of "done" criteria

## 3. AUTOMATIC REBUILD PIPELINE

### 3.1 Error Detection Triggers
```yaml
triggers:
  - Test failure (unit/integration/system)
  - Static analysis violation
  - Build error
  - Runtime assertion failure
  - Golden Ratio violation (UI)
  - Patent compliance issue
  
classification:
  significant_error: |
    - Breaks requirements
    - Violates invariants
    - Design-level defect
    - Repeated pattern (>2 occurrences)
```

### 3.2 Automatic Rebuild Sequence
```bash
# On any significant error:
1. IMMEDIATE: Halt all forward progress
2. AUTO: Clean all artifacts
   rm -rf build/ dist/ node_modules/ __pycache__/
3. AUTO: Fresh checkout from main
   git clean -fdx && git reset --hard origin/main
4. AUTO: Full dependency installation
   npm ci && pip install -r requirements.txt --no-cache
5. AUTO: Run full test suite
   npm test && pytest --cov=100
6. DECISION POINT:
   - If passes → Isolate to specific change
   - If fails → SYSTEM FREEZE + Root Cause Analysis
```

### 3.3 Stop-Work Rules
```yaml
stop_work_triggers:
  - Design error detected
  - Requirement ambiguity found
  - Repeated failure pattern (same error 3+ times)
  - CI red on main branch
  - Production incident
  
resume_conditions:
  - Root cause documented
  - Process updated to prevent recurrence
  - Full rebuild passes all tests
  - Design/requirements clarified
```

## 4. LEARNING-FIRST WORKFLOW ("BABY MODE")

### 4.1 Current Phase: OBSERVING
```yaml
priority_1_learning:
  what: "Understanding HeadyLens purpose and constraints"
  how:
    - Document every stakeholder need
    - Map data flows and dependencies
    - Identify failure modes and risks
    - Question every assumption
    
priority_2_meta_learning:
  what: "Learning about myself (the system)"
  how:
    - Track where I help vs. struggle
    - Notice patterns in user corrections
    - Build habits for common issues
    - Reflect on response quality
```

### 4.2 Daily Learning Cycle (PDCA-Based)
```yaml
plan: 
  - Morning: Define learning target
  - Example: "Today: Clarify HeadyLens AR overlay requirements"
  
do:
  - Gather information through questions
  - Document findings in structured format
  - Create provisional models/diagrams
  
check:
  - Compare understanding vs. user intent
  - Identify gaps and misalignments
  - Measure against determinism criteria
  
act:
  - Update protocols and checklists
  - Refine mental models
  - Standardize successful patterns
```

### 4.3 Questions Before Assumptions
```yaml
clarifying_questions:
  requirements:
    - "What specific visual elements will HeadyLens overlay?"
    - "What is the exact latency requirement for AR rendering?"
    - "Which devices must be supported (mobile/desktop/AR glasses)?"
    
architecture:
    - "Should HeadyLens integrate with HeadyBrowser or be standalone?"
    - "What data sources will HeadyLens need to access?"
    - "How will Sacred Geometry principles apply to AR overlays?"
    
constraints:
    - "What patents might HeadyLens technology relate to?"
    - "What privacy considerations for camera/screen access?"
    - "What performance limits on target hardware?"
```

## 5. META-LEARNING PROTOCOL

### 5.1 Self-Improvement Triggers
```yaml
learning_events:
  - User correction → Update behavior pattern
  - Confusion detected → Add clarifying question
  - Error escaped → Strengthen earlier gate
  - Success pattern → Standardize and reuse
```

### 5.2 Pattern Recognition
```yaml
track_patterns:
  helpful:
    - Structured documentation formats
    - Explicit checklists and workflows
    - Sacred Geometry calculations
    - Patent awareness checks
    
struggling:
    - Ambiguous requirements interpretation
    - Assuming instead of asking
    - Missing context from other Heady components
    - Over-confidence in uncertain areas
```

### 5.3 Continuous Improvement Registry
```yaml
improvement_log:
  - timestamp: ISO8601
    trigger: "User correction on UI spacing"
    learning: "Always use var(--phi-*) tokens, never magic numbers"
    action: "Added to pre-commit checklist"
    
  - timestamp: ISO8601
    trigger: "Missed HeadyBrowser integration point"
    learning: "Check all Heady component dependencies first"
    action: "Updated architecture review template"
```

## 6. HEADY SPECIFIC RULES

### 6.1 Golden Ratio Enforcement
```yaml
ui_constraints:
  - NO magic numbers in CSS (20px → var(--space-3))
  - All layouts must use φ-based proportions
  - Spacing scale: 1, φ, φ², φ³, ...
  - Validation: automated Golden Ratio checker in CI
```

### 6.2 Patent Guardianship
```yaml
ip_protection:
  - Check IP headers before any file modification
  - HeadySystems Inc. files: no insecure imports
  - HeadyConnection Inc. files: no C-Corp telemetry
  - Novel algorithms: flag with "⚠️ Potential New IP"
```

### 6.3 Orchestration Protocol
```yaml
hb_engine:
  - Lock modules before large refactors
  - Update PROJECT_STATE.json on context switches
  - Coordinate with other nodes via Cloudflare
```

## 7. FOLLOW-UP AND ENFORCEMENT

### 7.1 Root Cause Analysis Template
```yaml
rca_template:
  incident: "[Description]"
  timeline: "[When detected, duration]"
  root_cause: "[5 Whys analysis]"
  escape_point: "[Where it should have been caught]"
  
  prevention:
    immediate: "[Quick fix]"
    systematic: "[Process improvement]"
    verification: "[How to confirm it won't recur]"
```

### 7.2 Governance
```yaml
roles:
  design_owner:
    - Approves "OK to code" milestone
    - Reviews determinism checklist
    - Signs off on requirements
    
  quality_guardian:
    - Monitors error rates
    - Triggers automatic rebuilds
    - Maintains improvement log
```

## 8. CURRENT STATUS

```yaml
headylens_status:
  phase: "LEARNING/OBSERVING"
  code_written: 0
  requirements_complete: false
  design_approved: false
  determinism_verified: false
  
  next_steps:
    1: "Define HeadyLens core purpose and value proposition"
    2: "Map integration points with HeadyBrowser/HeadyBuddy"
    3: "Specify AR overlay Sacred Geometry requirements"
    4: "Create deterministic success criteria"
    5: "Only then: Consider implementation approach"
```

## 9. STANDING ORDERS

Until explicitly revoked:
1. **PRIORITIZE LEARNING** over building
2. **ASK QUESTIONS** before making assumptions
3. **DOCUMENT PATTERNS** as they emerge
4. **UPDATE THIS PROTOCOL** with each learning
5. **TREAT ERRORS AS PROCESS FAILURES**, not code bugs
6. **MAINTAIN BABY MODE** - observe, understand, organize

---
*This is a living document. Every interaction should improve it.*
*Last updated: [Auto-timestamp on save]*
