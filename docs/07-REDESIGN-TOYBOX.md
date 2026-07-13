# 07 — Redesign: "Toybox" Design Language

> **Status:** Proposal — supersedes the visual language in `02-DESIGN-SYSTEM.md`, and the visual specs in `03`/`04`/`05` where they conflict. Architecture, routing, data flow, and content are unchanged unless stated.
>
> **One line:** Retire the dark gallery. Replace it with a light honeydew canvas covered in bold, flat, geometric toys — saturated color, ink-black type, chunky radii, springy motion.

---

## 0. TL;DR

| | Today ("Warm Gallery") | Proposed ("Toybox") |
|---|---|---|
| Ground | Warm near-black `#111110` + film grain | Pale honeydew `#EEF5E3`, perfectly flat |
| Accent | One hue: terracotta `#ce796b` | Eight saturated hues + ink `#101010` |
| Texture | Grain overlay, glassmorphism, soft glows | None. Flat fills, 2px ink borders, hard offset shadows |
| Decoration | Hand-drawn botanicals (flower, cactus, leaves) | Geometric shape kit (arch, bloom, pinwheel, loops, arrow…) |
| Type | Space Grotesk / Inter / JetBrains Mono, restrained | Same three faces, deployed much louder (giant uppercase display) |
| Theme | Dark default + undocumented light mode + toggle | **Single light theme.** Toggle removed. Ink band for the finale |
| Motion | Blur-ins, glows, parallax, magnetic pull | Springy pops, spins, tilts, hard-shadow lifts, shape wipes |
| Mood | Dark gallery, analog warmth | Toy shop, sticker sheet, print poster |

What survives untouched: routing/IA, Firestore + admin CMS data flow, FitGlass (own design system), content copy, the treemap layout engine, `easings.ts` infrastructure, accessibility guarantees, mobile-first discipline.

---

## 1. Why This Refactor

The current site says "quiet, moody, handcrafted." The reference direction says **"confident, playful, graphic."** It's the same person — engineer × artist — but expressed through *construction* instead of *atmosphere*: shapes you could cut out of paper, colors straight from the tube, type set like a poster.

This is a stronger fit for Nisarg's brand for three reasons:

1. **Differentiation.** Dark portfolio + accent color + grain is the prevailing developer-portfolio default in 2026. A honeydew canvas with geometric toys is instantly recognizable and screenshot-friendly.
2. **The artist half gets a bigger voice.** Studio Arts currently shows up as decoration (botanical SVGs at 15% opacity). In Toybox, composition, color theory, and shape language *are* the interface.
3. **It photographs light.** OG images, recruiter screenshots, LinkedIn embeds — light, saturated compositions carry much better than dark UIs in feeds and slide decks.

### Design principles

1. **Shapes are the brand.** A small kit of geometric primitives appears everywhere: hero, mascots, bullets, dividers, empty states, favicons. Repetition builds recognition.
2. **Flat is honest.** No gradients, no grain, no blur, no glow. Depth comes from color, overlap, and hard offset shadows — never softness.
3. **Ink anchors everything.** All reading text is near-black. Hues are for shapes and surfaces. One dark ink band at the end of the page gives the finale weight.
4. **Motion = toys.** Things pop, spin, tilt, and scoot with spring overshoot. Nothing fades languidly. Physical, not ethereal.
5. **Loud but legible.** Every text/surface pairing is measured (see §8). Whitespace stays generous — density is for the shapes, not the words.
6. **One canvas, many stickers.** The page is paper; components are stickers placed on it. Cards, chips, and badges all read as die-cut pieces (2px ink border, big radius).

---

## 2. Audit of the Current Implementation (what changes, what stays)

From a full sweep of `src/` (branch point: `main` @ `266cfe1`):

### The current identity, in eight signatures

| # | Signature | Verdict |
|---|---|---|
| 1 | Grain overlay (fractal noise, opacity 0.035, z-9999) | **Remove** — flat is the new texture |
| 2 | Custom cursor (terracotta dot, `mix-blend-difference`, trail) | **Keep & restyle** — signature interaction worth keeping; blend mode goes |
| 3 | Hand-drawn wavy divider w/ draw-on animation | **Replace** — `ZigZag` divider, keeps the `pathLength` draw-on |
| 4 | Floating botanicals (flower/leaves/cactus SVGs) | **Replace** — shape kit floats instead; botanicals retired |
| 5 | Treemap/bento projects grid (flat color cells + stubs) | **Keep the engine, re-skin the cells** — it's already 80% Toybox in spirit |
| 6 | Procedural line-art card backgrounds (8 generators) | **Replace** — one bold mascot shape per card instead of faint texture |
| 7 | Per-char heading animations (blur-in, rotateX flip) | **Keep** — retune to pop/spring; hover flashes toy hues |
| 8 | Terracotta glows, gradient hairlines, glass pills | **Remove** — replaced by ink borders and hard shadows |

### Implementation facts that shape this plan

- **Light mode already exists** (undocumented `html.light` token block + 3-way `ThemeToggle` + `ThemeProvider`). Toybox goes **light-only**, so the toggle, the provider, the dual palettes in `grid-layout.ts`, and the `resolvedTheme` branch in `ProjectsSection` are all deleted. One palette, no branching.
- **Projects & portrait data come from Firestore** (admin CMS at `(admin)`, seed script in `scripts/seed-firestore.ts`). The `Project` interface is untouched; per-project hue/mascot is **derived from `order`** (no schema change, no admin-form change).
- **Admin CMS shares the global tokens** (`bg-bg-surface`, `text-accent`, `border-border`…). We keep the semantic token *names* alive as aliases (§4) so admin inherits Toybox automatically; it gets a QA pass, not a redesign.
- **FitGlass is isolated** (own layout, own `fitglass.css`, DM Sans) — completely out of scope. GSAP stays a dependency because FitGlass uses it; the *portfolio* drops its single GSAP usage (About portrait parallax → Framer Motion `useScroll`).
- **`/experience` exists** (Vendasta, Developer I) and isn't in the original docs — it gets a Toybox spec in §7.
- **Blog is a "coming soon" stub**, `/blog/[slug]` unbuilt. Restyle the stub now; the future post template is spec'd in §7.
- **Known bugs to fix while we're in there:** `PageTransition` isn't wrapped in `AnimatePresence` (exit animations never run); `/og-image.png` and `/apple-touch-icon.png` are referenced in metadata but don't exist; `<meta name="theme-color">` is hardcoded `#111110`.
- **Next.js 16.2.1 / React 19 / Tailwind v4** — per `AGENTS.md`, implementers must read `node_modules/next/dist/docs/` before writing route-level code.

