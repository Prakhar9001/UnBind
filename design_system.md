# Design System: Unbind

**Status**: LOCKED (Phase 4 Specification)

## Core Aesthetic
- **Vibe**: Immersive bookshelf, clean analytics, dark gradient backgrounds.
- **Background**: Linear Gradient `#6B46C1` (Primary) → `#4C1D95` → `#1A0033` (Deep Dark Purple).
- **Cards**: Glassmorphism (`rgba(255,255,255,0.12)`, Blur 20px, Radius 24px).
- **Typography**: SF Pro Display (Bold/Semi/Regular).
- **Theme**: Dark Mode.

## Color Palette
|Token|Value|usage|
|:---|:---|:---|
|**Primary Gradient**|`#063f47` → `#021a1e`|App Background (Deep Sea Reader)|
|**Secondary Accent**|`#2DD4BF` → `#99F6E4`|Highlights, Active States, Buttons|
|**Success**|`#10B981`|Finish rates, Positive trends|
|**Warning/Abandon**|`#F59E0B`|Abandon zones, Caution|
| **Text Primary** | `#FFFFFF` | Headlines, Body |
| **Text Secondary** | `#E5E7EB` | Subtitles, Metadata |
| **Glass Card** | `rgba(255,255,255,0.12)` | Containers (Border Radius 24px) |

## Typography
- **Headlines**: SF Pro Display Bold (36pt → 24pt)
- **Body**: SF Pro Display Regular (18pt → 14pt)
- **Cards**: Semi Bold (20pt)
- **Micro**: Regular (12pt)

## UI Components
1.  **Glass Cards**: Backdrop blur, border-radius 24px, shadow `0 25px 50px rgba(0,0,0,0.25)`.
2.  **Progress Bars**: Dual tone (Completed: Accent `#00D4FF`, Remaining: Gray), Rounded 12px.
3.  **Status Badges**: Rounded pills, icon-left (checkmark/close/bookmark).
4.  **Bottom Nav**: 60px height, active glow `#00D4FF`, 4 Tabs (Dashboard, History, Insights, Profile).

## Screen Specifications

### 1. AI Insights Screen (Home/Primary)
- **Layout**:
    - **Top**: Current Book Progress Bar.
    - **Center**: AI Coaching Card (Glass).
        - Pattern Detected text.
        - "Push" vs "Quit" Action Buttons.
        - Push Score: 87%.
    - **Bottom**: Abandonment Heatmap (Mini).

### 2. Dashboard Screen
- **Layout**: 2x2 Grid of Glass Cards.
    - Card 1: Finishing Rate (Pie Chart).
    - Card 2: Abandon Heatmap (Page %).
    - Card 3: This Week (Started/Finished).
    - Card 4: Top Reasons (List).

### 3. Book Logging Screen
- **Layout**: Glass form overlay on bookshelf background.
    - Progress Slider (0-100%).
    - Multi-select Chips (Reasons).
    - "Generate Insight" Button (AI Trigger).
    - Status Toggle (Reading/Abandoned/Finished).

### 4. Bookshelf Screen
- **Layout**: Immersive Library.
    - Spines arranged by status (Green glow = Finished, Red glow = Abandoned).
    - Tap interaction -> Details + "Coach Me".
    - Search bar with floating animation.

## Micro-Interactions
- **Card Hover**: Scale 1.05 + Glow Pulse.
- **Progress**: Smooth fill animation + Haptic feedback.
- **AI Generate**: Typing indicator -> Slide-up reveal.
- **Status Change**: Icon morph.
