# 05 — Animation Bible

> Every animation, transition, and micro-interaction in the system. Includes exact timing, easing curves, and copy-paste Framer Motion / GSAP code snippets.

**Golden Rules:**
1. Every animation has a purpose — guide attention, provide feedback, or create delight
2. Nothing moves for more than 500ms unless it's decorative ambiance (floating elements, marquee)
3. `prefers-reduced-motion: reduce` disables everything — no exceptions
4. Mobile and desktop may have different animation intensities
5. Framer Motion for component lifecycle + interactions. GSAP for scroll-driven effects only.

---

## Easing Library

Reuse these easing curves consistently throughout the site.

```typescript
// src/lib/easings.ts

export const easings = {
  // Standard easings
  easeOut: [0.16, 1, 0.3, 1],           // Decelerate — for entrances
  easeIn: [0.4, 0, 1, 1],               // Accelerate — for exits
  easeInOut: [0.65, 0, 0.35, 1],        // Smooth — for transitions

  // Expressive easings
  spring: { type: 'spring', stiffness: 300, damping: 24 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 17 },
  springGentle: { type: 'spring', stiffness: 150, damping: 20 },

  // Custom
  snappy: [0.25, 0.46, 0.45, 0.94],     // Quick start, smooth end
} as const
```

---

## Page Load Orchestration

The initial page load is a choreographed entrance sequence. Each element appears in a deliberate order to guide the visitor's eye.

### Timeline (Home Page)

| Delay | Element | Animation | Duration |
|-------|---------|-----------|----------|
| 0ms | Grain overlay | Fade in from `opacity: 0` → `0.035` | 300ms |
| 50ms | Navigation bar | Slide down from `y: -20, opacity: 0` → `y: 0, opacity: 1` | 400ms |
| 150ms | Hero date/time | Fade in `opacity: 0` → `1` | 300ms |
| 200ms | Hero name (DynamicHeading) | Characters stagger in (see §DynamicHeading) | ~800ms total |
| 500ms | Tagline | Fade up from `y: 12, opacity: 0` → `y: 0, opacity: 1` | 400ms |
| 700ms | Subtitle | Fade up from `y: 12, opacity: 0` → `y: 0, opacity: 1` | 400ms |
| 900ms | CTA buttons | Fade up from `y: 12, opacity: 0` → `y: 0, opacity: 1` | 300ms |
| 1000ms | Decorative SVGs | Float in from edges (see §FloatingElement) | 600ms |
| 1100ms | Scroll indicator | Fade in + begin pulse loop | 300ms |
| 1200ms | Custom cursor | Activate (opacity: 0 → 1) | 200ms |

### Framer Motion Implementation

```typescript
// In HeroSection component
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

// Usage:
// <motion.div variants={containerVariants} initial="hidden" animate="visible">
//   <motion.div variants={fadeUpVariants}>Date/Time</motion.div>
//   <motion.div variants={fadeUpVariants}>Name</motion.div>
//   <motion.div variants={fadeUpVariants}>Tagline</motion.div>
//   ...
// </motion.div>
```

### Other Pages

Non-home pages use the `PageTransition` wrapper only — no orchestrated sequence. Content fades in via the route transition.

---

## DynamicHeading Animation

The signature interaction — each character is individually animated.

### Entrance (scroll into view or page load)

```typescript
const characterVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: -90,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.03,   // 30ms stagger between characters
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

// Usage: whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.5 }}
```

### Hover (per-character)

```typescript
// On each <motion.span> wrapping a character:
whileHover={{
  scale: 1.15,
  color: 'var(--color-accent)',    // Flash accent color
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 17,
  },
}}
```

**Mobile:** Hover still triggers on tap — the brief scale animation provides touch feedback. Duration stays the same but `color` change is optional (may not be noticed on quick tap).

---

## Scroll-Triggered Animations

### Fade Up (default section entrance)

Applied to: section headings, text blocks, cards, images as they enter the viewport.

```typescript
const scrollFadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

// Usage:
// <motion.div
//   variants={scrollFadeUp}
//   initial="hidden"
//   whileInView="visible"
//   viewport={{ once: true, amount: 0.2 }}
// />
```

### Stagger Children

Applied to: project card grids, tag rows, social icon rows.

```typescript
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,    // 80ms between each child
      delayChildren: 0.1,       // 100ms initial delay
    },
  },
}

// Children use scrollFadeUp variants
```

### Portrait Parallax

The about section portrait image shifts slightly on scroll for depth.

```typescript
// GSAP ScrollTrigger implementation
useEffect(() => {
  gsap.to(portraitRef.current, {
    y: -30,                      // Moves up 30px as you scroll past
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,                  // Smooth 1:1 scroll tracking
    },
  })
}, [])
```

**Mobile:** Disable parallax — `scrub: false`, no `y` movement. Parallax on small screens feels disorienting.

### Project Cards Stagger

Cards reveal left-to-right on desktop, top-to-bottom on mobile.

```typescript
const cardStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}
```

---

## Hover Micro-Interactions

### Button Hover

```typescript
// All Button variants
whileHover={{
  y: -2,
  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
}}
whileTap={{
  scale: 0.98,
  transition: { duration: 0.1 },
}}
```

Additionally, `shadow-glow` appears on hover via CSS transition (Tailwind: `hover:shadow-glow transition-shadow duration-200`).

### ProjectCard Hover

