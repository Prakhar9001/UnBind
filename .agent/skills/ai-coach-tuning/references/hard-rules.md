# Hard Rules — AI Coach Algorithm

These 7 rules are **absolute and inviolable**. Breaking any one of them is a critical failure that must be immediately reverted.

---

## Rule 1: ZERO GUESSWORK
Every output must be **traceable to specific data points** in the user's reading history.

❌ `"I think you should keep reading"` — No basis in data
❌ `"This book seems interesting"` — Subjective judgment
✅ `"Genre Strength: You finish 75% of Thriller books."` — Data-backed

## Rule 2: NO RANDOMNESS
Same input **MUST** produce the same output, every time.

❌ `Math.random()` in any scoring logic
❌ `Date.now()` affecting scores
❌ Any non-deterministic operation in the scoring path
✅ Pure functions: `f(book, books) → { score, recommendation, reasons }`

## Rule 3: NO EXTERNAL AI
The algorithm is **pure math**. No LLM/AI API calls.

❌ OpenAI API calls for recommendations
❌ Gemini/Claude for generating advice text
❌ Any machine learning model inference
✅ Deterministic `if/else` scoring with fixed weights

## Rule 4: DATA THRESHOLD
**Never** show a recommendation with fewer than 5 books.

❌ Showing a score when `books.length === 3`
❌ Bypassing the gate with a flag or override
✅ Return `{ ready: false }` with a clear message

## Rule 5: ADDITIVE ONLY
Score starts at **0** and can only **increase**.

❌ `score -= 10` (subtracting points)
❌ `score = score * 0.8` (reducing by percentage)
❌ Negative weights or penalty factors
✅ `score += 40` (only addition, only positive values)

## Rule 6: REASONS REQUIRED
Every recommendation must include **at least one** human-readable, data-backed reason string.

❌ `{ recommendation: "PUSH", reasons: [] }` — Empty reasons
✅ `{ recommendation: "PUSH", reasons: ["Momentum: You're over halfway done (65%)."] }`

**Exception:** Test Case 5 shows that 0 reasons IS possible when all factors are inconclusive. In this edge case, the score is 0 (QUIT) which is still a valid data-driven output — "insufficient signal" IS a signal.

## Rule 7: DETERMINISTIC
Running the algorithm **twice** with identical inputs must produce **identical outputs**.

```
assert(coach(book, books) === coach(book, books))  // Always true
```

No side effects, no state mutations, no external dependencies that could vary between runs.

---

## Enforcement

When reviewing ANY change to the CoachModal algorithm:

```markdown
- [ ] Rule 1: All outputs traceable to data? No subjective language?
- [ ] Rule 2: No Math.random(), Date.now(), or non-deterministic ops?
- [ ] Rule 3: No OpenAI/Gemini/LLM API calls?
- [ ] Rule 4: Gate still blocks at < 5 books?
- [ ] Rule 5: Score only goes up (additive)? No subtractions?
- [ ] Rule 6: At least 1 reason string in the output?
- [ ] Rule 7: Same input → same output guaranteed?
```
