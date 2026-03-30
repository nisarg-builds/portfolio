# 04 — Page Specifications

> Mobile-first wireframe-level specs for every page. Mobile layout is defined first, desktop enhancements follow.

---

## Global Layout (Root `layout.tsx`)

Every page shares this shell:

```
┌─────────────────────────────────────┐
│ GrainOverlay (fixed, z-9999)        │  ← always visible, pointer-events: none
│ CustomCursor (fixed, z-9998)        │  ← desktop only
├─────────────────────────────────────┤
│ Navigation (fixed top, z-50)        │
├─────────────────────────────────────┤
│                                     │
│         Page Content                │
│         (PageTransition wrapper)    │
│                                     │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

**Body:** `padding-top: 56px` (mobile nav height) / `64px` (desktop nav height).

---

## Navigation Behavior

### Mobile (<1024px)

```
┌──────────────────────────┐
│ ◆ Nisarg          ☰      │  56px height
└──────────────────────────┘
```

- `◆` = brand mark (small SVG or letter "N")
- `☰` = hamburger button (right-aligned)
- Background: `--color-bg` solid
- Border bottom: `1px solid var(--color-border)`

**Menu open (full-screen overlay):**

```
┌──────────────────────────┐
│ ◆ Nisarg          ✕      │
├──────────────────────────┤
│                          │
│                          │
│          Home            │
│                          │
│         Projects         │
│                          │
│          Blog            │
│                          │
│       Playground         │
│                          │
│        Contact           │
│                          │
│                          │
│     ◉  ◉  ◉  ◉          │  ← social icons
│                          │
└──────────────────────────┘
```

- Links: `--text-2xl`, `--font-display`, weight 500, center-aligned
- Tap target per link: full-width, `py-4` (min 48px)
- Social icons: row of 4, `24px` each, centered, `--color-text-tertiary`
- Background: `--color-bg` at 98% opacity + `backdrop-filter: blur(20px)`
- Body scroll: locked (`overflow: hidden` on `<body>`)

### Desktop (lg+)

```
┌──────────────────────────────────────────────────────────────┐
│  ◆ Nisarg                    Home  Projects  Blog  Play  ✉  │  64px
└──────────────────────────────────────────────────────────────┘
```

- Left: brand mark + "Nisarg" in `--font-display`, `--text-lg`
- Right: nav links in `--font-body`, `--text-sm`, `--color-text-secondary`
- `✉` = Contact button (outline variant, small)
- Active link: `--color-accent` + 2px underline
- Hover: `--color-text-primary` + underline slides in from left (CSS transition)
- On scroll (>50px): add `backdrop-filter: blur(12px)` + slightly darker bg

---

## Home Page (`/`)

Single-page scroll with 4 sections. `ScrollProgress` bar visible at top.

**Scroll behavior:**
- Mobile: natural free scroll, no snapping
- Desktop (lg+): `scroll-snap-type: y proximity` — soft snap, doesn't fight the user

### Section 1: Hero

**Mobile (375px):**

```
┌──────────────────────────┐
│                    🌸     │  ← 1 decorative SVG (top-right, subtle)
│                          │
│  ◐ 29/03/2026 14:32      │  ← live clock, mono font, text-xs
│                          │
│  Nisarg                  │  ← text-display, DynamicHeading
│  Chaudhary               │
│                          │
│  Developer.              │  ← tagline, text-xl, text-secondary
│  Designer.               │
│  Artist.                 │
│                          │
│  CS Honours + Studio     │  ← subtitle, text-sm, text-tertiary
│  Arts — building at      │
│  [company]               │
│                          │
│  ┌──────────┐ ┌────────┐ │
│  │ Projects │ │Contact │ │  ← CTA buttons
│  └──────────┘ └────────┘ │
│                          │
│           ↓              │  ← scroll indicator (animated)
└──────────────────────────┘
   min-height: 100svh
