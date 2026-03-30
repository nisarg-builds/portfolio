# Nisarg Chaudhary — Portfolio Website

## Project Overview

A design-masterpiece portfolio website for Nisarg Chaudhary — CS Honours student (Software Engineering) with a Studio Arts minor at the University of Saskatchewan. Currently on an internship (May 2025 – Aug 2026).

This is NOT a generic developer portfolio. It's a **warm, handcrafted digital experience** that reflects Nisarg's dual identity as an engineer and artist. Think: dark gallery space, terracotta accents, hand-drawn SVG illustrations, grain textures, and playful micro-interactions.

**Live site goal:** A site that makes recruiters pause, designers respect, and developers curious about the implementation.

## Architecture

- **Hybrid routing:** Single-page scroll home (Hero → About → Projects → Contact) with separate routes for project details, blog, and playground
- **Mobile-first:** Every layout designed for phone first, enhanced for desktop
- **Dark-only:** No light mode

## Documentation (Read in Order)

1. **[`docs/01-TECH-STACK.md`](docs/01-TECH-STACK.md)** — Stack decisions, project structure, configs
2. **[`docs/02-DESIGN-SYSTEM.md`](docs/02-DESIGN-SYSTEM.md)** — Color tokens, typography, spacing, shadows, grain, cursor
3. **[`docs/03-COMPONENT-ARCHITECTURE.md`](docs/03-COMPONENT-ARCHITECTURE.md)** — Every component with TypeScript interfaces, variants, responsive specs
4. **[`docs/04-PAGE-SPECS.md`](docs/04-PAGE-SPECS.md)** — Mobile-first wireframes for all pages
5. **[`docs/05-ANIMATION-BIBLE.md`](docs/05-ANIMATION-BIBLE.md)** — Every animation with exact timing, easing, and code snippets
6. **[`docs/06-CONTENT-MAP.md`](docs/06-CONTENT-MAP.md)** — All text, images, links, and assets

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4** (CSS-first `@theme` config)
- **Framer Motion** (component animations, page transitions)
- **GSAP + ScrollTrigger** (scroll-driven effects only)
- **MDX** via `next-mdx-remote` (blog posts)
- **Vercel** (deployment)

## Build Sequence

Follow this order. Each step should result in a working (if incomplete) site.

### Phase 1: Foundation
1. **Initialize project** — `npx create-next-app@latest` with TypeScript, Tailwind, App Router, `src/` directory
2. **Install dependencies** — See `docs/01-TECH-STACK.md` §Dependencies
3. **Set up globals.css** — Copy the complete template from `docs/02-DESIGN-SYSTEM.md` §Complete globals.css Template
4. **Set up fonts** — Download Space Grotesk, Inter, JetBrains Mono as woff2 → `public/fonts/`, configure `next/font/local` in `layout.tsx`
5. **Create `src/lib/utils.ts`** — `cn()` helper using `clsx` + `tailwind-merge`

### Phase 2: Layout Shell
6. **Build `GrainOverlay`** — Fixed SVG noise layer
7. **Build `Navigation`** — Desktop horizontal nav + mobile hamburger menu with full-screen overlay
8. **Build `Footer`** — Attribution + social icons
9. **Assemble root `layout.tsx`** — Grain + Nav + children + Footer, font classes on `<body>`

### Phase 3: UI Primitives
10. **Build `DynamicHeading`** — Per-character spans, hover scale, entrance stagger
11. **Build `Button`** — 3 variants (primary/outline/ghost), 3 sizes, link support
12. **Build remaining primitives** — `Tag`, `WavyDivider`, `SocialIcon`, `SectionHeading`, `SkillsMarquee`, `ProjectCard`

### Phase 4: Home Page Sections
13. **Build `HeroSection`** — Full-viewport hero with name, tagline, CTAs, decorative SVGs
14. **Build `AboutSection`** — Bio, portrait, skills marquee, resume link
15. **Build `ProjectsSection`** — Bento grid of project cards
16. **Build `ContactSection`** — Social links, email CTA
17. **Assemble `page.tsx`** — Stack all 4 sections, add scroll behavior