```typescript
whileHover={{
  scale: 1.02,
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
}}
```

Plus CSS transitions on the card:
- Border: `border-border` → `border-border-hover`, 300ms
- Shadow: `shadow-subtle` → `shadow-card`, 300ms
- Image inside: `scale(1)` → `scale(1.05)`, 500ms, `overflow: hidden` on wrapper

### Social Icon Hover

```css
.social-icon svg path {
  transition: fill 250ms ease;
  fill: var(--color-text-secondary);
}
.social-icon:hover svg path {
  fill: var(--color-accent);
}
```

### Nav Link Hover (Desktop)

Underline slides in from left:

```css
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width 250ms ease;
}
.nav-link:hover::after {
  width: 100%;
}
```

---

## Custom Cursor

### Spring Tracking

```typescript
'use client'

import { useMotionValue, useSpring, motion } from 'framer-motion'

export function CustomCursor() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 500, damping: 28, mass: 0.5 })
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28, mass: 0.5 })

  // Track mouse position
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9998] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      {/* Cursor dot — animate size based on state */}
      <motion.div
        className="rounded-full bg-accent"
        animate={{
          width: isInteractive ? 40 : 8,
          height: isInteractive ? 40 : 8,
          opacity: isInteractive ? 0.5 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </motion.div>
  )
}
```

### Cursor State Detection

Elements opt-in via `data-cursor` attribute:
- `data-cursor="interactive"` — buttons, links, cards → cursor scales up
- `data-cursor="text"` — large text blocks → cursor becomes vertical bar

Detection via `mouseover` event delegation on `document`, checking `e.target.closest('[data-cursor]')`.

---

## Route Transitions (Page Navigation)

### PageTransition Wrapper

```typescript
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## Mobile Navigation Menu

### Open Animation

```typescript
const menuVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
}

const linkVariants = {
  closed: { opacity: 0, y: 20 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.05,   // 50ms stagger per link
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}
```

### Hamburger → X Animation

Three `<span>` bars animated with CSS transforms:

```css
.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text-primary);
  transition: transform 300ms ease, opacity 200ms ease;
}

/* Open state */
.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
}
.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}
```

---

## Skills Marquee

### Infinite Scroll

```css
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.marquee-track {
  display: flex;
  animation: marquee 25s linear infinite;
  width: max-content;
}

.marquee-track:hover {
  animation-play-state: paused;
}
```

### Fade Edges (mask)

```css
.marquee-container {
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 10%,
    black 90%,
    transparent 100%
  );
}
```

---

## Floating Decorative Elements

Subtle ambient drift for SVG illustrations in the hero and other sections.

```typescript
// FloatingElement animation
const floatVariants = {
  animate: {
    y: [0, -drift, 0, drift * 0.5, 0],
    x: [0, drift * 0.3, 0, -drift * 0.3, 0],
    rotate: [0, rotate, 0, -rotate * 0.5, 0],
    transition: {
      duration: duration,         // 6-10 seconds
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut',
    },
  },
}

// Each instance gets different duration/drift to avoid synchronization
// e.g., cherry blossom: duration=7, drift=15
//       cactus: duration=9, drift=10
//       flower: duration=6, drift=20
```

**Mobile:** Reduce to 1-2 floating elements max, smaller `drift` (10px), simpler motion.

---

## Scroll Indicator (Hero)

Pulsing chevron or "scroll" text at bottom of hero section.

```typescript
const scrollIndicator = {
  animate: {
    y: [0, 6, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
```

Disappears after user scrolls past 100px (fade out):
```typescript
// Listen to scroll, set opacity to 0 when scrollY > 100
```

---

## WavyDivider Draw-On

Optional animation where the wavy line "draws itself" when scrolled into view.

```css
.wavy-path {
  stroke-dasharray: 600;        /* Total path length */
  stroke-dashoffset: 600;       /* Start hidden */
  transition: stroke-dashoffset 1s ease;
}

.wavy-path.visible {
  stroke-dashoffset: 0;         /* Fully drawn */
}
```

Triggered via Intersection Observer — add `.visible` class when element enters viewport.

---

## Scroll Progress Bar

Thin bar at top of page showing scroll position.

```typescript
// In ScrollProgress component
const { scrollYProgress } = useScroll()

return (
  <motion.div
    className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-50 origin-left"
    style={{ scaleX: scrollYProgress }}
  />
)
```

---

## Reduced Motion Strategy

When `prefers-reduced-motion: reduce` is active:

| Feature | Behavior |
|---------|----------|
| Page load sequence | All elements appear instantly, no stagger |
| DynamicHeading entrance | Instant appearance, no character stagger |
| DynamicHeading hover | No scale effect |
| Scroll-triggered animations | Elements visible by default, no fade/slide |
| Parallax | Disabled, static position |
| Route transitions | Instant cut, no fade |
| Custom cursor | Hidden, system cursor used |
| Skills marquee | Static display, no scroll |
| Floating elements | Static position, no drift |
| Scroll indicator | Static, no pulse |
| Button hover | Only color change, no `y` shift |
| Card hover | Only border/shadow change, no `scale` |
| Hamburger animation | Instant switch, no transition |
| WavyDivider draw-on | Fully visible immediately |

### Detection in React

```typescript
// src/lib/utils.ts
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
```

Use this hook to conditionally set `initial`, `animate`, and `transition` values. When reduced motion is preferred, set all animation durations to 0 and disable spring physics.
