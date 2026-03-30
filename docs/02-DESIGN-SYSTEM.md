# 02 — Design System

> Single source of truth for every visual token. This document maps directly to CSS custom properties in `globals.css` and Tailwind's `@theme` configuration.

---

## Design Philosophy

This is a **warm, handcrafted digital portfolio** — not a corporate template. The design system evolves Nisarg's original 2023 aesthetic:
- Dark background that lets warm accents breathe
- Organic, hand-drawn elements mixed with clean typography
- Texture and grain that give analog warmth to digital surfaces
- Generous whitespace — content never feels cramped
- Every interaction has personality

**Dark-only. No light mode toggle.**

---

## Color Tokens

### Core Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-bg` | `#111110` | `17, 17, 16` | Page background — warm near-black |
| `--color-bg-surface` | `#1a1917` | `26, 25, 23` | Card backgrounds, elevated sections |
| `--color-bg-elevated` | `#232220` | `35, 34, 32` | Hover states, active surfaces, nav bg |
| `--color-text-primary` | `#e5e1dd` | `229, 225, 221` | Headings, primary text (platinum) |
| `--color-text-secondary` | `#a8a49e` | `168, 164, 158` | Body text, paragraphs |
| `--color-text-tertiary` | `#6b6862` | `107, 104, 98` | Metadata, timestamps, subtle labels |
| `--color-accent` | `#ce796b` | `206, 121, 107` | Primary accent — old rose / terracotta |
| `--color-accent-hover` | `#d98e82` | `217, 142, 130` | Accent hover / active state |
| `--color-accent-secondary` | `#ea8589` | `234, 133, 137` | Secondary accent — light coral (decorative SVGs, subtle highlights) |
| `--color-border` | `#2a2927` | `42, 41, 39` | Subtle borders, dividers |
| `--color-border-hover` | `#3d3b38` | `61, 59, 56` | Border hover state |
| `--color-overlay` | `rgba(0, 0, 0, 0.6)` | — | Modal/menu overlay backdrop |

### Semantic Aliases

```css
--color-link: var(--color-accent);
--color-link-hover: var(--color-accent-hover);
--color-focus-ring: var(--color-accent);
--color-scrollbar-thumb: var(--color-border-hover);
--color-scrollbar-track: var(--color-bg);
--color-selection-bg: rgba(206, 121, 107, 0.3);
--color-selection-text: var(--color-text-primary);
```

### Implementation in `globals.css`

```css
@theme {
  --color-bg: #111110;
  --color-bg-surface: #1a1917;
  --color-bg-elevated: #232220;
  --color-text-primary: #e5e1dd;
  --color-text-secondary: #a8a49e;
  --color-text-tertiary: #6b6862;
  --color-accent: #ce796b;
  --color-accent-hover: #d98e82;
  --color-accent-secondary: #ea8589;
  --color-border: #2a2927;
  --color-border-hover: #3d3b38;
}
```

Usage in Tailwind: `bg-bg`, `text-text-primary`, `border-border`, `text-accent`, etc.

---

## Typography

### Font Families

| Role | Font | Weight | Fallback Stack |
|------|------|--------|---------------|
| Display / Headings | **Space Grotesk** | 500, 700 | `system-ui, -apple-system, sans-serif` |
| Body | **Inter** | 300, 400 | `system-ui, -apple-system, sans-serif` |
| Mono | **JetBrains Mono** | 400 | `ui-monospace, 'Cascadia Code', monospace` |

### Type Scale (Fluid with `clamp()`)

All sizes scale fluidly between 375px (mobile) and 1280px (desktop) viewport widths.

| Token | Min | Preferred | Max | Usage |
|-------|-----|-----------|-----|-------|
| `--text-xs` | `0.75rem` (12px) | `0.7rem + 0.15vw` | `0.8125rem` (13px) | Labels, metadata, timestamps |
| `--text-sm` | `0.8125rem` (13px) | `0.78rem + 0.2vw` | `0.9375rem` (15px) | Captions, small body, tags |
| `--text-base` | `0.9375rem` (15px) | `0.9rem + 0.2vw` | `1.0625rem` (17px) | Body text, paragraphs |
| `--text-lg` | `1.0625rem` (17px) | `1rem + 0.25vw` | `1.25rem` (20px) | Large body, card text |
| `--text-xl` | `1.25rem` (20px) | `1.1rem + 0.4vw` | `1.5rem` (24px) | Small headings, nav links |
| `--text-2xl` | `1.5rem` (24px) | `1.2rem + 0.8vw` | `2.25rem` (36px) | Section headings |
| `--text-3xl` | `2rem` (32px) | `1.5rem + 1.2vw` | `3rem` (48px) | Large section headings |
| `--text-display` | `2.5rem` (40px) | `1.5rem + 3vw` | `5rem` (80px) | Hero name display |

### Implementation

