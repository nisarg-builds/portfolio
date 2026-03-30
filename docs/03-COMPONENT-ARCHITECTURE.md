# 03 — Component Architecture

> Every component in the system, organized by category. Each spec includes the TypeScript interface, variants, responsive behavior, animation triggers, and accessibility requirements.

**Conventions:**
- All components are functional React components with named exports
- Files use kebab-case: `dynamic-heading.tsx`
- Components use PascalCase: `DynamicHeading`
- Client components (`'use client'`) only where state, effects, or browser APIs are needed
- Props use TypeScript interfaces, not `type` aliases
- All interactive elements must be keyboard accessible
- Every animation must respect `prefers-reduced-motion`

---

## Layout Components

### `GrainOverlay`
**File:** `src/components/layout/grain-overlay.tsx`
**Directive:** Server Component (no `'use client'`)

Renders a fixed, full-screen SVG noise texture on top of all content.

```typescript
// No props — purely presentational
export function GrainOverlay() {}
```

**Behavior:**
- Fixed position, `inset-0`, `z-[9999]`
- `pointer-events-none` — never blocks interaction
- Opacity: `0.035` (very subtle)
- Uses inline `<svg>` with `<feTurbulence>` filter (see Design System §Grain)
- Always visible, all breakpoints

**Accessibility:** None needed — purely decorative, pointer-events disabled.

---

### `CustomCursor`
**File:** `src/components/layout/custom-cursor.tsx`
**Directive:** `'use client'`

Custom cursor that follows mouse with spring physics. Changes shape based on what's being hovered.

```typescript
export function CustomCursor() {}
// Internal state:
// - position: { x: number, y: number } via useSpring
// - variant: 'default' | 'interactive' | 'text' | 'click'
// - visible: boolean
```

**Behavior:**
- Tracks `mousemove` on `document`
- Detects hover targets via `data-cursor` attribute on elements:
  - `data-cursor="interactive"` → scale up to 40px
  - `data-cursor="text"` → switch to vertical bar
- Click state: squeeze to 6px on `mousedown`, restore on `mouseup`
- Spring physics: `stiffness: 500, damping: 28, mass: 0.5`
- `mix-blend-mode: difference` for contrast on any background

**Responsive:**
- **Mobile (<768px):** Not rendered. Return `null`.
- **Touch devices:** Detect via `window.matchMedia('(pointer: coarse)')` — return `null`
- Apply `cursor: none` to `<body>` only when CustomCursor is active

**Accessibility:**
- `prefers-reduced-motion`: disable spring animation, use instant positioning
- Never blocks focus indicators
- `aria-hidden="true"` on the cursor element

---

### `Navigation`
**File:** `src/components/layout/navigation.tsx`
**Directive:** `'use client'`

Responsive navigation with two distinct modes.

```typescript
interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {}
```

**Desktop (lg+):**
- Fixed top bar, full width
- Background: `--color-bg` with glass effect on scroll (add backdrop-blur after scrolling 50px)
- Left: site name/logo ("Nisarg" or brand mark) — links to `/`
- Right: horizontal links — Home, Projects, Blog, Playground, Contact
- Links use `--color-text-secondary`, hover → `--color-text-primary` with underline reveal
- Active route: `--color-accent` text color
- Height: `64px`
- Border bottom: `1px solid var(--color-border)`

**Mobile (<lg):**
- Fixed top bar, height `56px`
- Left: site name/logo
- Right: hamburger icon (3 lines → X animation on open)
- Menu opens as **full-screen overlay**:
  - Background: `--color-bg` at 95% opacity + backdrop-blur
  - Links stacked vertically, centered
  - Font size: `--text-2xl` (large, easy to tap)
  - Stagger entrance: each link fades in + slides up, 50ms stagger
  - Social icons at bottom of menu
  - Tap target: minimum 48px height per link
  - Body scroll locked when menu is open

**Animations:**
- Hamburger → X: CSS transition on the 3 lines, 300ms
- Menu open: Framer Motion `AnimatePresence`, fade + scale from 0.95
- Link stagger: Framer Motion `staggerChildren: 0.05`

**Accessibility:**
- `<nav>` landmark with `aria-label="Main navigation"`
- Hamburger: `<button aria-expanded="true|false" aria-controls="mobile-menu">`
- Menu: `role="dialog"` when open, focus trapped inside
- Escape key closes menu
- Links are `<Link>` components (Next.js) for client-side navigation