```

**Desktop (1280px):**

```
┌────────────────────────────────────────────────────────────────┐
│                                                  🌸             │
│    🌿                                                    🌺     │  ← 3-5 FloatingElements
│                                                                │
│         ◐ 29/03/2026 14:32                                     │
│                                                                │
│         Nisarg Chaudhary                                       │  ← text-display
│                                                                │
│         Developer. Designer. Artist.                           │  ← text-xl
│                                                                │
│         CS Honours + Studio Arts — currently building at ...   │  ← text-base
│                                                                │
│         ┌──────────────┐  ┌──────────────┐                     │
│         │ View Projects │  │ Get in Touch │                     │
│         └──────────────┘  └──────────────┘                     │
│                                                                │
│                                                     🌵          │
│                              ↓                                 │
└────────────────────────────────────────────────────────────────┘
```

- Content left-aligned, max-width `700px`, left offset ~10%
- Decorative SVGs positioned absolutely in corners/edges
- Scroll indicator: centered bottom, `mb-8`

---

### Section 2: About

**Mobile (375px):**

```
┌──────────────────────────┐
│                          │
│  More About Me           │  ← SectionHeading + DynamicHeading
│  ∿∿∿∿∿∿∿∿∿∿∿∿∿          │  ← WavyDivider
│                          │
│  Hello! My name is       │  ← bio text, text-base
│  Nisarg Chaudhary...     │
│  [2-3 paragraphs]        │
│                          │
│  ┌──────────────────────┐│
│  │                      ││
│  │    [portrait photo]  ││  ← aspect-[4/3], rounded-xl
│  │                      ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│  ← SkillsMarquee (full-width)
│  │ React · TypeScript · ││
│  │ Python · Java · ...  ││
│  └──────────────────────┘│
│                          │
│  ┌──────────┐            │
│  │ Resume ↗ │            │  ← outline button
│  └──────────┘            │
│                          │
└──────────────────────────┘
   py-16 (64px top/bottom)
```

**Desktop (1280px):**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│         More About Me                                          │
│         ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿                                     │
│                                                                │
│    ┌──────────────────────────────┐  ┌────────────────────────┐│
│    │                              │  │                        ││
│    │  Hello! My name is Nisarg    │  │                        ││
│    │  Chaudhary...                │  │    [portrait photo]    ││
│    │                              │  │                        ││
│    │  [2-3 paragraphs]            │  │    aspect-square       ││
│    │                              │  │    rounded-xl          ││
│    │                              │  │                        ││
│    │  ┌──────────┐                │  │                        ││
│    │  │ Resume ↗ │                │  └────────────────────────┘│
│    │  └──────────┘                │                            │
│    └──────────────────────────────┘                            │
│                                                                │
│    ┌──────────────────────────────────────────────────────────┐│
│    │  React · TypeScript · Python · Java · Next.js · GSAP ·  ││
│    └──────────────────────────────────────────────────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Two columns: `lg:grid lg:grid-cols-5 lg:gap-12` — text gets 3 cols, photo gets 2 cols
- SkillsMarquee spans full width below the columns
- Portrait has subtle `shadow-card` on hover

---

### Section 3: Projects

**Mobile (375px):**

```
┌──────────────────────────┐
│                          │
│  Projects                │  ← SectionHeading
│  ∿∿∿∿∿∿∿∿∿              │
│                          │
│  ┌──────────────────────┐│  ← ProjectCard (full-width)
│  │ [PCubed image]       ││
│  │ PCubed               ││
│  │ University project   ││
│  │ ┌────┐┌────┐┌──────┐ ││
│  │ │React││PgSQL││Docker│││
│  │ └────┘└────┘└──────┘ ││
│  └──────────────────────┘│
│                          │  ← gap-4
│  ┌──────────────────────┐│
│  │ [Code Community img] ││
│  │ Code Community       ││
│  │ Reddit clone...      ││
│  │ ┌────┐┌──────┐┌────┐ ││
│  │ │React││NodeJS││MySQL│││
│  │ └────┘└──────┘└────┘ ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │ [Volunteer Connect]  ││
│  │ ...                  ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │ [Pathfinding Viz]    ││
│  │ ...                  ││
│  └──────────────────────┘│
│                          │
└──────────────────────────┘
   py-16