---

## 3. Color System

### 3.1 Palette

Derived from the reference art direction (geometric pop on a pale green ground).

| Token | Hex | Name | Role |
|---|---|---|---|
| `--color-canvas` | `#EEF5E3` | Canvas | Page ground (honeydew) |
| `--color-canvas-deep` | `#E2ECD2` | Canvas Deep | Wells, stub cells, code blocks |
| `--color-paper` | `#FBFDF7` | Paper | Raised cards, nav surface |
| `--color-ink` | `#101010` | Ink | All text, borders, icons, the contact band |
| `--color-ink-soft` | `#3D3D38` | Ink Soft | Secondary text |
| `--color-ink-faint` | `#6E6E64` | Ink Faint | Metadata, timestamps (large/label use only) |
| `--color-blurple` | `#4B48E8` | Blurple | Links, primary hue, featured project |
| `--color-grass` | `#2FBE5B` | Grass | Shapes, success moments |
| `--color-lime` | `#DDF163` | Lime | Highlights, hover fills, selection |
| `--color-lilac` | `#C8BCF4` | Lilac | Soft surfaces, portrait frame |
| `--color-grape` | `#8655EC` | Grape | Shapes, pinwheel |
| `--color-punch` | `#F421BE` | Punch | Loud moments, error accents |
| `--color-tangerine` | `#FF7A1F` | Tangerine | Warm pops, stars |
| `--color-sky` | `#29B5EF` | Sky | Marquee band, chips |

Retired: `#111110` and the whole dark surface ramp, terracotta `#ce796b` + hover/secondary/muted variants, the undocumented light-mode ramp (`#faf9f7`/`#b85a4c`…), both treemap palettes in `grid-layout.ts`, all `rgba` glows.

### 3.2 Semantic aliases (migration bridge)

Keep the old semantic names as aliases so ~everything (including admin) renders sensibly the moment tokens land, before components are individually restyled:

```css
--color-bg: var(--color-canvas);
--color-bg-surface: var(--color-paper);
--color-bg-elevated: var(--color-canvas-deep);
--color-text-primary: var(--color-ink);
--color-text-secondary: var(--color-ink-soft);
--color-text-tertiary: var(--color-ink-faint);
--color-accent: var(--color-blurple);
--color-accent-hover: var(--color-grape);
--color-accent-secondary: var(--color-punch);
--color-border: var(--color-ink);
--color-border-hover: var(--color-ink);
```

> After Phase 4 (all public components restyled to the new names), these aliases remain permanently as the admin CMS's contract — admin never needs its own restyle pass.

### 3.3 Hue assignment

Per-project (treemap cells, detail-page hero band, mascots) — derived from `project.order % 4`:

| Order | Surface | Text on it | Mascot shape | Mascot hue |
|---|---|---|---|---|
| 0 — PCubed (featured) | Blurple | Paper | Loops | Lime + Sky |
| 1 — Code Community | Lime | Ink | Bloom | Grape |
| 2 — Volunteer Connect | Sky | Ink | Arch | Ink |
| 3 — Pathfinding Visualizer | Tangerine | Ink | ArrowBolt | Ink |
| stubs | Canvas Deep | — | any, small | any hue |

Sections: Hero = full palette in the cluster · About = lilac + grass · Projects = per-project hues · Contact/Footer = ink band with lime CTA · Experience = paper card, hue-coded stats · Playground = one hue per experiment tile · Blog = paper rows, blurple links.

---

## 4. Tokens — `globals.css` Replacement

Complete `@theme` replacement (Tailwind v4, CSS-first — no config file):

```css
@import 'tailwindcss';

@theme {
  /* Ground */
  --color-canvas: #EEF5E3;
  --color-canvas-deep: #E2ECD2;
  --color-paper: #FBFDF7;
  --color-ink: #101010;
  --color-ink-soft: #3D3D38;
  --color-ink-faint: #6E6E64;

  /* Toys */
  --color-blurple: #4B48E8;
  --color-grass: #2FBE5B;
  --color-lime: #DDF163;
  --color-lilac: #C8BCF4;
  --color-grape: #8655EC;
  --color-punch: #F421BE;
  --color-tangerine: #FF7A1F;
  --color-sky: #29B5EF;

  /* Semantic bridge (admin compatibility — see §3.2) */
  --color-bg: var(--color-canvas);
  --color-bg-surface: var(--color-paper);
  --color-bg-elevated: var(--color-canvas-deep);
  --color-text-primary: var(--color-ink);
  --color-text-secondary: var(--color-ink-soft);
  --color-text-tertiary: var(--color-ink-faint);
  --color-accent: var(--color-blurple);
  --color-accent-hover: var(--color-grape);
  --color-accent-secondary: var(--color-punch);
  --color-border: var(--color-ink);
  --color-border-hover: var(--color-ink);

  /* Type — scale unchanged except display grows and 4xl is added */
  --text-xs: clamp(0.75rem, 0.7rem + 0.15vw, 0.8125rem);
  --text-sm: clamp(0.8125rem, 0.78rem + 0.2vw, 0.9375rem);
  --text-base: clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem);
  --text-lg: clamp(1.0625rem, 1rem + 0.25vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.4vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 0.8vw, 2.25rem);
  --text-3xl: clamp(2rem, 1.5rem + 1.2vw, 3rem);
  --text-4xl: clamp(2.5rem, 1.75rem + 2.5vw, 4rem);
  --text-display: clamp(3rem, 1.75rem + 6.5vw, 7.5rem);

  --font-display: 'Space Grotesk', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;

  /* Radius — everything chunkier */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  /* Shadows — hard offsets only, used on hover/active states */
  --shadow-lift: 4px 4px 0 0 var(--color-ink);
  --shadow-lift-lg: 6px 6px 0 0 var(--color-ink);
  --shadow-lift-blurple: 4px 4px 0 0 var(--color-blurple);
  --shadow-lift-punch: 4px 4px 0 0 var(--color-punch);
}
```