---

### `ScrollProgress`
**File:** `src/components/layout/scroll-progress.tsx`
**Directive:** `'use client'`

Thin horizontal bar at the very top of the viewport showing scroll progress.

```typescript
interface ScrollProgressProps {
  className?: string
}

export function ScrollProgress({ className }: ScrollProgressProps) {}
```

**Behavior:**
- Fixed top, `z-50`, `h-[2px]`
- Width scales from `0%` to `100%` based on scroll position
- Color: `--color-accent`
- Only visible on home page (single-page scroll)
- Uses `window.scrollY` / `document.documentElement.scrollHeight` for calculation

**Responsive:** Same behavior all breakpoints. Consider hiding on mobile if nav obscures it.

**Accessibility:** `aria-hidden="true"` — decorative only.

---

### `PageTransition`
**File:** `src/components/layout/page-transition.tsx`
**Directive:** `'use client'`

Wraps page content in Framer Motion's `AnimatePresence` for route transitions.

```typescript
interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {}
```

**Animation:**
- Exit: `opacity: 0, y: 8` — 200ms, `easeIn`
- Enter: `opacity: 1, y: 0` — 300ms, `easeOut`, 100ms delay
- Mode: `wait` (old page exits before new enters)

**Reduced motion:** Instant cut (duration: 0).

---

### `Footer`
**File:** `src/components/layout/footer.tsx`
**Directive:** Server Component (mostly)

Minimal footer with attribution and social links.

```typescript
interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {}
```

**Content:**
- Row 1: Social icons (GitHub, LinkedIn, Instagram, Email) — using `SocialIcon` component
- Row 2: "Designed & built by Nisarg Chaudhary" in `--font-mono`, `--text-xs`, `--color-text-tertiary`
- Row 3 (optional): "Made with Next.js" or similar

**Styling:**
- Background: subtle grain texture (via dot-pattern radial gradient — not the full SVG overlay)
- Border top: `1px solid var(--color-border)`
- Padding: `py-8` mobile, `py-12` desktop
- Center-aligned

**Responsive:**
- Mobile: stack social icons + text vertically
- Desktop: social icons row + text row, centered

---

## UI Primitives

### `DynamicHeading`
**File:** `src/components/ui/dynamic-heading.tsx`
**Directive:** `'use client'`

The signature interaction from the original portfolio — evolved with stagger entrance animation.

```typescript
interface DynamicHeadingProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span'
  className?: string
  animate?: boolean          // Enable entrance stagger (default: true)
  staggerDelay?: number      // ms between each character (default: 30)
}

export function DynamicHeading({
  text,
  as = 'h2',
  className,
  animate = true,
  staggerDelay = 30,
}: DynamicHeadingProps) {}
```

**Behavior:**
- Splits `text` into individual `<span>` elements per character
- Spaces get `display: inline-block; width: 0.3em` (preserve spacing without empty spans)
- **Hover:** each character scales to `1.15` with spring physics on `mouseenter`, returns on `mouseleave`
- **Entrance animation** (if `animate`): each character fades in + slides up, staggered by `staggerDelay`ms
- Uses Intersection Observer or Framer Motion `whileInView` to trigger entrance when scrolled into view

**Responsive:**
- Works at all sizes — inherits font size from parent/className
- Touch devices: hover effect still triggers on tap (brief scale animation)

**Accessibility:**
- Renders semantic heading tag via `as` prop
- The split spans don't affect screen readers (they read the text naturally)
- `prefers-reduced-motion`: skip entrance stagger, disable hover scale

---

### `Button`
**File:** `src/components/ui/button.tsx`
**Directive:** Server Component (unless onClick needed)

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string              // Renders as <Link> if provided
  external?: boolean         // Opens in new tab
  children: React.ReactNode
  className?: string
}

