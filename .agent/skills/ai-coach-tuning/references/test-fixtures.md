# Test Fixtures — AI Coach Algorithm

5 deterministic test cases with exact expected outputs. Run these after ANY algorithm change.

## Seed Data (5 Books)

| # | Title | Pages | Genre | Status | Progress |
|---|-------|:-----:|-------|--------|:--------:|
| 1 | The Da Vinci Code | 480 | Thriller, Fiction | Reading | 60% |
| 2 | Atomic Habits | 320 | Self-Help, Non-Fiction | Abandoned | 20% |
| 3 | Dune | 412 | Sci-Fi, Fiction | Finished | 100% |
| 4 | Sapiens | 443 | History, Non-Fiction | Abandoned | 15% |
| 5 | 1984 | 328 | Fiction | Finished | 100% |

**Pre-computed values:**
- `avgQuitPercent` = round((20 + 15) / 2) = **18%**
- Base confidence (5 books) = **50%**

---

## Test Case 1: Da Vinci Code (Reading, 60%)

**Input:** Book #1 — Thriller+Fiction, 480pg, 60% progress, 5 books total

| Factor | Computation | Result |
|--------|------------|:------:|
| Genre (40pt) | Fiction books: Dune✅, 1984✅, DaVinci📖, Atomic❌ → 2/4 = 50% | +0 (not ≥60) |
| Quit Zone (30pt) | 60% > 18% + 10 = 28%? **YES** | +30 |
| Momentum (30pt) | 60% > 50%? **YES** | +30 |

### ✅ Expected Output
| Field | Value |
|-------|-------|
| Score | **60** |
| Recommendation | **PUSH** |
| Confidence | **50%** |
| Reasons | 2 — "Survival Zone" + "Momentum" |

---

## Test Case 2: New Self-Help Book (10%, 200pg)

**Input:** NEW book — Self-Help, 200pg, 10% progress, 6 books total

| Factor | Computation | Result |
|--------|------------|:------:|
| Genre (40pt) | Self-Help: Atomic❌. Total=1 → 0%, but total ≤2 | +0 (no reason) |
| Quit Zone (30pt) | 10% > 28%? **NO**. ~200pg similar books? None within ±100 | +0 |
| Momentum (30pt) | 10% > 50%? NO. 10% < 15%? **YES** | +0 (reason added) |

### ✅ Expected Output
| Field | Value |
|-------|-------|
| Score | **0** |
| Recommendation | **QUIT** |
| Confidence | **60%** |
| Reasons | 1 — "Low Investment" |

---

## Test Case 3: New Fiction Book (80%, 350pg)

**Input:** NEW book — Fiction, 350pg, 80% progress, 6 books total

| Factor | Computation | Result |
|--------|------------|:------:|
| Genre (40pt) | Fiction: Dune✅, 1984✅, DaVinci📖, Atomic❌ → 2/4 = 50% | +0 |
| Quit Zone (30pt) | 80% > 28%? **YES** | +30 |
| Momentum (30pt) | 80% > 50%? **YES** | +30 |

### ✅ Expected Output
| Field | Value |
|-------|-------|
| Score | **60** |
| Recommendation | **PUSH** |
| Confidence | **60%** |
| Reasons | 2 — "Survival Zone" + "Momentum" |

---

## Test Case 4: Threshold Gate (3 books only)

**Input:** Any book, only 3 books in library

### ✅ Expected Output
| Field | Value |
|-------|-------|
| ready | **false** |
| message | `"Log at least 5 books to unlock pattern recognition. Currently: 3/5."` |
| Score | *(none)* |
| Recommendation | *(none)* |

---

## Test Case 5: New History Book (25%, 500pg)

**Input:** NEW book — History, 500pg, 25% progress, 6 books total

| Factor | Computation | Result |
|--------|------------|:------:|
| Genre (40pt) | History: Sapiens❌. Total=1 → 0%, but total ≤2 | +0 (no reason) |
| Quit Zone (30pt) | 25% > 28%? **NO**. Similar 400-600pg: Dune✅, DaVinci📖, Sapiens❌ → 1/3 = 33% | +0 (33% not ≤30) |
| Momentum (30pt) | 25% > 50%? NO. 25% < 15%? NO | +0 (no reason) |

### ✅ Expected Output
| Field | Value |
|-------|-------|
| Score | **0** |
| Recommendation | **QUIT** |
| Confidence | **60%** |
| Reasons | 0 — all inconclusive |

---

## Verification Checklist

After any algorithm change, run through all 5 cases and confirm:

```markdown
- [ ] Test Case 1: Score=60, PUSH, Confidence=50%, 2 reasons
- [ ] Test Case 2: Score=0, QUIT, Confidence=60%, 1 reason
- [ ] Test Case 3: Score=60, PUSH, Confidence=60%, 2 reasons
- [ ] Test Case 4: ready=false, message matches, no score/recommendation
- [ ] Test Case 5: Score=0, QUIT, Confidence=60%, 0 reasons
```
