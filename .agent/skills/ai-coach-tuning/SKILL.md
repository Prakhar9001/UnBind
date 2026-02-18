---
name: ai-coach-tuning
description: >
  Guards and documents UnBind's deterministic AI Reading Coach algorithm. Use when
  modifying the Coach Me algorithm, changing scoring weights or thresholds, adding
  new scoring factors, editing the CoachModal component, or verifying AI outputs.
  Enforces zero-guesswork, no-hallucination rules and provides deterministic test
  fixtures with exact expected outputs.
---

# AI Coach Tuning

## When to use this skill
- User asks to modify, tune, or change the **Coach Me** / AI coach algorithm
- User asks to change **scoring weights**, **thresholds**, or **decision boundaries**
- User asks to add new **scoring factors** to the push/quit algorithm
- User is editing the **CoachModal** component in `src/app/page.tsx`
- User asks to add **AI/ML features** (enforce no-hallucination rule)
- User wants to **verify** AI outputs haven't drifted after code changes
- User mentions "push score", "quit score", "coach", "recommendation", or "confidence"

## Hard Rules (NEVER Violate)

> [!CAUTION]
> These 7 rules are absolute. Breaking ANY of them is a critical failure.

1. **ZERO GUESSWORK** — Every output must be traceable to data. No "I think" or "maybe"
2. **NO RANDOMNESS** — Same input = same output. No `Math.random()`, no timestamps in scoring
3. **NO EXTERNAL AI** — No OpenAI, Gemini, or LLM calls. Algorithm is pure math
4. **DATA THRESHOLD** — Never show a recommendation with < 5 books. Hard gate, no bypass
5. **ADDITIVE ONLY** — Score starts at 0, only goes up. Never subtract points
6. **REASONS REQUIRED** — Every recommendation must include ≥1 data-backed reason string
7. **DETERMINISTIC** — Identical inputs must produce identical outputs, always

## Algorithm Summary

The coach uses a **100-point additive scoring system** with 3 weighted factors:

```
┌────────────────────────────────────────────────┐
│  GATE: books.length < 5 → BLOCK (no output)   │
├────────────────────────────────────────────────┤
│  Factor 1: Genre Match Rate    → 40 points     │
│  Factor 2: Quit Zone Survival  → 30 points     │
│  Factor 3: Momentum (>50%)     → 30 points     │
├────────────────────────────────────────────────┤
│  Score ≥ 60 → PUSH  │  Score < 60 → QUIT      │
│  Confidence = min(100, books/10 * 100)         │
└────────────────────────────────────────────────┘
```

> For complete algorithm documentation: [See algorithm.md](references/algorithm.md)

## Workflow

Follow this checklist when modifying the AI coach:

```markdown
- [ ] Read the full algorithm in references/algorithm.md
- [ ] Identify which factor/threshold/weight is changing
- [ ] Make the code change in CoachModal (src/app/page.tsx)
- [ ] Verify all 7 Hard Rules are still satisfied
- [ ] Run ALL 5 test fixtures from references/test-fixtures.md
- [ ] Update test fixture expected outputs if weights changed
- [ ] npm run build → 0 errors
- [ ] Document the change reason
```

## Modification Rules

### Adding a New Factor
1. Define a positive integer weight
2. Rebalance: `Genre + QuitZone + Momentum + NewFactor ≈ 100`
3. Add ≥ 2 new test fixtures covering the new factor
4. Update ALL existing test fixture expected outputs

### Changing a Weight
1. Update the weight constant in the scoring section
2. Re-run ALL 5 test fixtures — update expected outputs
3. Verify the decision boundary (60) still makes sense

### Changing the Decision Boundary
1. Current: `≥ 60 → PUSH, < 60 → QUIT`
2. Update all test fixture expected recommendations
3. Document the reasoning

### Changing the Data Threshold
1. Current: 5 books minimum
2. Update Test Case 4 in test-fixtures.md
3. Update the confidence formula denominator

## File Locations

| What | Where |
|------|-------|
| AI Coach algorithm | `src/app/page.tsx` → `CoachModal` → `useMemo` block |
| Seed test data | `src/lib/firestore-hooks.ts` → `seedTestData()` |
| Book type | `src/models/types.ts` → `Book` interface |
| Insights (related) | `src/app/page.tsx` → `InsightsScreen` component |

## Resources
- [Full Algorithm Documentation](references/algorithm.md)
- [5 Deterministic Test Fixtures](references/test-fixtures.md)
- [Hard Rules Reference](references/hard-rules.md)
