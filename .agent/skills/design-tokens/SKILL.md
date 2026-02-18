---
name: design-tokens
description: >
  Documents and enforces UnBind's visual design system — colors, gradients,
  glassmorphism, typography, spacing, animations, and component classes. Use when
  creating new components, modifying styles, changing the theme or palette, adding
  CSS classes, reviewing UI consistency, or asking "what color should I use for X?"
---

# Design Tokens

## When to use this skill
- User creates a **new component or screen**
- User modifies **styles, colors, gradients, or spacing**
- User asks to change the **theme, palette, or branding**
- User adds **new CSS classes** to `globals.css`
- User asks "what color/gradient/radius should I use for X?"
- Reviewing UI changes for **visual consistency**

## Theme Identity

- **Theme:** Deep Sea Reader (Abyssal Teal)
- **Aesthetic:** Dark glassmorphism — frosted glass on deep teal-black
- **Font:** Inter (Google Fonts) — weights 300–900
- **Layout:** Mobile-first, max-width 480px, centered on desktop

## Quick Reference — CSS Variables

### Colors
| Variable | Value | Usage |
|----------|-------|-------|
| `--accent` | `#2DD4BF` | Primary actions, links, active states |
| `--accent-dark` | `#99F6E4` | Progress bar end, highlights |
| `--success` | `#10B981` | Finished, PUSH, positive |
| `--warning` | `#F59E0B` | QUIT, caution |
| `--danger` | `#EF4444` | Abandoned, delete, errors |
| `--text-primary` | `#F8FAFC` | Headings, main text |
| `--text-secondary` | `#D1D5DB` | Descriptions, paragraphs |
| `--text-muted` | `#9CA3AF` | Labels, hints, placeholders |

### Glassmorphism
| Variable | Value |
|----------|-------|
| `--glass-bg` | `rgba(156, 163, 175, 0.2)` |
| `--glass-bg-hover` | `rgba(156, 163, 175, 0.25)` |
| `--glass-border` | `rgba(156, 163, 175, 0.3)` |
| `--glass-blur` | `24px` |
| `--glass-radius` | `28px` |
| `--glass-shadow` | `0 25px 50px rgba(0, 0, 0, 0.4)` |

### Layout
| Variable | Value |
|----------|-------|
| `--nav-height` | `72px` |
| `--page-padding` | `20px` |
| `--card-gap` | `16px` |

## Rules

### DO ✅
- Use `var(--token)` — never hardcode hex colors
- Use existing component classes (`.glass-card`, `.btn-primary`, etc.)
- Follow the typography scale in [typography.md](references/typography.md)
- Use `rgba()` with documented base colors for transparency
- Follow the **135deg** gradient angle convention
- Use established border-radius scale: 28, 24, 20, 16, 14, 12, 8, 6
- Keep transitions 0.2s–0.3s with `ease`
- Add new styles with `/* ============ SECTION ============ */` comments

### DON'T ❌
- Hardcode colors (`color: #2DD4BF` → use `var(--accent)`)
- Use border-radius outside the scale
- Use flat backgrounds (always gradient or glass)
- Add fonts beyond Inter
- Skip `backdrop-filter` on glass elements
- Create color tokens without updating `:root`

## Status Color Pattern

```css
/* Status-tinted element formula */
background: rgba(BASE_COLOR, 0.15);        /* 15% fill */
border: 1px solid rgba(BASE_COLOR, 0.3);   /* 30% border */
color: var(--status-color);                 /* Full color text */
```

| Status | Base Color | Variable |
|--------|-----------|----------|
| Reading | `45, 212, 191` | `--accent` |
| Finished | `16, 185, 129` | `--success` |
| Abandoned | `239, 68, 68` | `--danger` |

## Workflow — Adding New UI

```markdown
- [ ] Check if an existing component class already covers the need
- [ ] Use CSS variables for ALL colors (never hardcode)
- [ ] Follow typography scale (references/typography.md)
- [ ] Match border-radius to the scale (28/24/20/16/14/12/8/6)
- [ ] Add transitions (0.2s–0.3s ease)
- [ ] Use glassmorphism stack for any card/container
- [ ] Add section comment header in globals.css
- [ ] Visual check: does it match the Deep Sea theme?
```

## File Location

All design tokens live in `src/app/globals.css` (1,098 lines):
- **Lines 8–43:** `:root` CSS variables
- **Line 6:** Font import (Inter)
- **Lines 708–726, 884–894, 1086–1090:** Animations

## Resources
- [Color Palette & Gradients](references/color-palette.md)
- [Component Classes](references/components.md)
- [Typography Scale](references/typography.md)
