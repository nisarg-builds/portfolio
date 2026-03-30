# 01 — Tech Stack & Project Structure

## Stack Overview

| Layer | Technology | Version | Why |
|-------|-----------|---------|-----|
| Framework | **Next.js** | 15.x (App Router) | SSG for performance, file-based routing for blog/projects/playground, `next/image` optimization, metadata API for SEO, React Server Components |
| Language | **TypeScript** | 5.x | Type safety for component props, content types, and data structures |
| Styling | **Tailwind CSS** | v4 | Utility-first, mobile-first breakpoints by default, CSS-first configuration, zero-runtime |
| Component Animation | **Framer Motion** | 12.x | Declarative enter/exit/hover/gesture animations, `AnimatePresence` for route transitions, layout animations, spring physics |
| Scroll Animation | **GSAP + ScrollTrigger** | 3.12+ | Scroll-pinned timelines, parallax, scrubbing. Nisarg already knows GSAP from the original portfolio |
| Content | **MDX** (via `next-mdx-remote`) | latest | Blog posts with embedded React components, rich content authoring |
| Syntax Highlighting | **Shiki** | latest | Code blocks in blog posts, matches dark theme |
| Utilities | **clsx + tailwind-merge** | latest | Conditional class composition via `cn()` helper |
| Deployment | **Vercel** | — | Already familiar, zero-config Next.js deployment, analytics |
| Analytics | **@vercel/analytics** | latest | Lightweight, privacy-friendly, already used in original site |
| Linting | **ESLint + Prettier** | latest | Next.js ESLint config, Tailwind Prettier plugin for class sorting |

---

## Why This Stack

### Next.js 15 over plain React (CRA)
The original site used Create React App — a single bundle with client-side routing. The new site needs:
- **Multiple routes** (`/projects/[slug]`, `/blog/[slug]`, `/playground`) — App Router handles this natively
- **Static generation** for blog posts and project pages — fast loads, SEO-friendly
- **Image optimization** — `next/image` with automatic WebP/AVIF, lazy loading, responsive sizes
- **Metadata API** — per-page titles, descriptions, OG images without a library

### Tailwind v4 over CSS Modules / styled-components
- Mobile-first breakpoints are the default (`sm:`, `md:`, `lg:`) — matches our mobile-first design approach
- CSS-first config in v4 means design tokens live in `globals.css` as `@theme` — no separate JS config file needed
- Zero runtime — styles are compiled at build time
- Utility classes keep component files self-contained

### Framer Motion + GSAP (dual animation approach)
- **Framer Motion** handles: component mount/unmount transitions, hover states, gesture interactions, layout animations, `AnimatePresence` for route transitions
- **GSAP ScrollTrigger** handles: scroll-pinned sections, parallax, timeline scrubbing — things Framer Motion doesn't do as well
- Rule: if it's scroll-driven, use GSAP. If it's component lifecycle or interaction, use Framer Motion.

### MDX for blog
- Write posts in Markdown with embedded React components (code demos, interactive widgets)
- Integrates naturally with Next.js App Router
- Content lives in the repo (no CMS needed for now)

---