```css
@theme {
  --text-xs: clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem);
  --text-sm: clamp(0.8125rem, 0.78rem + 0.2vw, 0.9375rem);
  --text-base: clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem);
  --text-lg: clamp(1.0625rem, 1rem + 0.25vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.4vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 0.8vw, 2.25rem);
  --text-3xl: clamp(2rem, 1.5rem + 1.2vw, 3rem);
  --text-display: clamp(2.5rem, 1.5rem + 3vw, 5rem);

  --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;
}
```

### Line Heights

| Context | Value |
|---------|-------|
| Headings | `1.1` |
| Body | `1.6` |
| Tight (tags, buttons) | `1.3` |
| Display | `1.0` |

### Letter Spacing

| Context | Value |
|---------|-------|
| Display | `-0.02em` |
| Headings | `-0.01em` |
| Body | `0` |
| Labels / uppercase | `0.05em` |
| Mono | `-0.01em` |

---

## Spacing System

Base unit: `4px`. All spacing uses multiples of 4.

| Token | Value | Common Usage |
|-------|-------|-------------|
| `--space-1` | `4px` | Tight gaps, icon padding |
| `--space-2` | `8px` | Inline spacing, small gaps |
| `--space-3` | `12px` | Tag padding, tight component gaps |
| `--space-4` | `16px` | Default padding, paragraph gaps |
| `--space-5` | `20px` | Card inner padding (mobile) |
| `--space-6` | `24px` | Component gaps |
| `--space-8` | `32px` | Section inner padding, card padding (desktop) |
| `--space-10` | `40px` | Section gaps |
| `--space-12` | `48px` | Large gaps |
| `--space-16` | `64px` | Section vertical padding (mobile) |
| `--space-20` | `80px` | Section vertical padding (tablet) |
| `--space-24` | `96px` | Section vertical padding (desktop) |
| `--space-32` | `128px` | Hero section top padding |

> Use Tailwind's default spacing scale (`p-4`, `gap-6`, `mt-8`, etc.) — it already follows a 4px base.

### Container

| Breakpoint | Max Width | Padding |
|------------|-----------|---------|
| Mobile (<640px) | `100%` | `20px` (px-5) |
| sm (640px) | `100%` | `24px` (px-6) |
| md (768px) | `720px` | `24px` |
| lg (1024px) | `960px` | `32px` |
| xl (1280px) | `1120px` | `32px` |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Tags, small badges |
| `--radius-md` | `8px` | Buttons, inputs |
| `--radius-lg` | `12px` | Cards, modals |
| `--radius-xl` | `16px` | Large cards, image containers |
| `--radius-full` | `9999px` | Pills, avatars, circular elements |

### Implementation

```css
@theme {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

---

## Shadows / Elevation

All shadows use warm-tinted blacks (not pure black) to maintain the warm aesthetic.

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-subtle` | `0 1px 2px rgba(0, 0, 0, 0.3)` | Resting cards, tags |
| `--shadow-card` | `0 4px 12px rgba(0, 0, 0, 0.4)` | Hovered cards |
| `--shadow-elevated` | `0 8px 24px rgba(0, 0, 0, 0.5)` | Modals, dropdowns |
| `--shadow-glow` | `0 0 20px rgba(206, 121, 107, 0.15)` | Accent glow (buttons, focus) |

### Implementation

```css
@theme {
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(206, 121, 107, 0.15);
}
```

---

## Glassmorphism

Used for: modals, mobile nav overlay, special callout cards.

```css
.glass {
  background: rgba(26, 25, 23, 0.7);        /* --color-bg-surface at 70% */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(229, 225, 221, 0.08); /* --color-text-primary at 8% */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

Variants:
- **Light glass**: `background: rgba(229, 225, 221, 0.05)` — for subtle card overlays
- **Dark glass**: `background: rgba(17, 17, 16, 0.8)` — for nav, heavy overlays

---

## Grain / Noise Texture

The grain overlay gives analog warmth. Applied as a fixed, full-screen layer on top of everything with `pointer-events: none`.

### SVG Noise Filter

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
</svg>
```

### CSS Application

```css
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.035;
  filter: url(#grain);
  width: 100%;
  height: 100%;
}
```

> Opacity is intentionally very subtle (`0.035`). It should feel tactile, not noisy.

---

## Custom Cursor

Desktop only — hidden on touch devices via `@media (pointer: coarse)`.

### Spec

| State | Size | Color | Blend Mode |
|-------|------|-------|-----------|
| Default | `8px` circle | `--color-accent` | `difference` |
| Hovering interactive | `40px` circle | `--color-accent` at 50% opacity | `difference` |
| Hovering text | `2px` wide, `24px` tall vertical bar | `--color-accent` | `normal` |
| Clicking | `6px` circle (squeeze) | `--color-accent` | `difference` |

### Spring Physics (Framer Motion `useSpring`)

```typescript
const cursorSpring = {
  stiffness: 500,
  damping: 28,
  mass: 0.5,
}
```

### Hide Conditions
- Touch devices (`pointer: coarse`)
- Mobile viewport (<768px)
- When any input is focused
- `prefers-reduced-motion: reduce`