```

**Desktop (1280px):**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│         Projects                                         🖐     │
│         ∿∿∿∿∿∿∿∿∿∿∿                                           │
│                                                                │
│    ┌──────────────────────────────────────────────────────────┐│
│    │                                                          ││
│    │                PCubed (featured — spans 2 cols)          ││
│    │                                                          ││
│    └──────────────────────────────────────────────────────────┘│
│                                                                │
│    ┌─────────────────────────┐  ┌────────────────────────────┐│
│    │                         │  │                            ││
│    │    Code Community       │  │    Volunteer Connect       ││
│    │                         │  │                            ││
│    └─────────────────────────┘  └────────────────────────────┘│
│                                                                │
│    ┌──────────────────────────────────────────────────────────┐│
│    │                                                          ││
│    │              Pathfinding Visualizer                      ││
│    │                                                          ││
│    └──────────────────────────────────────────────────────────┘│
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Grid: `grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6`
- Featured card: `md:col-span-2`
- Last card (Pathfinding): `md:col-span-2` or `md:col-span-1` (flexible)
- Cards link to `/projects/[slug]`

---

### Section 4: Contact

**Mobile (375px):**

```
┌──────────────────────────┐
│                          │
│  Get in Touch            │  ← SectionHeading
│  ∿∿∿∿∿∿∿∿∿∿∿            │
│                          │
│                          │
│  Feel free to            │  ← text-xl, center
│  connect with me!        │
│                          │
│     ◉    ◉    ◉    ◉    │  ← Social icons (GH, LI, IG, EM)
│                          │
│     ────────────         │  ← subtle divider line
│                          │
│     ┌────────────┐       │
│     │  Say Hello  │       │  ← primary button, opens mailto:
│     └────────────┘       │
│                          │
│                          │
└──────────────────────────┘
   min-h-[50vh], py-16, text-center
