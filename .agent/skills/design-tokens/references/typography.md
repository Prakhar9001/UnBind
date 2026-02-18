# Typography Scale

**Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
**Import:** `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap')`

---

## Full Scale

| Element | Size | Weight | Color | Extras |
|---------|:----:|:------:|-------|--------|
| Login title | 36px | 900 | Gradient (white → accent) | `letter-spacing: -1px` |
| Stat value | 32px | 800 | Color-coded (`.success`/`.warning`/etc) | `letter-spacing: -1px` |
| App title (h1) | 28px | 800 | Gradient (white → gray) | `letter-spacing: -0.5px` |
| Section title | 18px | 700 | `--text-primary` | — |
| Empty state title | 18px | 700 | `--text-primary` | — |
| Confirm dialog h3 | 18px | 700 | `--text-primary` | — |
| Insight title | 16px | 700 | `--text-primary` | — |
| Book title | 15px | 700 | `--text-primary` | Truncate: `nowrap`, `ellipsis` |
| Body/coach text | 15px | 400 | `--text-secondary` | `line-height: 1.7` |
| Input field | 15px | 400 | `--text-primary` | — |
| Button text | 14px | 600 | Varies | — |
| Subtitle | 14px | 400 | `--text-muted` | — |
| Insight text | 14px | 400 | `--text-secondary` | `line-height: 1.6` |
| Confirm dialog p | 14px | 400 | `--text-secondary` | `line-height: 1.6` |
| Coach name | 14px | 700 | `--text-primary` | — |
| Chip text | 13px | 500 | `--text-secondary` / `--accent` | — |
| Tab text | 13px | 600 | `--text-muted` / `--text-primary` | — |
| Toggle text | 13px | 600 | `--text-muted` / `--accent` | — |
| Login toggle | 13px | 400/600 | `--text-muted` / `--accent` | Link underlined |
| Login footer | 13px | 400 | `--text-muted` | `line-height: 1.6` |
| Login error | 13px | 400 | `--danger` | — |
| Stat label | 12px | 600 | `--text-muted` | `uppercase`, `letter-spacing: 0.8px` |
| Input label | 12px | 600 | `--text-muted` | `uppercase`, `letter-spacing: 0.8px` |
| Stat detail | 12px | 400 | `--text-secondary` | — |
| Book author | 12px | 400 | `--text-muted` | — |
| Heatmap label | 12px | 400 | `--text-muted` | Truncate |
| Heatmap value | 12px | 600 | — | — |
| Coach-btn-inline | 12px | 600 | `--accent` | — |
| Badge text | 11px | 700 | Color-coded | `uppercase`, `letter-spacing: 0.5px` |
| Coach label | 11px | 400 | `--accent` | `uppercase`, `letter-spacing: 0.8px` |
| Progress text | 11px | 400 | `--text-secondary` | — |
| Nav item text | 10px | 500 | `--text-muted` / `--accent` | `uppercase`, `letter-spacing: 0.5px` |
| Donut label | 10px | 400 | `--text-muted` | — |

---

## Gradient Text Pattern

For headings with gradient text:

```css
background: linear-gradient(135deg, #FFFFFF 0%, TARGET_COLOR 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

| Element | Target Color |
|---------|-------------|
| Page h1 | `#9CA3AF` (gray) |
| Login title | `var(--accent)` (teal) |

---

## Weight Reference

| Weight | Name | Usage |
|:------:|------|-------|
| 300 | Light | *(available but unused)* |
| 400 | Regular | Body text, descriptions, paragraphs |
| 500 | Medium | Chips, nav items, login toggle |
| 600 | SemiBold | Buttons, labels, tabs, toggles, stat details |
| 700 | Bold | Titles, headings, book titles, badges |
| 800 | ExtraBold | Stat values, h1, donut values |
| 900 | Black | Login title only |