## Project Directory Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout — Nav, Footer, GrainOverlay, CustomCursor, fonts
│   │   ├── page.tsx                   # Home — single-page scroll (Hero → About → Projects → Contact)
│   │   ├── not-found.tsx              # Custom 404 page
│   │   ├── projects/
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Individual project detail page
│   │   ├── blog/
│   │   │   ├── page.tsx               # Blog listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx           # Individual blog post (MDX rendered)
│   │   └── playground/
│   │       └── page.tsx               # Interactive experiments gallery
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navigation.tsx         # Responsive nav — hamburger (mobile) / horizontal (desktop)
│   │   │   ├── footer.tsx             # Minimal footer with social icons + grain bg
│   │   │   ├── grain-overlay.tsx      # Fixed full-screen SVG noise texture
│   │   │   ├── custom-cursor.tsx      # Spring-physics cursor, hidden on touch
│   │   │   ├── scroll-progress.tsx    # Accent-colored progress bar (home page)
│   │   │   └── page-transition.tsx    # Framer AnimatePresence wrapper
│   │   │
│   │   ├── ui/
│   │   │   ├── dynamic-heading.tsx    # Per-character hover scale + stagger entrance
│   │   │   ├── button.tsx             # Primary / outline / ghost variants, 3 sizes
│   │   │   ├── tag.tsx                # Tech stack badges
│   │   │   ├── wavy-divider.tsx       # SVG wavy line separator
│   │   │   ├── social-icon.tsx        # Social media icon with hover effect
│   │   │   ├── section-heading.tsx    # Section title + optional wavy underline
│   │   │   ├── skills-marquee.tsx     # Infinite scrolling ticker
│   │   │   └── project-card.tsx       # Project preview card for grid
│   │   │
│   │   ├── sections/
│   │   │   ├── hero-section.tsx       # Full-viewport hero landing
│   │   │   ├── about-section.tsx      # Bio, portrait, skills, resume
│   │   │   ├── projects-section.tsx   # Bento/grid of project cards
│   │   │   └── contact-section.tsx    # Social links, email CTA
│   │   │
│   │   └── decorative/
│   │       ├── floating-element.tsx   # Animated SVG with drift/rotation
│   │       └── decorative-svg.tsx     # Static SVG illustration wrapper
│   │
│   ├── lib/
│   │   ├── utils.ts                   # cn() helper (clsx + twMerge), other utilities
│   │   ├── projects.ts               # Project data array + TypeScript types
│   │   ├── blog.ts                    # MDX file reading, frontmatter parsing
│   │   └── constants.ts              # Site-wide constants (links, metadata)
│   │
│   ├── content/
│   │   ├── projects/                  # Project data (JSON or MDX files per project)
│   │   └── blog/                      # MDX blog posts
│   │
│   └── styles/
│       └── globals.css                # @theme tokens, @font-face, base styles, grain texture
│
├── public/
│   ├── images/
│   │   ├── projects/                  # Project screenshots (optimized PNGs)
│   │   ├── decorative/                # SVG illustrations (flowers, cactus, tree, etc.)
│   │   └── brand/                     # Logo, favicon, portrait photo
│   ├── resume.pdf
│   └── fonts/                         # Self-hosted font files (woff2)
│
├── .eslintrc.json                     # Next.js ESLint + Tailwind plugin
├── .prettierrc                        # Prettier config with Tailwind class sorting
├── .gitignore
├── next.config.ts                     # Next.js config
├── tailwind.config.ts                 # Tailwind v4 config (if needed beyond CSS @theme)
├── tsconfig.json                      # TypeScript strict config
├── package.json
└── CLAUDE.md                          # AI agent instructions
```

---

## Configuration Specs

### `package.json` — Dependencies

```json
{
  "name": "nisarg-portfolio",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "framer-motion": "^12",
    "gsap": "^3.12",
    "next-mdx-remote": "^5",
    "shiki": "^1",
    "clsx": "^2",
    "tailwind-merge": "^2",
    "@vercel/analytics": "^1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "^15",
    "prettier": "^3",
    "prettier-plugin-tailwindcss": "^0.6",
    "@tailwindcss/typography": "^0.5"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `next.config.ts`

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',          // Static export for Vercel (or remove if using SSR features)
  images: {
    unoptimized: true,        // Required for static export; remove if using Vercel image optimization
  },
}

export default nextConfig
```

> **Note:** If deploying to Vercel with their image optimization, remove `output: 'export'` and `images.unoptimized`. Vercel handles this natively.

### `postcss.config.mjs`

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### `.gitignore`

```
node_modules/
.next/
out/
.env*.local
*.tsbuildinfo
next-env.d.ts
.DS_Store
```

---

## Font Strategy

**Option A — Adobe Typekit (original approach):**
The original site loaded Poleno and Basic Sans via `use.typekit.net/iqt2wst.css`. If Nisarg still has an Adobe Fonts subscription, continue using this — add the Typekit stylesheet link in `layout.tsx`.

**Option B — Self-hosted alternatives (recommended for performance):**
- **Display/Headings:** `Space Grotesk` or `Syne` (Google Fonts, similar character to Poleno — bold, distinctive)
- **Body:** `Inter` (weight 300–400, clean, excellent readability)
- **Mono:** `JetBrains Mono` (blog code blocks, footer)

Download `.woff2` files → `public/fonts/` → load via `@font-face` in `globals.css` → register in `next/font/local` for automatic optimization.

**Decision:** Start with Option B for zero-dependency font loading. Nisarg can swap to Typekit later if preferred.

---

## Key Architecture Decisions

1. **App Router (not Pages Router)** — Server Components by default, layouts persist across routes, streaming/Suspense support
2. **Client Components only where needed** — animations, interactions, and state use `'use client'`; content and layout stay server
3. **Static content in `/content/`** — projects as JSON, blog posts as MDX files. No external CMS. Easy to add later.
4. **No component library** — no MUI, no Radix, no shadcn. Every component is custom-built to match the design system exactly. This is a design portfolio — generic components won't cut it.
5. **No state management library** — React state + context is sufficient for this scope
6. **Image optimization** — use `next/image` with explicit `width`/`height` for all images. Decorative SVGs inlined or loaded as components.