Base style changes:

```css
body {
  font-family: var(--font-body);
  font-weight: 400;              /* was 300 — too thin on a light ground */
  color: var(--color-ink-soft);
  background-color: var(--color-canvas);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;              /* 700 becomes the only display weight */
  color: var(--color-ink);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

::selection { background: var(--color-lime); color: var(--color-ink); }

*:focus-visible {
  outline: 3px solid var(--color-ink);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
/* On ink surfaces, invert the ring: */
.on-ink :focus-visible { outline-color: var(--color-lime); }
```

**Delete from `globals.css`:** the `html.light` override block, `.glass` / `.glass-subtle`, `.text-gradient-accent`, `.card-shine` + `shimmer`, `.section-fade-top/bottom`, `gradient-shift`, `float-gentle`, glow shadow tokens, dark scrollbar colors (scrollbar becomes ink-faint thumb on canvas track).
**Keep:** `marquee` keyframes, `ambient-pulse` (used by status dots), reduced-motion block, `.nav-link::after` (recolored ink), custom-cursor body class, skip-link styles.

Font files: `Inter-Light.woff2` can be dropped from `layout.tsx` (weight 300 unused after this). Everything else already ships in `public/fonts/`.

### Typography deployment rules

| Context | Spec |
|---|---|
| Hero name | `--text-display`, 700, uppercase, `-0.03em`, line-height 0.95 — fills the viewport width |
| Section headings | `--text-4xl`, 700, sentence case |
| Eyebrows / labels | Mono, `--text-xs`, 600, uppercase, `0.14em` tracking, inside a bordered pill ("sticker eyebrow") |
| Body | Inter 400, `--text-base`/`--text-lg`, max-width ~65ch, always ink-soft or ink |
| Numbers / meta | Mono with `font-variant-numeric: tabular-nums` (clock, stats, indices `001—004`) |

Optional stretch (decide during Phase 4, default **no**): an extra-black display face (e.g. Archivo Black) for the hero name only. Space Grotesk 700 at the new scale is expected to be enough.

---

## 5. Shape System — the New Decoration Layer

The single biggest addition: `src/components/shapes/` — a kit of ~10 geometric primitives replacing botanical SVGs, procedural card textures, glyph dividers (`✦`, `✽`), and emoji (🌵🌿🎨🔍).

### 5.1 The kit

| Shape | Looks like | Used for |
|---|---|---|
| `Arch` | Blurple doorway "n" | Hero anchor, portrait frame, Volunteer Connect mascot |
| `Bloom` | 4-petal flower, star cutout | About, Code Community mascot, empty states |
| `Pinwheel` | 8-blade swirl | Playground mascot, 404, loading, favicon |
| `BoltTile` | Rounded square + corner dots | Stat blocks, fun-fact stickers |
| `Loops` | Concentric rounded rects | PCubed mascot, focus moments |
| `ArrowBolt` | Chunky arrow | CTAs, links, scroll cue, back-to-top, pagers |
| `Star4` | 4-point sparkle | Marquee separator, active-nav dot, list bullets |
| `Ring` | Fat donut | Orbit accents, social hovers |
| `HalfPipe` | Semicircle | Section caps, card corners |
| `ZigZag` | Ric-rac ribbon | Section divider (replaces `WavyDivider`) |

### 5.2 Component API

```tsx
// src/components/shapes/index.tsx  (one file per shape, kebab-case)
interface ShapeProps {
  className?: string      // size via w-*/h-*, color via text-* (fill = currentColor)
  spin?: boolean          // slow idle rotation (Pinwheel, Star4) — off under reduced motion
  'aria-hidden'?: boolean // default true; all shapes are decorative
}
```

Rules: `fill="currentColor"` throughout so hues come from Tailwind classes; every instance `aria-hidden="true"`; sizes in the class, never props; **no gradients, no strokes except `Loops`/`Ring`/`ZigZag`**.

### 5.3 Reference geometry (verified rendering)

These exact paths were render-tested against the reference direction:

```tsx
// Pinwheel — one blade rotated 8×45° around (50,50)
const BLADE = 'M50 50 C 52 30, 60 14, 78 8 C 76 28, 66 44, 50 50 Z'
<svg viewBox="0 0 100 100">{[...Array(8)].map((_, i) => (
  <path key={i} d={BLADE} transform={`rotate(${i * 45} 50 50)`} fill="currentColor" />
))}</svg>

// Bloom — 4 petals with a true star cutout (mask, not a painted-over star)
<svg viewBox="0 0 100 100">
  <defs><mask id={maskId}>
    <rect width="100" height="100" fill="white" />
    <path d="M50 34 L55 45 L66 50 L55 55 L50 66 L45 55 L34 50 L45 45 Z" fill="black" />
  </mask></defs>
  <g fill="currentColor" mask={`url(#${maskId})`}>
    <circle cx="50" cy="26" r="24" /><circle cx="74" cy="50" r="24" />
    <circle cx="50" cy="74" r="24" /><circle cx="26" cy="50" r="24" />
  </g>
</svg>
// maskId must be unique per instance (React useId) — repeated <mask id> breaks SVG.

// Arch
<path d="M14 96 V54 C14 30 30 14 50 14 C70 14 86 30 86 54 V96 H62 V56 C62 48 57 42 50 42 C43 42 38 48 38 56 V96 Z" />

// ArrowBolt
<path d="M4 38 H56 V18 L96 50 L56 82 V62 H4 Z" />

// Star4
<path d="M50 4 C54 28 62 40 96 50 C62 60 54 72 50 96 C46 72 38 60 4 50 C38 40 46 28 50 4 Z" />

// Loops (two nested rounded-rect strokes)
<rect x="8" y="8" width="84" height="84" rx="26" fill="none" stroke="currentColor" strokeWidth="11" />
<rect x="30" y="30" width="40" height="40" rx="13" fill="none" stroke="var(--loops-inner, currentColor)" strokeWidth="11" />

// BoltTile (tile + dots take two hues)
<rect x="4" y="4" width="92" height="92" rx="20" fill="currentColor" />
<circle cx="20" cy="20" r="7" /><circle cx="80" cy="20" r="7" />
<circle cx="20" cy="80" r="7" /><circle cx="80" cy="80" r="7" />   // fill: dot hue

// HalfPipe
<path d="M6 72 A 44 44 0 0 1 94 72 Z" />

// Ring
<circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="16" />

// ZigZag (divider, viewBox 0 0 96 28, preserveAspectRatio none for full-width)
<path d="M0 24 L16 4 L32 24 L48 4 L64 24 L80 4 L96 24"
      fill="none" stroke="currentColor" strokeWidth="6"
      strokeLinecap="round" strokeLinejoin="round" />
```

### 5.4 `ShapeField`

Replaces the botanical `FloatingElement` composition in the hero. Same drift mechanics (`FloatingElement` is kept as the engine), new children:

```tsx
<ShapeField>            // absolutely-positioned cluster, aria-hidden, desktop 4–5 / mobile 2
  <Arch  className="w-40 text-blurple" />
  <Bloom className="w-28 text-lilac" />
  <Pinwheel spin className="w-24 text-grape" />   // sits on an ink rounded tile
  <Loops className="w-24 text-punch" />
  <Star4 className="w-10 text-grass" />
</ShapeField>
```

Composition guide (matches the reference image): one big anchor (Arch) top-left of the cluster, Bloom overlapping its top-right, Pinwheel-on-ink-tile bottom-right, Loops bottom-left, one small Star4 floating free. Shapes may overlap the hero text block by up to 10% on desktop; on mobile they live above/behind the name at reduced count.

---

## 6. Component Refactor Map

Verdicts: **Keep** (logic + visuals minor tune) · **Restyle** (logic kept, visuals rebuilt) · **Rebuild** (rewrite) · **Remove** · **New**.

### Layout shell

| Component | Verdict | Toybox spec |
|---|---|---|
| `GrainOverlay` | **Remove** | Delete component + usage in `(public)/layout.tsx` |
| `CustomCursor` | **Restyle** | Drop `mix-blend-difference` + trail-opacity tricks. Default: 10px ink dot. Interactive: 44px lime disc, 2px ink ring, dot count shrinks to 4px. Text: 2×24px ink I-beam. **Add the click-squeeze state** (scale 0.8, spring 400/17) the docs always wanted. Springs unchanged (500/28/0.5). Still desktop-only + reduced-motion-off |
| `Navigation` | **Restyle** | Paper bar, no blur/glass: transparent over hero → `bg-paper border-b-2 border-ink` after 50px scroll. Wordmark "Nisarg" 700 + tiny `Star4` in tangerine. Active link indicator: the underline `layoutId` dot becomes a `Star4` in blurple (same spring 350/30). Contact pill → ink pill (`bg-ink text-canvas`), hover lift + `--shadow-lift-blurple`. **`ThemeToggle` removed.** Mobile overlay: solid canvas (no gradient/blur), links `--text-3xl` 700 stagger-in, a few small shapes scattered `aria-hidden`, socials as sticker circles (§ SocialIcon). Hamburger/X, focus trap, scroll lock unchanged |
| `Footer` | **Rebuild** | Merges visually with Contact into one full-bleed **ink band** (§7 Home). Footer row inside the band: mono `© 2026 · Designed & built by Nisarg Chaudhary`, socials, `BackToTop`. Canvas text on ink |
| `BackToTopButton` | **Restyle** | Lime circle sticker (2px ink border), `ArrowBolt` rotated −90°, hover lift + wiggle. Lives in the ink band, so ring color = lime |
| `PageTransition` | **Rebuild** | **Fix:** wrap in `AnimatePresence mode="wait"` so exits actually run. Target: "shape wipe" — a `--radius-2xl` blurple panel sweeps up over the old page (0.35s, easeIn), reveals the new (0.45s, easeOut), a lone `Star4` riding the panel edge. Reduced motion: instant cut. (Ship the AnimatePresence fix + simple fade first; wipe is a Phase 6 polish item) |
| `ScrollProgress` | **Keep** | `h-[3px] bg-blurple`, unchanged mechanics |
| `ThemeProvider` / `ThemeToggle` | **Remove** | Single light theme. Delete provider, toggle, pre-hydration script, `html.light` CSS block, `resolvedTheme` reads. Verify admin/FitGlass don't import the provider before deleting (FitGlass has its own theming; admin renders off semantic tokens) |

### UI primitives

| Component | Verdict | Toybox spec |
|---|---|---|
| `Button` | **Restyle** | Pill (`--radius-full`), display font 700, `border-2 border-ink`. Primary: `bg-ink text-canvas`, hover translate(−2,−2) + `--shadow-lift-blurple`. Outline: transparent → hover `bg-lime` + `--shadow-lift`. Ghost: borderless ink text + `ArrowBolt` icon that scoots +4px on hover. Active/press: translate(0,0), shadow collapses to 1px — the button physically "clicks". Sizes unchanged (min-h 32/40/48) |
| `MagneticButton` | **Keep** | Magnet physics fit Toybox perfectly. Visuals come from `Button` classes; no code change beyond class swaps |
| `Tag` → `StickerChip` | **Restyle** (rename) | Mono 600, `border-[1.5px] border-ink rounded-full px-3 py-1`. Surface rotates lilac/lime/sky/paper by index. Hover: ±3° wiggle (spring 400/17). On dark cells: transparent bg + `currentColor` border (today's `${color.border}20` chips) |
| `WavyDivider` → `ZigZagDivider` | **Rebuild** | ZigZag geometry (§5.3), stroke ink (hue via prop), same `pathLength 0→1` draw-on (1.2s, easeOut, `whileInView once`). Delete the old 287×15 squiggle |
| `DynamicHeading` | **Keep** | Entrance: replace `rotateX −90` flip with pop (`scale 0.4→1, y 12→0`, spring 400/17, stagger 30ms). Hover: per-char scale 1.15 + char cycles through blurple/grass/punch/tangerine by index instead of always-terracotta |
| `SectionHeading` | **Keep** | Adopts sticker eyebrow (mono pill + `Star4`) + `--text-4xl` heading + optional `ZigZagDivider`. Sections should actually *use* it now instead of hand-rolling |
| `SkillsMarquee` → `MarqueeBand` | **Restyle** (promote) | Full-bleed strip: `bg-sky`, `border-y-2 border-ink`, ink display-font items separated by `Star4` glyphs, 26s linear loop, hover-pause, edge masks removed (hard edges are fine now). The About section's private inline marquee is deleted in favor of this component. `sr-only` list stays |
| `SocialIcon` | **Restyle** | Sticker circles: 48px, `border-2 border-ink`, per-platform surface (GitHub lilac · LinkedIn sky · Instagram punch · Email lime), ink stroked icons. Hover: pop scale 1.1 + rotate ±6° (spring 400/17). Consolidate the *three* inline icon sets (Navigation, Footer, Contact) onto this one component |
| `ThemeToggle` | **Remove** | — |

### Sections & cards

| Component | Verdict | Toybox spec |
|---|---|---|
| `HeroSection` | **Rebuild** | See §7 |
| `AboutSection` | **Restyle** | See §7. GSAP parallax → FM `useScroll` |
| `ProjectsSection` | **Restyle** | Keeps treemap engine + responsive layouts; drops theme branch; new cell skin (below) |
| `TreemapProjectCard` | **Restyle** | Cell: solid hue surface (§3.3), `border-2 border-ink`, `--radius-xl`, text ink (paper on blurple). One **mascot shape** per cell, large (~40% cell height), cropped into a corner, replacing all 8 procedural `CardBackground` generators. Hover: `translate(−3,−3) rotate(−0.6deg)` + `--shadow-lift-lg` (replaces scale 1.06 + glow); mascot rotates +18° (spring). Slide-up overlay stays (solid surface tint, no alpha games); touch/reduced-motion static fallback stays. Eyebrow `00N · ROLE` mono; arrow `↗` → small `ArrowBolt` that scoots |
| `TreemapStub` | **Restyle** | `bg-canvas-deep`, no border, one small shape sticker at 100% opacity (one random stub gets `spin`) |
| `ContactSection` | **Rebuild** | See §7 |
| `FloatingElement` | **Keep** | Drift engine unchanged; consumed by `ShapeField` |
| `LiveClock`, `StatusBadge` | **Keep** | Clock stays mono/tabular. Status badge → sticker chip w/ grass dot (`ambient-pulse` kept) |

### New components

| Component | Purpose |
|---|---|
| `shapes/*` (10 files) | §5 kit |
| `ShapeField` | Hero/404 shape compositions with drift |
| `MarqueeBand` | Full-bleed bordered marquee strip (promoted `SkillsMarquee`) |
| `IndexRow` | Blog/list rows: `001` mono index, title 700, date, hover: lime fill + `ArrowBolt` slides in |
| `StatSticker` | `BoltTile`-framed stat (number + label) for Experience |
| `WipeTransition` | Route shape-wipe (Phase 6) |

---

## 7. Page-by-Page Specs

IA, routes, and anchor behavior are unchanged. **All copy stays as-is unless marked.**

### Home `/`

**Hero** (rebuild)
- Kill: dot-grid pattern, radial glow, botanicals, gradient hairline.
- Layout: mobile = single column (cluster above name, 2 shapes); desktop = name block left (~60%), `ShapeField` cluster right (§5.4).
- Order: sticker eyebrow row (`StatusBadge` chip + `LiveClock` right-aligned) → name (`--text-display`, uppercase, two lines, last syllable in blurple) → tagline `Developer. Designer. Artist.` (periods become tiny inline `Star4`s in grass/punch/tangerine) → subtitle (ink-soft) → CTAs (`View Projects` primary ink pill w/ `ArrowBolt`; `Get in Touch` outline).
- Entrance: eyebrow pops in (0.15s delay), name per-word pop (spring 400/17, 0.2s/word — replaces blur-in), tagline/sub/CTAs fade-up 0.5–0.8s, cluster shapes pop in staggered 0.6–1.1s w/ overshoot.
- Scroll cue: bouncing `ArrowBolt` pointing down (y 0→6, 1.5s loop), fades after 100px — mechanics unchanged.

**About**
- Heading via `SectionHeading` ("About Me" + ZigZag draw-on in grass).
- Bio: quote rail becomes `border-l-[3px] border-ink`; text ink-soft; `data-cursor="text"` kept.
- Portrait: lilac tile (`--radius-2xl`, `border-2 border-ink`) with the photo masked inside an **Arch**; `Star4` sticker overlapping the top-right corner. Parallax: FM `useScroll` + `useTransform` (y −30 over section, desktop only) — GSAP deleted.
- Location pill → BoltTile-style sticker chip (grass tile, "Saskatchewan, Canada", no 📍 emoji — a small `Star4` instead).
- Resume button: outline w/ lime hover fill, opens PDF (unchanged behavior).
- Skills: full-bleed `MarqueeBand` (sky) directly below the section content — the 22 items stay.

**Projects**
- `SectionHeading` "Projects" + eyebrow "SELECTED WORK".
- Treemap grid unchanged structurally (6×4 desktop / 3-col tablet / stack mobile); gaps widen 4px → 10px so ink borders read as separate stickers.
- Cell + stub skin per §6.
- Below grid: ghost button "More on GitHub →" (`ArrowBolt`).

**Contact + Footer** (rebuild, one unit)
- Full-bleed **ink band**, `--radius-2xl` top corners, canvas text; shapes spill over both top corners (Pinwheel spinning, `Star4`) like stickers on a case.
- Eyebrow "GET IN TOUCH" (lime) → heading `SAY HELLO` (`--text-4xl+`, uppercase, canvas) → one-liner (canvas at 75%) → CTAs: `Say Hello` (lime pill, ink text — the loudest button on the site) + `Resume` (canvas-outline pill).
- Socials: 4 sticker circles (§6) on ink.
- Footer row inside the band bottom: mono © line · socials removed here (deduped — they're 40px above) · `BackToTop` lime sticker.
- Location line stays (mono, canvas 60%).

### Experience `/experience`
- Keep structure & content (Vendasta / Developer I / May 2025 — Present).
- Card: paper, `border-2 border-ink`, `--radius-2xl`; delete `.card-shine`, concentric-circle/crosshair SVG at 0.06 → one `Loops` in sky at full strength behind the header, cropped.
- "CURRENT ROLE" badge: sticker chip, grass dot pulse kept.
- 4 stats → `StatSticker` row (BoltTiles in lilac/lime/sky/tangerine, ink numerals, mono labels).
- Key Contributions timeline: dots → `Star4`s in blurple/grass/punch/tangerine; connectors: solid 2px ink (no gradients).
- Tech chips → `StickerChip` with the same 5-category grouping mapped to toy hues (teal→sky, green→grass, terracotta→tangerine, blue→blurple, gold→lime).
- Closing blockquote: `✽` divider → small `ZigZagDivider`.

### Project detail `/projects/[slug]`
- Top: full-width **hue band** in the project's assigned hue (`--radius-2xl`, ink border) containing back-link (`ArrowBolt` flipped), `00N` index, title (`--text-4xl`), role sticker chip, mascot shape large on the right edge.
- Hero image below the band: `--radius-xl`, `border-2 border-ink` (replaces `rounded-xl border-border`).
- Body grid unchanged (description + sidebar); sidebar chips → `StickerChip`; "View on GitHub" → primary button.
- Screenshots: ink-bordered tiles, alternating ±0.5° resting rotation ("taped to the page").
- Prev/next pager: two big paper tiles with giant `ArrowBolt`s, hover lift; shows neighbor's title + hue dot.

### Blog `/blog`
- Now: `DynamicHeading` "Blog" + sticker eyebrow "WRITING"; coming-soon state becomes a `Bloom` (lilac, slow spin disabled) + mono `posts are sprouting — check back soon`. Static wavy SVG deleted.
- Future posts (spec now, build when content exists): `IndexRow` list (`001` mono index · title 700 · date · tag chips), hover lime fill + `ArrowBolt` slide-in. `/blog/[slug]`: paper reading column (~65ch), `@tailwindcss/typography` prose restyled w/ ink headings + blurple links, Shiki theme on `canvas-deep`, ZigZag between post body and pager.

### Playground `/playground`
- Grid of **toy tiles**: each experiment a hue tile (`border-2 border-ink`, `--radius-xl`) — Fit Glass on paper w/ its own logo (it has one), Generative Art on grape w/ `Pinwheel` (replaces 🎨), Pathfinding on tangerine w/ `ArrowBolt` (replaces 🔍).
- Hover: lift + tilt + mascot spin. "Coming soon" tiles: canvas-deep, dashed 2px ink border, mono label.

### 404 `not-found.tsx` / `error.tsx`
- 404: giant `Pinwheel` (grape, `spin`), `404` in `--text-display`, "You've wandered off the map." — Go Home primary w/ `ArrowBolt`. Emoji (🌵🌿) retired.
- Error: `Loops` in punch, "Something went wrong", digest in mono chip, Try Again / Go Home. ⚡ retired.

### Navigation UX notes (all pages)
- Active-section tracking on `/` (IntersectionObserver) moves the `Star4` indicator between Home/Projects/Contact anchors — today it only tracks routes.
- Skip-link restyle: lime sticker, visible on focus.

---

## 8. Contrast Law (measured, WCAG 2.1)

Computed for the exact hexes in §3.1:

| Pairing | Ratio | Verdict | Use |
|---|---|---|---|
| Ink on Canvas | 17.0:1 | AAA | Default body |
| Ink on Paper | 18.6:1 | AAA | Cards |
| Ink on Lime | 15.3:1 | AAA | Highlights, CTA |
| Ink on Lilac | 10.8:1 | AAA | Portrait tile |
| Ink on Sky | 8.1:1 | AAA | Marquee band |
| Ink on Grass | 7.8:1 | AAA | Stickers |
| Ink on Tangerine | 7.3:1 | AAA | Project cell |
| Ink on Punch | 5.3:1 | AA | Loud moments, keep text large-ish |
| White/Paper on Blurple | 6.2:1 | AA | Featured cell |
| White on Grape | 4.6:1 | AA | Shapes w/ large labels only |
| Canvas on Ink | 17.0:1 | AAA | Contact band |
| Lime on Ink | 15.3:1 | AAA | Band accents |
| Blurple on Canvas | 5.6:1 | AA | **The only colored text on canvas** (links) |
| Grape on Canvas | 4.2:1 | AA-large | Large display words only |
| Grass / Tangerine / Sky / Punch on Canvas | 2.1–3.2:1 | **FAIL** | Never text — shapes & surfaces only |

Hard rules:
1. Reading text is **ink** (or paper/canvas on dark surfaces). No exceptions.
2. Links and interactive text accents on canvas: **blurple only**.
3. Grass, tangerine, sky, punch: shape fills and surface fills only.
4. `ink-faint` (`#6E6E64`, 5.1:1 on canvas) for metadata only, never body copy.
5. Focus ring: 3px ink on light surfaces, lime on ink surfaces.
6. Re-verify with axe/WebAIM after implementation (AUDIT-REMAINING.md item stays open).

---

## 9. Motion Bible v2

Library split unchanged in policy, simplified in practice: **Framer Motion only** for the public portfolio (GSAP usage deleted; dependency remains for FitGlass). CSS keyframes for marquee/pulse. Never both on one element.

### Easing tokens (`src/lib/easings.ts` — extend, don't break)

```ts
export const easings = {
  easeOut: [0.16, 1, 0.3, 1],          // keep — exits/entrances
  easeIn: [0.4, 0, 1, 1],              // keep
  springPop:   { type: 'spring', stiffness: 400, damping: 17 },  // = springBouncy, the Toybox signature
  springPlace: { type: 'spring', stiffness: 300, damping: 24 },  // = spring, layout/indicator moves
  springCursor:{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 },
}
```

### Signature moves

| Move | Spec | Where |
|---|---|---|
| **Pop-in** | `scale 0.4→1, y 12→0, opacity 0→1`, springPop, stagger 30–80ms | Headings, chips, shapes, cards entering |
| **Lift** | `translate(−2..−3px) [rotate −0.6°]` + hard shadow appears, 160–220ms | Buttons, cards, stickers on hover |
| **Click** | translate back to 0, shadow collapses to 1px | All pressables |
| **Spin** | rotate 360° / 14s linear infinite (idle); +18° spring on hover | Pinwheel, mascots |
| **Wiggle** | rotate ±3–6°, springPop | Chips, social stickers |
| **Scoot** | `x: +4..6px` | ArrowBolts inside links/buttons |
| **Draw-on** | `pathLength 0→1`, 1.2s easeOut, once | ZigZag dividers |
| **Marquee** | translateX −50%, 26s linear infinite, hover-pause | MarqueeBand |
| **Wipe** | blurple panel y 100%→0 (0.35s easeIn) → new page + panel exits (0.45s easeOut) | Route transitions (Phase 6) |
| **Parallax** | FM `useScroll`+`useTransform`, y −30 over section, lg+ only | About portrait |

Retired: blur-in entrances, `rotateX` char flips, glow transitions, `scale 1.06` card zoom, gradient shimmer, magnetic pull *stays* (it's a toy).

### Reduced motion (unchanged contract, restated)
Global CSS kill-switch stays; `usePrefersReducedMotion` gates JS: pops → simple fades, spins/wiggles/marquee/parallax/cursor off (marquee renders as a static wrapped row), wipe → instant swap, card hover overlay → static inline block (existing pattern kept).

---

## 10. Assets, SEO, Metadata

| Item | Action |
|---|---|
| `/og-image.png` (referenced, **missing**) | Build `src/app/opengraph-image.tsx` (`ImageResponse`): canvas ground, name in Space Grotesk 700, shape cluster — fixes global OG + makes it on-brand |
| Project OG images | `projects/[slug]/opengraph-image.tsx`: project hue band + title + mascot (replaces raw screenshot OG) |
| `/apple-touch-icon.png` (referenced, **missing**) | 180×180 Pinwheel (grape) on canvas |
| `favicon.ico` / `favicon.png` | Regenerate: Pinwheel on canvas (16/32); add `favicon.svg` |
| `manifest.json` | `theme_color` `#ce796b` → `#EEF5E3`; `background_color` → `#EEF5E3`; new icons 192/512 |
| `<meta name="theme-color">` | `#111110` → `#EEF5E3` |
| `public/images/decorative/*` (flower/cactus/leaves/deer/tree) | Delete after hero rebuild (deer/tree already unreferenced) |
| Portrait `portrait.png` | Review against light canvas; the lilac Arch frame hides edge issues, but flag for a possible re-shoot/re-cut (AUDIT item) |
| JSON-LD, sitemap, robots | Unchanged |
| SEO copy | Unchanged (`SITE_CONFIG` untouched) |

---

## 11. Scope Boundaries

| Surface | In scope? | Notes |
|---|---|---|
| `(public)` portfolio pages + `src/components/{layout,sections,ui,decorative,shapes}` | **Yes** | Everything above |
| `globals.css` tokens | **Yes** | Shared — semantic bridge protects other surfaces |
| `(admin)` CMS | **Tokens only** | Inherits Toybox via aliases; QA pass for legibility (esp. anything assuming dark bg); zero component work planned |
| `(fitglass)` app | **No** | Own layout/CSS/fonts; only its *playground tile* is restyled |
| `api/*`, `middleware.ts`, Firebase libs | **No** | — |
| Firestore schema / seed / admin forms | **No** | Hue+mascot derived from `order` |
| `package.json` | Minimal | No new deps. GSAP import removed from portfolio code only. Optional later cleanup if FitGlass ever drops it |

---

## 12. Migration Plan

Each phase ends with a working site (`npm run build` green + visual check at 375/768/1280).

| Phase | Work | Key files |
|---|---|---|
| **0. Prep** | Read `node_modules/next/dist/docs/` (AGENTS.md warning — Next 16). Screenshot current pages as baseline | — |
| **1. Tokens** | Replace `@theme` (§4), delete light-mode block/glass/shine/gradient utilities, body 300→400, selection/focus/scrollbar recolor. Remove `ThemeProvider`/`ThemeToggle`/pre-hydration script/`resolvedTheme` reads (single palette in `grid-layout.ts` — merge dark/light palettes into the §3.3 assignments). Site is now light + semantically bridged everywhere, ugly-but-legible | `globals.css`, `layout.tsx`, `theme-provider.tsx` (−), `theme-toggle.tsx` (−), `grid-layout.ts`, `projects-section.tsx` |
| **2. Shape kit** | Build `shapes/*` (§5), `ZigZagDivider`, `MarqueeBand`, `StickerChip`, `ShapeField`, `StatSticker`, `IndexRow`. Storybook-less visual check page allowed at `/playground` temporarily | `src/components/shapes/*`, `ui/*` |
| **3. Shell** | Remove `GrainOverlay`; restyle `Navigation` (toggle already gone), `Footer`→ink band shell, `CustomCursor`, `BackToTopButton`, `ScrollProgress`; `PageTransition` AnimatePresence fix + simple fade | `components/layout/*`, `(public)/layout.tsx` |
| **4. Home** | Hero rebuild, About restyle (GSAP→FM), Projects re-skin (cards, stubs, gaps), Contact+Footer ink band | `components/sections/*`, `ui/project-card.tsx` |
| **5. Sub-pages** | Experience, project detail (hue band, pager), blog stub, playground tiles, 404/error | `(public)/**` |
| **6. Polish** | Shape wipe transition, active-section nav tracking, idle spins, entrance orchestration pass, dead-code sweep (unused keyframes, old SVGs, `WavyDivider`, botanicals) | — |
| **7. Launch prep** | OG image routes, favicons/touch icon, manifest + theme-color, docs update (§13), QA checklist below | `app/opengraph-image.tsx`, `public/*` |

### QA checklist (replaces the old dark-theme items)

- [ ] `npm run build` + `npm run lint` + `npm run test` green
- [ ] 375 / 640 / 768 / 1024 / 1280 px — no horizontal scroll, shapes never overlap text illegibly
- [ ] axe/WebAIM pass on §8 pairings; focus visible on canvas *and* ink surfaces
- [ ] `prefers-reduced-motion`: no spins/marquee/parallax/wipe; content fully readable
- [ ] Keyboard: nav, mobile menu trap, Escape, skip-link (lime sticker) all work
- [ ] Custom cursor absent on touch; native cursor never hidden without replacement
- [ ] Admin CMS legibility pass (`/admin` login + dashboard + forms) under new tokens
- [ ] FitGlass unaffected (spot-check `/fitglass`)
- [ ] OG images render (home + one project); favicon/touch icon correct; `theme-color` honeydew
- [ ] Lighthouse: Performance >90, Accessibility >95, SEO >95 (grain removal + FM-only should help LCP/TBT)
- [ ] Project detail pages: hue band correct per `order`; pager works end-to-end

---

## 13. Documentation Updates (Phase 7)

- `CLAUDE.md`: rewrite "Project Overview" vibe paragraph (dark gallery → Toybox), flip "Dark-only" to "Light-only", swap testing checklist for §12's.
- `02-DESIGN-SYSTEM.md`: replace token tables with §3/§4, delete grain/glass sections, add shape system pointer.
- `03/04/05`: annotate superseded sections with a banner pointing here (full rewrite optional later).
- `AUDIT-REMAINING.md`: close the "light mode equivalents" contrast item (§8 does it), keep device/screen-reader items, add portrait-review item.

---

## 14. Decisions & Open Questions

Defaults chosen; flag disagreement before Phase 1 lands:

| # | Decision | Default | Alternative |
|---|---|---|---|
| 1 | Theme model | **Light-only, toggle removed** | Keep toggle w/ an "ink mode" (inverted Toybox) — real work, defer to v2 |
| 2 | Display face | **Space Grotesk 700, bigger** | Add Archivo Black for hero only (new asset, +1 font file) |
| 3 | Project hue/mascot source | **Derived from `order`** | Firestore field + admin picker (schema + form work) |
| 4 | Custom cursor | **Keep, restyled** | Delete entirely (simpler; loses a signature) |
| 5 | GSAP | **Remove from portfolio code, keep dep (FitGlass)** | Keep About parallax on GSAP (violates one-motion-system) |
| 6 | Projects grid | **Keep treemap engine** | Rebuild as uniform poster grid (more predictable, less distinctive) |
| 7 | Contact finale | **Ink band (one dark moment)** | Stay light throughout (weaker ending) |
| 8 | Admin | **Inherit via semantic aliases + QA** | Freeze admin on old tokens via scoped CSS layer (double maintenance) |

---

## Appendix A — Reference Direction

Brand-illustration style geometric pop (per the supplied reference image): pale honeydew ground; kelly-green rounded square with violet corner dots; large blurple arch; chartreuse slab; lavender four-petal bloom with star cutout; violet pinwheel on a black rounded tile; azure slab with a chunky black arrow; concentric magenta/orange rounded loops. Flat fills, no outlines, no gradients, no texture — color and geometry do all the work.

## Appendix B — Sticker Recipe (the core visual unit)

```
Surface: any §3.1 hue or paper
Border:  2px solid ink
Radius:  --radius-xl (cards) / --radius-full (pills)
Rest:    flat, no shadow
Hover:   translate(-2px,-2px) + --shadow-lift (+ optional rotate ±0.6–6°)
Press:   translate(0,0), shadow 1px
Text:    ink (paper on blurple/grape/ink surfaces)
```

Apply it to: buttons, chips, cards, social circles, stat blocks, nav pill, back-to-top, pager tiles. If a new component doesn't know what to look like, it looks like this.
