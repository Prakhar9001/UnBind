# Algorithm Documentation

## Data Threshold Gate

The AI coach **refuses** to output any recommendation until ≥ 5 books are logged.

```typescript
if (books.length < 5) {
  return {
    ready: false,
    message: `Log at least 5 books to unlock pattern recognition. Currently: ${books.length}/5.`,
  };
}
```

**Why 5?** Below 5, there's insufficient data for pattern detection. Any output would be guesswork.

---

## Pattern Recognition: 3 Data Signals

### Signal A: Genre Match Rate
```
genreBooks = books.filter(b => b.genre overlaps with currentBook.genre)
genreFinished = genreBooks.filter(b => b.status === "Finished").length
genreTotal = genreBooks.length
genreRate = round((genreFinished / genreTotal) * 100)
```

### Signal B: Length Similarity Rate
```
similarLengthBooks = books.filter(b => abs(b.total_pages - currentBook.total_pages) <= 100)
lengthFinished = similarLengthBooks.filter(b => b.status === "Finished").length
lengthTotal = similarLengthBooks.length
lengthRate = round((lengthFinished / lengthTotal) * 100)
```

### Signal C: Average Quit Point
```
abandonedBooks = books.filter(b => b.status === "Abandoned")
avgQuitPercent = round(sum(abandoned.progress_percent) / abandoned.length)
```

---

## Scoring Algorithm (100 Points Total)

Score starts at **0**. Points are **additive only** (never subtracted).

### Factor 1: Genre (40 points max)

| Condition | Points | Reason String |
|-----------|:------:|---------------|
| `genreRate >= 60` | +40 | `"Genre Strength: You finish {X}% of {genre} books."` |
| `genreRate <= 30 AND genreTotal > 2` | +0 | `"Genre Risk: You only finish {X}% of {genre} books."` |
| Otherwise | +0 | *(none)* |

**Rationale:** 60%+ = strong track record. ≤30% = clear weakness. 31-59% = inconclusive → no signal.

### Factor 2: Quit Zone Survival (30 points max)

| Condition | Points | Reason String |
|-----------|:------:|---------------|
| `progress > avgQuitPercent + 10` | +30 | `"Survival Zone: You're past your average quit point ({X}%)."` |
| `lengthRate <= 30 AND lengthTotal > 2` | +0 | `"Length Risk: Books this size have a low {X}% finish rate."` |
| Otherwise | +0 | *(none)* |

**Rationale:** The +10 buffer ensures the user is genuinely past the danger zone, not just 1% past.

### Factor 3: Momentum (30 points max)

| Condition | Points | Reason String |
|-----------|:------:|---------------|
| `progress > 50` | +30 | `"Momentum: You're over halfway done ({X}%)."` |
| `progress < 15` | +0 | `"Low Investment: Only {X}% in. Quitting now is cheap."` |
| Otherwise | +0 | *(none)* |

**Rationale:** 50% = psychological midpoint. Past it, quitting costs more than finishing.

---

## Final Decision

```
finalScore = min(100, score)               // capped at 100
recommendation = finalScore >= 60 ? "PUSH" : "QUIT"
confidence = min(100, round((books.length / 10) * 100))
```

### Decision Boundary
```
Score:  0 ──────── 59 │ 60 ──────── 100
              QUIT    │    PUSH
          ⏸️ LOGICAL   │  ✅ PUSH THROUGH
```

### Confidence Levels

| Books | Confidence | Meaning |
|:-----:|:----------:|---------|
| 5 | 50% | Minimal data |
| 7 | 70% | Growing patterns |
| 10+ | 100% | Full pattern lock |

---

## Code Location

The entire algorithm lives in:
- **File:** `src/app/page.tsx`
- **Component:** `CoachModal`
- **Block:** `useMemo(() => { ... }, [book, books])`
- **Approximate lines:** 1067–1138
