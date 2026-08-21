# Nisarg Chaudhary — Portfolio

Portfolio site for Nisarg Chaudhary: Developer I at Vendasta, CS Honours with a
Studio Arts minor at the University of Saskatchewan.

The site is an **editorial publication**, not a dashboard and not a generic dev
portfolio. Big confident type, hairline structure, one accent hue, one motion
gesture. It should make a recruiter stop, a designer respect the craft, and an
engineer curious about the source.

## Read this first

**[`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md)** — the system the site is
actually built on. Read it before changing anything visual.

`docs/00-CLAUDE-CODE-BUILD-GUIDE.md` through `docs/06-CONTENT-MAP.md` are the
original build specs. They describe a **previous** design (terracotta `#ce796b`,
botanical SVGs, a six-colour treemap, marquees, glows) that has since been
replaced. Keep them for history; do not build from them.

`docs/NewApp-*.md` and `docs/SECURITY.md` are current and cover the FitGlass
sub-app and the admin auth model respectively.

## Architecture

```
src/app/
  (public)/     home, experience, projects/[slug], playground, blog
  (admin)/      Firestore-backed content editing, cookie auth
  (fitglass)/   self-contained AI nutrition app (own styles, own conventions)
  layout.tsx    fonts, metadata, theme bootstrap
  globals.css   the entire design system
src/components/
  layout/       nav, footer, cursor, grain, scroll progress, page transition
  sections/     the four home-page sections
  ui/           shared primitives (see the design doc)
src/lib/
  site-data.ts  all site copy, single source of truth
  projects.ts   Project type + static fallback data
  firebase/     server-only Firestore reads
```

- **Routing:** single-page scroll home (Hero → About → Work → Contact) plus
  routes for project details, experience, playground, and blog.
- **Rendering:** public pages are ISR (`revalidate = 60`). Project detail pages
  prerender via `generateStaticParams`. Never make a content page fully dynamic.
- **Data:** Firestore is the system of record; static fallbacks mean the site
  renders correctly with no credentials configured.
- **Themes:** dark by default, light fully supported. Both are first-class —
  check any change in both.

## Tech stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 (CSS-first
`@theme`) · Framer Motion · Firebase Admin · Vitest · Vercel.

Read `node_modules/next/dist/docs/` before writing Next.js code — this version
has breaking changes from what you may remember.

## Code style

- Functional components, named exports. Default exports only for Next.js
  `page.tsx` / `layout.tsx`.
- Props use `interface`. TypeScript strict; no `any`.
- Files `kebab-case.tsx`, components `PascalCase`.
- Tailwind utilities for styling. `cn()` for conditionals. No CSS modules, no
  styled-components, no per-component stylesheets.
- **Never hard-code a colour.** Use the design tokens — the light theme and the
  ground inversion both depend on it.
- Server components by default. Reach for `'use client'` only when a component
  genuinely needs state, effects, or pointer events, and push it to the
  smallest possible island (see `ui/local-time.tsx`).
- Interactive elements get `data-cursor="interactive"`; prose gets
  `data-cursor="text"`; decorative elements get `aria-hidden="true"`.
- Images use `next/image` with `fill` + `sizes`, or explicit dimensions.
- Every animation respects `prefers-reduced-motion` — use `Reveal` or the
  `usePrefersReducedMotion` hook.

## Before you call it done

- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` clean
- [ ] `npx eslint` — no new errors
- [ ] `npm test` passes
- [ ] Checked in **both** themes
- [ ] No horizontal scroll at 375 / 640 / 768 / 1024 / 1280 / 1440 / 1920
- [ ] Heading order has no skipped levels; exactly one `h1` per page
- [ ] Keyboard reachable, focus rings visible, mobile menu traps focus
- [ ] `prefers-reduced-motion` renders a complete still page
- [ ] No console errors
