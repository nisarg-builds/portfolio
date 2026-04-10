# FitGlass — UI Components & Behavior Spec

> Exact behavior, props, states, and edge cases for every component.
> All components are client components (`'use client'`) since they use hooks, state, and browser APIs.
> Animations use Framer Motion (already in portfolio). Styling uses Tailwind v4 with `nt-*` tokens.

---

## 1. Design System

### 1.1 Tailwind v4 Tokens

Defined in `lib/fitglass/styles/fitglass.css` using `@theme`:

```css
@theme {
  --color-fg-bg: #FAFAF8;
  --color-fg-card: #FFFFFF;
  --color-fg-border: #ECECEC;
  --color-fg-text: #1A1A1A;
  --color-fg-text-soft: #8A8A8A;
  --color-fg-accent: #2D6A4F;
  --color-fg-accent-light: #D8F3DC;
  --color-fg-protein: #2D6A4F;
  --color-fg-carbs: #E9C46A;
  --color-fg-fat: #E76F51;
  --color-fg-danger: #DC3545;
  --color-fg-danger-light: #FDE8EA;
  --color-fg-chat-user: #E8F0E8;
  --color-fg-chat-ai: #F5F5F3;
}
```

Usage: `className="bg-fg-card text-fg-text border-fg-border"`.

### 1.2 Typography

```
Font: DM Sans (load via next/font/google in FitGlass layout.tsx)
Weights: 400, 500, 600, 700

Sizes (use Tailwind classes):
  - Big number:    text-4xl font-bold tracking-tight
  - Section label: text-xs font-medium uppercase tracking-widest text-fg-text-soft
  - Body:          text-sm font-normal
  - Small:         text-xs font-normal/medium
```

### 1.3 Font Loading (Next.js way)

```typescript
// app/(fitglass)/fitglass/layout.tsx
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
});

export default function FitGlassLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${dmSans.variable} font-[family-name:var(--font-dm-sans)]`}>
      {children}
    </div>
  );
}
```

### 1.4 Spacing & Sizing

```
Card border-radius: rounded-xl (12px)
Card padding: p-5 (20px)
Button border-radius: rounded-lg (8px)
Input border-radius: rounded-lg (8px)
Max content width: max-w-md (480px) mx-auto
Bottom padding: pb-20 (80px, space for nav)
```

### 1.5 Framer Motion Conventions

Use Framer Motion for:
- **View transitions**: `AnimatePresence` + `motion.div` with fade/slide when switching tabs
- **Modal enter/exit**: `AddFoodModal` slides up, fades overlay
- **Chat messages**: New messages fade in + slide up slightly
- **Micro-interactions**: Button press scale, progress bar width animation

Standard animation config (keep consistent):
```typescript
const fadeSlideUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
};