export function Button({
  variant = 'outline',
  size = 'md',
  href,
  external,
  children,
  className,
  ...props
}: ButtonProps) {}
```

**Variants:**
| Variant | Resting | Hover |
|---------|---------|-------|
| `primary` | `bg-accent text-bg font-medium` | `bg-accent-hover shadow-glow` |
| `outline` | `border border-accent text-accent` | `bg-accent text-bg` |
| `ghost` | `text-text-secondary` | `text-text-primary bg-bg-elevated` |

**Sizes:**
| Size | Padding | Font | Min Height |
|------|---------|------|-----------|
| `sm` | `px-3 py-1.5` | `text-sm` | `32px` |
| `md` | `px-4 py-2` | `text-base` | `40px` |
| `lg` | `px-6 py-3` | `text-lg` | `48px` |

**All variants:** `rounded-md`, `transition-all duration-200`, `cursor-pointer`, `data-cursor="interactive"`

**Responsive:** Touch target minimum 44px on mobile (adjust padding if needed).

**Accessibility:**
- Uses `<button>` or `<a>`/`<Link>` based on `href`
- External links get `target="_blank" rel="noopener noreferrer"`
- Focus ring via `:focus-visible`

---

### `Tag`
**File:** `src/components/ui/tag.tsx`
**Directive:** Server Component

Small badge for tech stack labels.

```typescript
interface TagProps {
  children: React.ReactNode
  className?: string
}

export function Tag({ children, className }: TagProps) {}
```

**Styling:**
- `bg-bg-elevated text-text-secondary text-sm px-3 py-1 rounded-sm`
- Border: `border border-border`
- Font: `--font-mono`
- No hover effect (static label)

---

### `WavyDivider`
**File:** `src/components/ui/wavy-divider.tsx`
**Directive:** Server Component (or `'use client'` if animated)

```typescript
interface WavyDividerProps {
  className?: string
  animate?: boolean         // Draw-on animation on scroll
  width?: string            // Default: '100%'
}

export function WavyDivider({ className, animate, width }: WavyDividerProps) {}
```

**Behavior:**
- Renders the wavy SVG path (see Design System §Wavy Divider)
- `preserveAspectRatio="none"` to stretch to container width
- If `animate`: uses `stroke-dasharray` + `stroke-dashoffset` animation triggered by Intersection Observer
- Color: `--color-accent`

---

### `SocialIcon`
**File:** `src/components/ui/social-icon.tsx`
**Directive:** Server Component

```typescript
interface SocialIconProps {
  platform: 'github' | 'linkedin' | 'instagram' | 'email'
  href: string
  size?: number             // Default: 24
  className?: string
}

export function SocialIcon({ platform, href, size = 24, className }: SocialIconProps) {}
```

**Behavior:**
- Renders the appropriate inline SVG icon
- Wrapped in `<a>` with `target="_blank" rel="noopener noreferrer"` (except email: `mailto:`)
- Color: `--color-text-secondary` → hover: `--color-accent`, transition 250ms
- `data-cursor="interactive"` for custom cursor

**Accessibility:** `aria-label` on link (e.g., "Visit GitHub profile").

---

### `SectionHeading`
**File:** `src/components/ui/section-heading.tsx`
**Directive:** `'use client'` (uses DynamicHeading)

```typescript
interface SectionHeadingProps {
  title: string
  subtitle?: string
  wavyDivider?: boolean     // Show wavy line under title (default: true)
  className?: string
}

export function SectionHeading({ title, subtitle, wavyDivider = true, className }: SectionHeadingProps) {}
```

**Structure:**
```
<div>
  <DynamicHeading text={title} as="h2" />
  {wavyDivider && <WavyDivider />}
  {subtitle && <p className="text-text-secondary text-lg mt-2">{subtitle}</p>}
</div>
```

---

### `SkillsMarquee`
**File:** `src/components/ui/skills-marquee.tsx`
**Directive:** `'use client'`

Infinite scrolling horizontal ticker of skills/technologies.

```typescript
interface SkillsMarqueeProps {
  items: string[]           // e.g., ['React', 'TypeScript', 'Python', ...]
  speed?: number            // Duration in seconds (default: 25)
  className?: string
}

export function SkillsMarquee({ items, speed = 25, className }: SkillsMarqueeProps) {}
```

**Behavior:**
- Renders items in a row, duplicated 2x for seamless loop
- CSS `translateX` animation from `0` to `-50%`, linear infinite
- Items separated by a dot or dash character in `--color-text-tertiary`
- Pause on hover (desktop): `animation-play-state: paused`
- Container has `overflow: hidden`, `mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent)` for fade edges

**Responsive:**
- All breakpoints — speed may be slightly faster on mobile (shorter distance)

**Accessibility:**
- `aria-hidden="true"` — the skills are listed elsewhere in the About section
- `prefers-reduced-motion`: stop animation, show static list

---

### `ProjectCard`
**File:** `src/components/ui/project-card.tsx`
**Directive:** `'use client'`

Card component for the projects grid on the home page.

```typescript
interface ProjectCardProps {
  title: string
  slug: string
  description: string
  image: string             // Path to featured image
  tags: string[]
  featured?: boolean        // Larger card in bento grid
  className?: string
}

