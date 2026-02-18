# Color Palette & Gradients

## Background
| Variable | Value | Usage |
|----------|-------|-------|
| `--bg-gradient` | `linear-gradient(135deg, #063f47 0%, #021a1e 100%)` | Full-page background. Deep abyssal teal → near-black |

## Accent Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--accent` | `#2DD4BF` (Bright Teal) | Primary actions, active states, links, FAB, coach elements |
| `--accent-dark` | `#99F6E4` (Pale Aqua) | Progress bar gradient end, subtle highlights |

## Status Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--success` | `#10B981` (Green) | Finished books, PUSH recommendation, positive stats |
| `--warning` | `#F59E0B` (Orange) | QUIT recommendation, caution states |
| `--danger` | `#EF4444` (Red) | Abandoned books, delete actions, errors |

## Glassmorphism Stack
| Variable | Value | Usage |
|----------|-------|-------|
| `--glass-bg` | `rgba(156, 163, 175, 0.2)` | Card background (20% opacity slate) |
| `--glass-bg-hover` | `rgba(156, 163, 175, 0.25)` | Card hover (+5%) |
| `--glass-border` | `rgba(156, 163, 175, 0.3)` | Borders, dividers |
| `--glass-blur` | `24px` | Backdrop blur for all glass elements |
| `--glass-radius` | `28px` | Large border-radius for cards |
| `--glass-shadow` | `0 25px 50px rgba(0, 0, 0, 0.4)` | Deep card shadow |

## Text Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--text-primary` | `#F8FAFC` (Near-white) | Main headings, body, strong emphasis |
| `--text-secondary` | `#D1D5DB` (Light gray) | Descriptions, paragraphs |
| `--text-muted` | `#9CA3AF` (Medium gray) | Labels, hints, placeholders |

---

## Gradient Formulas

Always use these exact values. The convention is **135deg** for most gradients.

| Name | CSS | Where Used |
|------|-----|------------|
| Page Background | `linear-gradient(135deg, #063f47 0%, #021a1e 100%)` | Body/html |
| Primary Button | `linear-gradient(135deg, var(--accent) 0%, #0D9488 100%)` | `.btn-primary` |
| Success Button | `linear-gradient(135deg, var(--success) 0%, #059669 100%)` | `.btn-success` |
| Warning Button | `linear-gradient(135deg, var(--warning) 0%, #D97706 100%)` | `.btn-warning` |
| Danger Button | `linear-gradient(135deg, var(--danger) 0%, #B91C1C 100%)` | `.btn-danger` |
| FAB | `linear-gradient(135deg, var(--accent) 0%, #2563EB 100%)` | `.fab` (teal→blue) |
| Progress Fill | `linear-gradient(90deg, var(--accent) 0%, var(--accent-dark) 100%)` | Progress bars |
| H1 Text | `linear-gradient(135deg, #FFFFFF 0%, #9CA3AF 100%)` | Page header h1 |
| Login Title | `linear-gradient(135deg, #FFFFFF 0%, var(--accent) 100%)` | Login title |
| Modal BG | `linear-gradient(160deg, #1C2434 0%, #0F1419 100%)` | Modals, confirm dialogs |
| Coach Card | `linear-gradient(135deg, rgba(45,212,191,0.1) 0%, rgba(6,63,71,0.4) 100%)` | Coach card |
| Coach Avatar | `linear-gradient(135deg, var(--accent), #134E4A)` | Avatar circle |
| Book Cover | `linear-gradient(135deg, #1F2937, #374151)` | Placeholder covers |
| Nav Bar | `rgba(15, 20, 25, 0.85)` + `blur(24px)` | Bottom nav |

---

## Status Color Mapping

| Status | Variable | `rgba()` base | BG (15%) | Border (30%) |
|--------|----------|:---:|---|---|
| Reading | `--accent` | `45, 212, 191` | `rgba(45, 212, 191, 0.15)` | `rgba(45, 212, 191, 0.3)` |
| Finished | `--success` | `16, 185, 129` | `rgba(16, 185, 129, 0.15)` | `rgba(16, 185, 129, 0.3)` |
| Abandoned | `--danger` | `239, 68, 68` | `rgba(239, 68, 68, 0.15)` | `rgba(239, 68, 68, 0.3)` |

---

## Animations

| Name | Duration | Easing | Effect |
|------|:--------:|--------|--------|
| `fadeIn` | 0.2s | ease | Opacity 0→1 (overlays) |
| `slideUp` | 0.3s | ease | TranslateY 100%→0 (modals) |
| `float` | 3s | ease-in-out ∞ | TranslateY 0→-8px→0 (login icon) |
| `spin` | 0.8s | linear ∞ | Rotate 0→360deg (spinner) |

### Micro-Transitions
| Element | Duration | Easing |
|---------|:--------:|--------|
| Glass card hover | 0.25s | ease |
| Button hover | 0.25s | ease |
| Progress fill | 1s | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| Chip select | 0.2s | ease |
| Nav item | 0.3s | ease |
| Input focus | 0.25s | ease |

---

## Border Radius Scale

| Size | Value | Used On |
|:----:|:-----:|---------|
| XL | 28px | Glass cards, modals, coach card |
| LG | 24px | Confirm dialog |
| MD | 20px | Badges, chips, FAB |
| SM | 16px | Buttons, inputs, tabs |
| SM- | 14px | Toggle buttons |
| XS | 12px | Coach-btn-inline, login-error |
| XXS | 8px | Book cover |
| XXXS | 6px | Heatmap bars, progress fill |

## Spacing Scale

| Token | Value | Use |
|-------|:-----:|-----|
| Section gap | 24px | Between major sections |
| Card padding | 24px | Inside cards |
| Page padding | 20px | Content edges |
| Element gap | 16px | Between cards/items |
| Inner gap | 12px | Between buttons |
| Tight gap | 8px | Between chips |
| Micro gap | 4px | Icon-to-text |