const modalSheet = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { type: 'spring', damping: 25, stiffness: 300 },
};
```

---

## 2. Component Specs

### 2.1 AppShell / BottomNav

**File:** `app/(fitglass)/_components/layout/AppShell.tsx` (client component)

**Behavior:**
- Max-width 480px, centered, min-height screen, `bg-fg-bg` background
- Renders `BottomNav` at top (sticky)
- Renders active view below, wrapped in `AnimatePresence` for transitions
- Active view switches via Zustand `activeView` state

**BottomNav:**
- 5 tab buttons: Today, AI Chat, Week, Insights, Profile
- Active tab: `font-semibold text-fg-text` + 2px accent bottom border
- Inactive tab: `font-normal text-fg-text-soft` + transparent border
- `motion.div` layoutId on the active indicator for smooth sliding animation

---

### 2.2 TodayView

**File:** `app/(fitglass)/_components/today/TodayView.tsx`

**Layout (top to bottom):**
1. `CalorieSummaryCard` — big number, progress bar, remaining/over
2. `MacroDonut` — pie chart + P/C/F (only if entries exist)
3. `FoodLogList` — header buttons + entries list

**CalorieSummaryCard:**
- `consumed / target kcal` — consumed is `text-4xl font-bold`, target is `text-sm text-fg-text-soft`
- `ProgressBar` fills green (`bg-fg-accent`) when under target, red (`bg-fg-danger`) when over
- Animate the progress bar width with Framer Motion `motion.div` + `animate={{ width: ... }}`
- Below: left = remaining/over text, right = TDEE value

**MacroDonut:**
- Only render if `todayEntries.length > 0`
- Recharts `PieChart` with `innerRadius` for donut style
- Three columns beside the chart: protein (green dot), carbs (yellow dot), fat (coral dot)
- Each shows value + "g" + label

**FoodLogList:**
- Header: uppercase label + "AI Chat" ghost button + "+ Add" primary button
- Each `FoodLogItem`: name, "P: Xg · C: Yg · F: Zg" subtitle, calorie count, × delete button
- Delete: no confirmation, optimistic removal
- Empty state: centered muted text, prominent CTA buttons

---

### 2.3 ChatView

**File:** `app/(fitglass)/_components/chat/ChatView.tsx`

**Layout:**
- Compact summary bar (sticky, shows consumed/target + P/C/F)
- Scrollable message area (`flex-1 overflow-y-auto`)
- Optional image preview strip
- Input bar (bottom, above keyboard on mobile)

**ChatMessage (user):**
- Right-aligned, `bg-fg-chat-user`, rounded bubble (14px radius, bottom-right 4px)
- Optional image thumbnail above text
- Animate in with `motion.div` fade+slideUp

**ChatMessage (assistant):**
- Left-aligned, small accent avatar circle, "Lens" label
- `bg-fg-chat-ai` text bubble
- `FoodCard` components below bubble (if foods present)
- Animate in with `motion.div` fade+slideUp

**ChatInput:**
- `[📷 button] [textarea] [send button]`
- Image button: 40×40, `border-fg-border`, opens `<input type="file" accept="image/*" />`
- Textarea: auto-expanding (1 row → max 4 rows), Enter sends, Shift+Enter newline
- Send button: 40×40, `bg-fg-accent` when enabled, `bg-fg-border` when disabled
- Disabled when: loading OR (no text AND no image queued)

**FoodCard:**
- White card with border, shows: food name, macro `MicroBadge` pills, "+ Log" button
- "+ Log" calls `addFoodEntry` via the store, posts confirmation in chat
- Expandable "Show micronutrients ›" — reveals fiber, sugar, sodium, vitamin badges
- `motion.div` for expand/collapse of micros section (`AnimatePresence`)

**Loading state:**
- Three animated dots in an AI bubble (use Framer Motion `animate={{ opacity, scale }}` with `transition.repeat`)
- "Analyzing..." label next to avatar

---

### 2.4 AddFoodModal

**File:** `app/(fitglass)/_components/shared/AddFoodModal.tsx`

**Trigger:** "+ Add" button on TodayView

**Animation (Framer Motion):**
- Overlay: `motion.div` with `modalOverlay` animation (fade)
- Sheet: `motion.div` with `modalSheet` animation (spring slide up from bottom)
- Wrap in `AnimatePresence` at the parent level for exit animation

**Content:**
- Header: "Add food" + × close button
- Search input (auto-focused on open)
- Scrollable quick foods list (max-h-48 overflow-y-auto)
- Divider
- Custom food inputs: name, 2×2 grid (calories, protein, carbs, fat)
- "Add custom food" button (disabled until name + calories filled)

**Behavior:**
- Click overlay to dismiss (with exit animation)
- Escape key to dismiss
- Basic focus trap: Tab cycles within modal

---

### 2.5 WeekView

**File:** `app/(fitglass)/_components/week/WeekView.tsx`

**Layout:**
1. Bar chart card — Recharts BarChart, 7 days, accent green bars
2. Two stat cards side-by-side: avg/day + days on target

**Bar chart:**
- Rounded top corners on bars (`radius={[4, 4, 0, 0]}`)
- X-axis: abbreviated dates, muted, no axis line
- Y-axis: auto-scaled, muted, no axis line
- Tooltip: rounded, bordered, shows "X kcal"
- Legend below: target line reference

**Stat cards:**
- Big number + label
- "On target" = has entries AND within target ± 100 kcal

---

### 2.6 InsightsView

**File:** `app/(fitglass)/_components/insights/InsightsView.tsx`

**Layout:**
1. Insights card — dynamic `InsightBadge` components
2. Fat loss overview card — prose text with bold numbers
3. Quick tips card — 4 tips with left border accent

**InsightBadge:**
- `bg-fg-accent-light text-fg-accent` for "good"
- `bg-fg-danger-light text-fg-danger` for "warning"
- `bg-gray-100 text-fg-text` for "info"
- Animate in with staggered `motion.div` delays

---

### 2.7 ProfileView

**File:** `app/(fitglass)/_components/profile/ProfileView.tsx`

**Layout:**
1. Profile form card — inputs + toggles
2. Calculated targets card — 2×2 grid
3. Reset button (danger)

**Form behavior:**
- All changes save immediately (debounced 500ms to Firestore)
- Toggle buttons for gender, activity, goal rate — use `motion.button` with `whileTap={{ scale: 0.97 }}`
- Active toggle: `bg-fg-accent text-white`, inactive: `border-fg-border bg-transparent`

**Reset button:**
- `window.confirm()` → reset profile to defaults + delete all foodLog entries

---

## 3. Responsive Behavior

The app is mobile-first at 480px max-width, centered. On desktop it renders as a centered phone-width card which works well as a portfolio embed.

| Breakpoint | Behavior |
|-----------|----------|
| < 340px | Tab labels may truncate, use smaller font |
| 340-480px | Default layout (all specs above) |
| 480px+ | Centered card, no layout change needed |

---

## 4. Loading & Empty States

| View | Loading State | Empty State |
|------|--------------|-------------|
| TodayView | Skeleton cards (pulsing `animate-pulse` rectangles) | "No food logged yet" + AI Chat & Quick Add buttons |
| ChatView | Three animated dots in AI bubble | Welcome message from Lens |
| WeekView | Skeleton chart area | Chart with zero-height bars, stats show 0 |
| InsightsView | None (instant compute) | Single info badge: "Start logging meals..." |
| ProfileView | Skeleton form fields | Pre-filled with defaults |

---

## 5. Accessibility Checklist

- [ ] All buttons have `aria-label` or visible text
- [ ] Tab navigation works for all interactive elements
- [ ] Focus trapped inside AddFoodModal when open
- [ ] Focus moves to chat input when switching to Chat view
- [ ] Color is never the only indicator (text + icons accompany colors)
- [ ] `ProgressBar` has `role="progressbar"` + `aria-valuenow/min/max`
- [ ] Delete buttons have `aria-label="Remove {food name}"`
- [ ] Image upload button has `aria-label="Upload food image"`
- [ ] Chart has `aria-label` describing the data trend
- [ ] All form inputs have associated `<label>` elements