### Phase 5: Sub-Pages
18. **Build project detail page** — `/projects/[slug]/page.tsx` with data from `src/lib/projects.ts`
19. **Build blog listing** — `/blog/page.tsx` (empty state is fine)
20. **Build blog post template** — `/blog/[slug]/page.tsx` with MDX rendering
21. **Build playground page** — `/playground/page.tsx` (placeholder experiments)
22. **Build 404 page** — `not-found.tsx`

### Phase 6: Polish
23. **Add `CustomCursor`** — Spring physics, state detection, desktop only
24. **Add `ScrollProgress`** — Thin accent bar on home page
25. **Add `PageTransition`** — Route transitions via AnimatePresence
26. **Add scroll-triggered animations** — Fade-up on sections, stagger on grids, parallax on portrait
27. **Add decorative `FloatingElement`s** — Ambient SVG drift in hero

### Phase 7: Launch Prep
28. **SEO** — Metadata on all pages (see `docs/06-CONTENT-MAP.md` §SEO)
29. **Accessibility audit** — Focus rings, ARIA labels, keyboard nav, reduced motion
30. **Performance** — Lighthouse check, image optimization, lazy loading
31. **Copy assets** — Migrate images from old portfolio (see `docs/06-CONTENT-MAP.md` §Asset Migration)
32. **Deploy to Vercel**

## Code Style Rules

### General
- TypeScript strict mode
- Functional components with named exports: `export function Button() {}`
- No default exports except for Next.js pages (`page.tsx`, `layout.tsx`)
- Props use `interface`, not `type`

### File Naming
- Components: `kebab-case.tsx` → `dynamic-heading.tsx`
- Component names: `PascalCase` → `DynamicHeading`
- Utilities: `kebab-case.ts` → `utils.ts`
- Content: `kebab-case.mdx` or `kebab-case.json`

### Styling
- Tailwind utility classes as the primary styling method
- Use `cn()` for conditional classes: `cn('base-class', condition && 'conditional-class')`
- CSS custom properties (from `globals.css`) for design tokens
- No inline `style={}` except for dynamic values (positions, transforms)
- No CSS modules, no styled-components, no external CSS files per component

### Animation Rules
- **Framer Motion** for: component mount/unmount, hover, tap, drag, layout, page transitions
- **GSAP** for: scroll-pinned timelines, parallax, timeline scrubbing
- **CSS transitions** for: simple hover color/shadow/border changes
- Never mix Framer Motion and GSAP on the same element
- Every animation must check `prefers-reduced-motion` (use `usePrefersReducedMotion` hook)

### Components
- Keep components focused — one responsibility per file
- Extract shared logic into hooks in `src/lib/`
- Interactive elements get `data-cursor="interactive"` attribute
- All images use `next/image` with explicit `width` and `height`
- `aria-hidden="true"` on all decorative elements

## Testing Checklist

Before considering the site "done":

- [ ] All pages render without errors (dev + production build)
- [ ] Mobile responsive: test at 375px, 640px, 768px, 1024px, 1280px
- [ ] Navigation works on all pages (mobile menu + desktop links)
- [ ] All project cards link to correct detail pages
- [ ] Social links open in new tabs (correct URLs)
- [ ] Resume link opens PDF in new tab
- [ ] Email button opens mail client
- [ ] Keyboard navigation works throughout (Tab, Enter, Escape)
- [ ] Focus rings visible on all interactive elements
- [ ] `prefers-reduced-motion` disables all animations
- [ ] No horizontal scroll on any viewport width
- [ ] Lighthouse scores: Performance >90, Accessibility >95, SEO >95
- [ ] Custom cursor hidden on mobile/touch devices
- [ ] Blog page renders (even if empty — shows "Coming soon" state)
- [ ] 404 page displays for unknown routes
- [ ] Page transitions work between routes
- [ ] No console errors or warnings