```

**Desktop (1280px):**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                       Get in Touch                       🍃    │
│                       ∿∿∿∿∿∿∿∿∿∿∿                            │
│                                                                │
│                                                                │
│                Feel free to connect with me!                   │
│                                                                │
│                   ◉    ◉    ◉    ◉                             │
│                                                                │
│                   ──────────────                               │
│                                                                │
│                   ┌────────────┐                               │
│                   │  Say Hello  │                               │
│                   └────────────┘                               │
│                                                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Same layout, just more spacious (`min-h-[60vh]`, `py-24`)
- Social icons larger (`32px`)
- Optional decorative SVG in corner

---

## Project Detail Page (`/projects/[slug]`)

**Mobile (375px):**

```
┌──────────────────────────┐
│                          │
│  ← Back to Projects      │  ← ghost button / link
│                          │
│  ┌──────────────────────┐│
│  │                      ││
│  │  [hero image]        ││  ← full-width, aspect-video, rounded-lg
│  │                      ││
│  └──────────────────────┘│
│                          │
│  PCubed                  │  ← text-3xl, font-display
│                          │
│  ┌────┐┌────┐┌──────┐   │  ← tags
│  │React││PgSQL││Docker│  │
│  └────┘└────┘└──────┘   │
│                          │
│  This was a group        │  ← description, text-base, text-secondary
│  project made for a      │
│  university class...     │
│  [full description]      │
│                          │
│  ┌──────────────────────┐│
│  │  View on GitHub  ↗   ││  ← outline button
│  └──────────────────────┘│
│                          │
│  Screenshots             │  ← text-xl heading
│  ┌──────────────────────┐│
│  │ [screenshot 1]       ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ [screenshot 2]       ││
│  └──────────────────────┘│
│                          │
│  ────────────────────    │
│                          │
│  ┌────────┐ ┌──────────┐│
│  │ ← Prev │ │ Next →   ││  ← prev/next project navigation
│  └────────┘ └──────────┘│
│                          │
└──────────────────────────┘
```

**Desktop (1280px):**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│    ← Back to Projects                                          │
│                                                                │
│    ┌──────────────────────────────────────────────────────────┐│
│    │                                                          ││
│    │                   [hero image]                           ││
│    │                   aspect-[21/9], rounded-xl              ││
│    │                                                          ││
│    └──────────────────────────────────────────────────────────┘│
│                                                                │
│    ┌─────────────────────────────────┐  ┌────────────────────┐│
│    │                                 │  │                    ││
│    │  PCubed                         │  │  Technologies      ││
│    │                                 │  │  ┌────┐ ┌────┐    ││
│    │  This was a group project...    │  │  │React│ │PgSQL│   ││
│    │  [full description]             │  │  └────┘ └────┘    ││
│    │                                 │  │  ┌──────┐ ┌────┐  ││
│    │                                 │  │  │Docker│ │MUI │  ││
│    │                                 │  │  └──────┘ └────┘  ││
│    │                                 │  │                    ││
│    │  ┌────────────────────┐         │  │  Links             ││
│    │  │  View on GitHub  ↗ │         │  │  ┌──────────────┐  ││
│    │  └────────────────────┘         │  │  │ GitHub  ↗    │  ││
│    │                                 │  │  └──────────────┘  ││
│    └─────────────────────────────────┘  └────────────────────┘│
│                                                                │
│    Screenshots                                                 │
│    ┌──────────────────────┐ ┌──────────────────────┐          │
│    │ [screenshot 1]       │ │ [screenshot 2]       │          │
│    └──────────────────────┘ └──────────────────────┘          │
│    ┌──────────────────────┐ ┌──────────────────────┐          │
│    │ [screenshot 3]       │ │ [screenshot 4]       │          │
│    └──────────────────────┘ └──────────────────────┘          │
│                                                                │
│    ┌────────────────┐                    ┌──────────────────┐  │
│    │ ← Prev Project │                    │ Next Project →   │  │
│    └────────────────┘                    └──────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Description + sidebar: `lg:grid lg:grid-cols-3 gap-8` — description 2 cols, sidebar 1 col
- Screenshots: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Prev/next: `flex justify-between`
- Max content width: `960px`, centered

**Route transition:** Fade + slide up on enter (see Animation Bible).

---

## Blog Listing (`/blog`)

**Mobile (375px):**

```
┌──────────────────────────┐
│                          │
│  Blog                    │  ← SectionHeading
│  ∿∿∿∿∿                  │
│                          │
│  ┌──────────────────────┐│  ← blog post card
│  │ Post Title            ││
│  │ Mar 29, 2026          ││  ← text-xs, text-tertiary, mono
│  │ A short excerpt of    ││  ← text-sm, text-secondary, 2 lines max
│  │ what this post is...  ││
│  │ ┌────┐ ┌──────┐      ││
│  │ │React│ │Design│      ││  ← tags
│  │ └────┘ └──────┘      ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │ Another Post Title    ││
│  │ ...                  ││
│  └──────────────────────┘│
│                          │
│  (empty state if no      │
│   posts yet:             │
│   "Coming soon...")      │
│                          │
└──────────────────────────┘
```

**Desktop (1280px):**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│         Blog                                                   │
│         ∿∿∿∿∿                                                  │
│                                                                │
│    ┌─────────────────────────┐  ┌────────────────────────────┐│
│    │ Post Title              │  │ Another Post Title         ││
│    │ Mar 29, 2026            │  │ Mar 15, 2026               ││
│    │ A short excerpt...      │  │ Another excerpt...         ││
│    │ ┌────┐ ┌──────┐        │  │ ┌──────┐ ┌────┐           ││
│    │ │React│ │Design│        │  │ │Python│ │ ML │           ││
│    │ └────┘ └──────┘        │  │ └──────┘ └────┘           ││
│    └─────────────────────────┘  └────────────────────────────┘│
│                                                                │
│    ┌─────────────────────────┐                                │
│    │ Third Post              │                                │
│    │ ...                     │                                │
│    └─────────────────────────┘                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Grid: `grid grid-cols-1 md:grid-cols-2 gap-6`
- Blog post cards: similar styling to `ProjectCard` — `bg-bg-surface`, `border-border`, `rounded-lg`, hover lift
- Each card links to `/blog/[slug]`
- Max content width: `960px`

---

## Blog Post (`/blog/[slug]`)

**Mobile & Desktop (responsive prose):**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│    ← Back to Blog                                              │
│                                                                │
│    Post Title Here                                             │  ← text-3xl
│    March 29, 2026 · 5 min read                                │  ← text-xs, mono, tertiary
│    ┌────┐ ┌──────┐                                            │
│    │React│ │Design│                                            │
│    └────┘ └──────┘                                            │
│                                                                │
│    ────────────────────────────────                            │  ← divider
│                                                                │
│    [MDX content rendered here]                                 │
│                                                                │
│    Paragraphs, headings, code blocks,                         │
│    images, embedded components...                              │
│                                                                │
│    ```typescript                                               │
│    const hello = 'world'                                       │
│    ```                                                         │
│                                                                │
│    ────────────────────────────────                            │
│                                                                │
│    ┌────────────────┐          ┌──────────────────┐           │
│    │ ← Prev Post    │          │    Next Post →   │           │
│    └────────────────┘          └──────────────────┘           │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Prose container: `max-w-[680px] mx-auto`
- Use `@tailwindcss/typography` (`prose` class) for MDX content styling
- Customize prose colors to match design system:
  - `prose-headings:text-text-primary`
  - `prose-p:text-text-secondary`
  - `prose-a:text-accent`
  - `prose-code:text-accent-secondary prose-code:bg-bg-elevated`
  - `prose-pre:bg-bg-surface prose-pre:border prose-pre:border-border`
- Code blocks: Shiki with a custom dark theme matching `--color-bg-surface`

---

## Playground (`/playground`)

**Mobile (375px):**

```
┌──────────────────────────┐
│                          │
│  Playground              │  ← SectionHeading
│  ∿∿∿∿∿∿∿∿∿∿             │
│                          │
│  Interactive experiments │  ← subtitle, text-secondary
│  and creative coding.    │
│                          │
│  ┌──────────────────────┐│  ← experiment card
│  │ 🎨                    ││
│  │ Generative Art       ││  ← title
│  │ Procedural patterns  ││  ← description, text-sm
│  │ with p5.js           ││
│  │                      ││
│  │  ┌──────────────┐    ││
│  │  │    Launch →   │    ││  ← button or link
│  │  └──────────────┘    ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │ 🔍                    ││
│  │ Pathfinding          ││
│  │ Visualize A*, BFS,   ││
│  │ Dijkstra algorithms  ││
│  │  ┌──────────────┐    ││
│  │  │    Launch →   │    ││
│  │  └──────────────┘    ││
│  └──────────────────────┘│
│                          │
│  More experiments        │
│  coming soon...          │  ← text-tertiary, italic
│                          │
└──────────────────────────┘
```

**Desktop (1280px):**

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│         Playground                                             │
│         ∿∿∿∿∿∿∿∿∿∿                                            │
│         Interactive experiments and creative coding.           │
│                                                                │
│    ┌─────────────────────────┐  ┌────────────────────────────┐│
│    │ 🎨                       │  │ 🔍                          ││
│    │ Generative Art          │  │ Pathfinding               ││
│    │ Procedural patterns     │  │ Visualize A*, BFS,        ││
│    │ with p5.js              │  │ Dijkstra algorithms       ││
│    │                         │  │                            ││
│    │  ┌──────────────┐       │  │  ┌──────────────┐         ││
│    │  │    Launch →   │       │  │  │    Launch →   │         ││
│    │  └──────────────┘       │  │  └──────────────┘         ││
│    └─────────────────────────┘  └────────────────────────────┘│
│                                                                │
│                     More experiments coming soon...            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Each experiment card: `bg-bg-surface`, `border-border`, `rounded-lg`
- Cards can either link to an inline interactive (on same page via modal/expand) or external URL
- Designed to grow — start with 1-2, add more over time
- Max content width: `1120px`

---

## 404 Page (`not-found.tsx`)

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                                                                │
│                         🌵                                      │
│                                                                │
│                    404                                          │  ← text-display, text-accent
│                                                                │
│              Page not found.                                   │  ← text-xl, text-secondary
│                                                                │
│          Looks like you wandered                               │  ← text-base, text-tertiary
│           off the path.                                        │
│                                                                │
│              ┌──────────────┐                                  │
│              │  Go Home →   │                                  │  ← primary button
│              └──────────────┘                                  │
│                                                                │
│                         🌿                                      │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

- Centered on screen, `min-h-svh flex items-center justify-center`
- Fun, on-brand — uses decorative SVGs
- Simple, no complex layout needed