export function ProjectCard({
  title,
  slug,
  description,
  image,
  tags,
  featured,
  className,
}: ProjectCardProps) {}
```

**Structure:**
```
<Link href={`/projects/${slug}`}>
  <article>
    <div className="image-wrapper overflow-hidden rounded-t-lg">
      <Image ... />           <!-- Zooms on hover -->
    </div>
    <div className="p-5">
      <h3>{title}</h3>
      <p>{description}</p>    <!-- Truncated to 2 lines on non-featured -->
      <div className="tags">
        {tags.map(t => <Tag>{t}</Tag>)}
      </div>
    </div>
  </article>
</Link>
```

**Styling:**
- Background: `--color-bg-surface`
- Border: `1px solid var(--color-border)`
- Rounded: `--radius-lg`
- Hover: `scale(1.02)`, `shadow-card`, image zooms `scale(1.05)`, border → `--color-border-hover`
- Transition: `300ms ease-out`
- `data-cursor="interactive"`

**Responsive:**
- Mobile: full width, image aspect ratio `16:9`
- Desktop: grid items, `featured` card spans 2 columns

**Accessibility:**
- Entire card is a link (via wrapping `<Link>`)
- `<article>` tag for semantic markup
- Image has descriptive `alt` text

---

## Section Components

### `HeroSection`
**File:** `src/components/sections/hero-section.tsx`
**Directive:** `'use client'`

Full-viewport hero landing — the first thing visitors see.

```typescript
export function HeroSection() {}
```

**Content (top to bottom):**
1. Decorative SVGs floating in background (cherry blossom, etc.) — `FloatingElement`
2. Live date/time display — small, `--font-mono`, `--text-sm`, `--color-text-tertiary`
3. Name: "Nisarg Chaudhary" — `DynamicHeading` with `as="h1"`, `--text-display`
4. Tagline: "Developer. Designer. Artist." (or Nisarg's custom tagline) — `--text-xl`, `--color-text-secondary`
5. Subtitle: brief context (internship status) — `--text-base`, `--color-text-tertiary`
6. CTA row: "View Projects" button (primary) + "Get in Touch" button (outline)
7. Scroll indicator at bottom — animated chevron or "scroll" text pulsing

**Layout:**
- `min-h-svh` (full viewport) with flex centering
- Content max-width: `640px` (mobile), `800px` (desktop)
- Center-aligned on mobile, left-aligned on desktop (optional — TBD)

**Responsive:**
- Mobile: stack vertically, reduce decorative SVGs to 1-2, smaller display text
- Desktop: full composition with 3-5 floating elements

**Animations:** See Animation Bible §Page Load Orchestration.

---

### `AboutSection`
**File:** `src/components/sections/about-section.tsx`
**Directive:** `'use client'`

```typescript
export function AboutSection() {}
```

**Content:**
1. `SectionHeading` — "About Me" or "More About Me"
2. Two-column layout (desktop): text left, portrait right
3. Bio paragraphs — 2-3 short paragraphs about background, passion, current status
4. `SkillsMarquee` — full-width ticker of technologies
5. "Resume" button (outline) — links to `/resume.pdf`

**Layout:**
- Mobile: single column — heading → bio → portrait → skills marquee → resume button
- Desktop (lg+): two columns — left (bio + resume), right (portrait image in a card with `--radius-xl`)

**Responsive:**
- Portrait image: `aspect-square` on desktop, `aspect-[4/3]` on mobile, `object-cover`
- Bio text: `--text-base` mobile, `--text-lg` desktop

---

### `ProjectsSection`
**File:** `src/components/sections/projects-section.tsx`
**Directive:** `'use client'`

```typescript
export function ProjectsSection() {}
```

**Content:**
1. `SectionHeading` — "Projects"
2. Grid of `ProjectCard` components
3. Optional "View All Projects" link if there are more than shown

**Layout — Bento Grid:**
- Mobile: single column, full-width cards stacked
- Tablet (md): 2 columns
- Desktop (lg+): 2 columns, first card spans 2 columns (featured)

```
Desktop:
┌──────────────────────────────┐
│         PCubed (featured)     │
│         (spans 2 cols)        │
├──────────────┬───────────────┤
│ Code Community│ Volunteer     │
│              │ Connect        │
├──────────────┴───────────────┤
│    Pathfinding Visualizer     │
│    (spans 2 cols or 1)        │
└──────────────────────────────┘