---

## Wavy Divider

SVG path used as a section separator. Accent-colored.

```svg
<svg width="100%" height="12" viewBox="0 0 287 15" fill="none" preserveAspectRatio="none">
  <path
    d="M2 6.5C2 6.5 4.6 13 11.8 13C19 13 25.5 2 33.3 2C41 2 46.9 13 55.9 13C65 13 67.6 2 76.8 2C86 2 90.2 13 100.1 13C110 13 111.8 2 120.9 2C130 2 134.9 13 144.2 13C153.5 13 156.6 2 165.1 2C173.5 2 177.2 13 188.3 13C199.5 13 199.9 2 209.2 2C218.5 2 223 13 232.5 13C242 13 244 2 253.3 2C262.6 2 269 13 274.5 13C280 13 285 8.5 285 7.5"
    stroke="var(--color-accent)"
    stroke-width="2.5"
    stroke-linecap="round"
    fill="none"
  />
</svg>
```

- Width: spans container (`width="100%"` with `preserveAspectRatio="none"`)
- Color: `--color-accent` (terracotta)
- Optional: animate with CSS `stroke-dashoffset` for a drawing effect on scroll

---

## Breakpoints (Mobile-First)

| Name | Min Width | Target |
|------|-----------|--------|
| (default) | `0px` | Mobile phones |
| `sm` | `640px` | Large phones / small tablets |
| `md` | `768px` | Tablets |
| `lg` | `1024px` | Small laptops / desktops |
| `xl` | `1280px` | Desktops |

> These are Tailwind's defaults. No custom breakpoints needed.

### Responsive Design Rules
1. **Always design mobile layout first** — desktop is the enhancement
2. **Stack vertically on mobile** — side-by-side on desktop
3. **Touch targets minimum 44px** on mobile
4. **No custom cursor on mobile** — use system cursor
5. **No snap-scrolling on mobile** — free scroll only
6. **Reduce decorative elements on mobile** — fewer floating SVGs, simpler compositions

---

## Focus & Accessibility

### Focus Ring

```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Text Selection

```css
::selection {
  background: rgba(206, 121, 107, 0.3);
  color: var(--color-text-primary);
}
```

### Contrast Ratios

| Combination | Ratio | Pass |
|-------------|-------|------|
| `--text-primary` on `--bg` | ~14.5:1 | AAA |
| `--text-secondary` on `--bg` | ~7.8:1 | AAA |
| `--text-tertiary` on `--bg` | ~4.6:1 | AA (large text only) |
| `--accent` on `--bg` | ~5.2:1 | AA |
| `--accent` on `--bg-surface` | ~4.8:1 | AA |

> `--text-tertiary` should only be used for non-essential metadata labels, never for body text.

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Scrollbar Styling

```css
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border-hover);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-tertiary);
}
```

> Firefox: use `scrollbar-width: thin; scrollbar-color: var(--color-border-hover) var(--color-bg);`

---

## Complete `globals.css` Template

```css
@import 'tailwindcss';

/* ========================================
   Design System Tokens
   ======================================== */

@theme {
  /* Colors */
  --color-bg: #111110;
  --color-bg-surface: #1a1917;
  --color-bg-elevated: #232220;
  --color-text-primary: #e5e1dd;
  --color-text-secondary: #a8a49e;
  --color-text-tertiary: #6b6862;
  --color-accent: #ce796b;
  --color-accent-hover: #d98e82;
  --color-accent-secondary: #ea8589;
  --color-border: #2a2927;
  --color-border-hover: #3d3b38;

  /* Typography */
  --text-xs: clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem);
  --text-sm: clamp(0.8125rem, 0.78rem + 0.2vw, 0.9375rem);
  --text-base: clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem);
  --text-lg: clamp(1.0625rem, 1rem + 0.25vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.4vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 0.8vw, 2.25rem);
  --text-3xl: clamp(2rem, 1.5rem + 1.2vw, 3rem);
  --text-display: clamp(2.5rem, 1.5rem + 3vw, 5rem);

  --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-glow: 0 0 20px rgba(206, 121, 107, 0.15);
}

/* ========================================
   Base Styles
   ======================================== */

html {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-hover) var(--color-bg);
}

body {
  font-family: var(--font-body);
  font-weight: 300;
  color: var(--color-text-secondary);
  background-color: var(--color-bg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  color: var(--color-text-primary);
  line-height: 1.1;
  letter-spacing: -0.01em;
}

::selection {
  background: rgba(206, 121, 107, 0.3);
  color: var(--color-text-primary);
}

*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* ========================================
   Scrollbar
   ======================================== */

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-bg); }
::-webkit-scrollbar-thumb { background: var(--color-border-hover); border-radius: var(--radius-full); }
::-webkit-scrollbar-thumb:hover { background: var(--color-text-tertiary); }

/* ========================================
   Reduced Motion
   ======================================== */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
