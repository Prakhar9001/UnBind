# Component Classes Reference

Every reusable CSS class in UnBind's design system (`src/app/globals.css`).

## Cards & Containers
| Class | What It Produces |
|-------|-----------------|
| `.glass-card` | Frosted glass container — blur, border, shadow, radius 28px, padding 24px. Hover: lift + brightens. |
| `.coach-card` | AI coach container — teal gradient bg, teal border, radius 28px |
| `.insight-card` | Card with left accent border (3px solid `--accent`) |
| `.stat-card` | Individual stat block — padding 20px, used inside `.glass-card` |
| `.confirm-dialog` | Centered modal dialog — dark gradient bg, radius 24px |

## Buttons
| Class | Style |
|-------|-------|
| `.btn` | Base — flex, padding 12×24, radius 16px, weight 600, transition 0.25s |
| `.btn-primary` | Teal gradient + teal glow shadow |
| `.btn-secondary` | Transparent, subtle glass border |
| `.btn-success` | Green gradient |
| `.btn-warning` | Orange gradient |
| `.btn-danger` | Red gradient + red glow shadow |
| `.btn-ghost` | Invisible — icon-only, hover reveals subtle bg |
| `.btn-full` | Full width (`width: 100%`) |
| `.coach-btn-inline` | Small teal-tinted button (12px font, radius 12px) |

## Status & Labels
| Class | Style |
|-------|-------|
| `.status-badge` | Pill shape — radius 20px, 11px uppercase bold. Combine with: |
| `.status-badge.reading` | Teal tint bg + teal text |
| `.status-badge.finished` | Green tint bg + green text |
| `.status-badge.abandoned` | Red tint bg + red text |
| `.stat-label` | 12px uppercase muted label |
| `.stat-value` | 32px bold number. Combine with `.success`/`.warning`/`.accent`/`.danger` |

## Forms
| Class | Style |
|-------|-------|
| `.input-group` | Form field wrapper (margin-bottom 20px) |
| `.input-label` | 12px uppercase muted label |
| `.input-field` | Full-width input — dark bg, glass border, radius 16px, focus glow |
| `.chip-group` | Flex-wrap container for chips |
| `.chip` | Selectable tag — radius 20px, glass bg. Combine with `.selected` for teal |
| `.tab-group` | Tab bar container — dark bg, glass border, radius 16px |
| `.tab` | Tab item — radius 12px. Combine with `.active` |
| `.toggle-group` | Row of toggle buttons |
| `.toggle-btn` | Toggle — radius 14px. Combine with `.active` for teal |
| `.range-slider` | Custom slider — 8px track, 24px teal thumb |

## Layout
| Class | Style |
|-------|-------|
| `.app-shell` | Full-height flex column, max-width 480px, centered |
| `.app-content` | Scrollable content area, padding from `--page-padding`, hidden scrollbar |
| `.bottom-nav` | Fixed bottom bar — dark blur bg, z-index 100 |
| `.nav-item` | Nav button — column flex, 10px uppercase. Combine with `.active` |
| `.stat-grid` | 2-column grid with `--card-gap` gap |
| `.section` | Generic section wrapper (margin-bottom 24px) |
| `.section-title` | 18px bold heading |
| `.page-header` | Container for page title + subtitle |
| `.book-list` | Vertical list of book items (gap 12px) |
| `.book-card-actions` | Row of action buttons on book cards |
| `.profile-actions` | Column of profile action buttons |

## Book Elements
| Class | Style |
|-------|-------|
| `.book-item` | Book row — flex, gap 16px, padding 16px, clickable |
| `.book-cover` | 48×68px placeholder — dark gradient, emoji centered |
| `.book-info` | Flex-1 text container with min-width 0 |
| `.book-title` | 15px bold, truncated with ellipsis |
| `.book-author` | 12px muted |
| `.book-progress` | Progress bar wrapper |
| `.book-progress-text` | 11px secondary, space-between |

## Progress
| Class | Style |
|-------|-------|
| `.progress-bar-container` | Track — 12px height, slate bg, rounded |
| `.progress-bar-fill` | Fill — teal→aqua gradient, 1s transition, glow edge |

## Charts
| Class | Style |
|-------|-------|
| `.donut-chart` | 100×100px SVG donut chart container |
| `.heatmap-row` | Horizontal bar — label + bar + value |
| `.heatmap-bar` | Bar track — 24px height, subtle bg |
| `.heatmap-fill` | Bar fill — 0.8s width transition |

## Modals & Overlays
| Class | Style |
|-------|-------|
| `.modal-overlay` | Full-screen — dark bg (70%), blur 8px, z-index 200, fadeIn |
| `.modal-sheet` | Bottom sheet — dark gradient bg, radius 28px top, slideUp |
| `.modal-handle` | 40×4px white bar, centered |
| `.confirm-overlay` | Full-screen — dark bg (75%), blur 8px, z-index 300 |
| `.confirm-dialog` | Centered dialog — dark gradient, radius 24px |

## States
| Class | Style |
|-------|-------|
| `.empty-state` | Centered no-data placeholder — large icon, text, CTA |
| `.loading-screen` | Full-screen centered spinner |
| `.loading-spinner` | 40×40px spinning ring — accent top-border |
| `.login-screen` | Full-screen centered login layout |
| `.login-container` | Max-width 400px login box |
| `.login-error` | Red-tinted error banner — radius 12px |

## FAB
| Class | Style |
|-------|-------|
| `.fab` | 56×56px floating button — teal→blue gradient, radius 20px, z-index 50 |