Mobile:
┌──────────────┐
│   PCubed     │
├──────────────┤
│ Code Commun. │
├──────────────┤
│ Volunteer C. │
├──────────────┤
│ Pathfinding  │
└──────────────┘
```

**Animations:** Stagger reveal cards on scroll — see Animation Bible.

---

### `ContactSection`
**File:** `src/components/sections/contact-section.tsx`
**Directive:** `'use client'`

```typescript
export function ContactSection() {}
```

**Content:**
1. `SectionHeading` — "Get in Touch"
2. Centered text: "Feel free to connect with me!" — `--text-xl`
3. Social icons row — `SocialIcon` components
4. `WavyDivider`
5. Email CTA button — "Say Hello" or "Email Me" (primary variant)
6. Decorative SVG illustration (optional)

**Layout:**
- Center-aligned at all breakpoints
- `min-h-[60vh]` — generous vertical space
- Compact on mobile, spacious on desktop

---

## Decorative Components

### `FloatingElement`
**File:** `src/components/decorative/floating-element.tsx`
**Directive:** `'use client'`

Animated SVG decoration that subtly drifts and rotates.

```typescript
interface FloatingElementProps {
  children: React.ReactNode   // SVG content
  initialX?: number           // Starting X position (%)
  initialY?: number           // Starting Y position (%)
  drift?: number              // Max drift distance in px (default: 20)
  duration?: number           // Animation cycle in seconds (default: 6)
  rotate?: number             // Max rotation in degrees (default: 5)
  className?: string
}

export function FloatingElement({
  children,
  initialX = 0,
  initialY = 0,
  drift = 20,
  duration = 6,
  rotate = 5,
  className,
}: FloatingElementProps) {}
```

**Behavior:**
- Positioned absolutely within a relative parent
- Animates with Framer Motion: subtle `x`, `y`, and `rotate` oscillation
- Uses `transition: { repeat: Infinity, repeatType: 'reverse', duration }`
- Randomize start offset so multiple floating elements aren't synchronized

**Responsive:**
- Mobile: reduce `drift` to `10px`, fewer instances rendered
- Desktop: full drift and rotation

**Accessibility:**
- `aria-hidden="true"`
- `prefers-reduced-motion`: no animation, static position

---

### `DecorativeSVG`
**File:** `src/components/decorative/decorative-svg.tsx`
**Directive:** Server Component

Static SVG illustration wrapper — for placing the hand-drawn flower/cactus/tree SVGs.

```typescript
interface DecorativeSVGProps {
  name: 'cherry-blossom' | 'flower' | 'cactus' | 'tree' | 'deer' | 'leaves'
  size?: number              // Default: 80
  className?: string
}

export function DecorativeSVG({ name, size = 80, className }: DecorativeSVGProps) {}
```

**Behavior:**
- Maps `name` to the corresponding SVG from `public/images/decorative/`
- Renders via `next/image` or inline SVG depending on complexity
- Purely presentational, no interaction

**Accessibility:** `aria-hidden="true"`, `role="presentation"`

---

## Component Dependency Tree

```
layout.tsx (root)
├── GrainOverlay
├── CustomCursor
├── Navigation
│   └── SocialIcon (in mobile menu)
├── ScrollProgress (home page only)
├── PageTransition
│   └── page content (children)
└── Footer
    └── SocialIcon

page.tsx (home)
├── HeroSection
│   ├── DynamicHeading
│   ├── Button
│   ├── FloatingElement
│   │   └── DecorativeSVG
│   └── DateTime (inline)
├── AboutSection
│   ├── SectionHeading
│   │   ├── DynamicHeading
│   │   └── WavyDivider
│   ├── SkillsMarquee
│   └── Button
├── ProjectsSection
│   ├── SectionHeading
│   └── ProjectCard
│       └── Tag
└── ContactSection
    ├── SectionHeading
    ├── SocialIcon
    ├── WavyDivider
    └── Button

projects/[slug]/page.tsx
├── Tag
├── Button
└── DecorativeSVG

blog/page.tsx
├── SectionHeading
└── ProjectCard (reused as BlogPostCard)

playground/page.tsx
└── SectionHeading
```
