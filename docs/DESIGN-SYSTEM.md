# Prairie Ink — Design System

The system the site is actually built on. Supersedes the design sections of
`01-TECH-STACK` through `06-CONTENT-MAP`, which are retained as a record of the
original build but no longer describe the shipped site.

## Principles

1. **Type is the graphic. Structure is the ornament.** The name is the largest
   thing on the page; hairline rules and a numbered caption layer carry the
   composition. No gradients, glows, shimmer, blobs, or drop shadows as decoration.
2. **One accent hue.** A single canola yellow-green. Everything else is soil,
   sage or bone. The earthiness lives in the *neutrals* — which is what keeps a
   one-accent system from reading thin, and what keeps it out of the
   warm-black-plus-coral default that every generated portfolio lands on.
3. **One motion gesture, one curve.** A short rise into place on
   `cubic-bezier(0.16, 1, 0.3, 1)`. Nothing pulses, floats, or shimmers.
4. **Every effect earns its place.** If it does not help someone read, scan, or
   decide, it is not in the build.

## Colour

Tokens live in `src/app/globals.css` under `@theme`, with a full redefinition
in `html.light`. Never hard-code a hex value in a component — every colour
resolves through a custom property so the light theme and the ground inversion
both work for free.

| Token | Dark (default) | Light |
| --- | --- | --- |
| `--color-bg` | `#101208` | `#f3f1e3` |
| `--color-bg-surface` | `#171a0e` | `#eae7d4` |
| `--color-bg-elevated` | `#1f2314` | `#e0dcc6` |
| `--color-text-primary` | `#eceadc` | `#14160c` |
| `--color-text-secondary` | `#adaf98` | `#4a4d38` |
| `--color-text-tertiary` | `#82856e` | `#6b6e55` |
| `--color-accent` | `#d4ce3f` | `#6b6410` |
| `--color-border` | `#262a19` | `#d8d4be` |
| `--color-line` | `rgb(236 234 220 / .12)` | `rgb(20 22 12 / .14)` |

The ground is **olive-black, not neutral black** — that single decision does
more to separate this site from the default than the accent does. The accent is
one hue at two lightnesses: canola on soil (11.5:1), deep olive on bone (5.2:1).

Every text/ground pair above meets WCAG AA (≥4.5:1) for body copy. The tertiary
and accent values were chosen at the contrast boundary deliberately — do not
lighten tertiary on dark or lighten accent on light without re-checking.

### Contribution scale

`--color-heat-1` to `--color-heat-4` shade the GitHub graph in About. Each
step mixes the accent over the ground: 35, 60, 80, and 100% in dark, and 55,
70, 85, and 100% in light, because olive on bone needs a higher floor. An
empty day uses `--color-bg-elevated`. The ramp passed an ordinal check: each
step contrasts more with the ground than the last, and the faintest step
clears 2:1 on the ground. The tokens are defined for the page ground only.

### Ground inversion

`.ground-invert` redefines the whole token set on a subtree, so a section can
flip ink and paper and every child re-skins itself with no component changes.
Used once, on Selected Work: **dark mode hangs the work on a white wall, light
mode hangs it in a dark room.**

### Signal ground

`.ground-signal` goes further: the accent stops being a highlight and becomes
the entire field. Ink on canola reads at 11.3:1, so louder is not less legible.

Reserved for **Contact**, and identical in both themes — the page always ends on
the same shout. It is the one section on the site asking the visitor to act, and
the only one with no imagery to fight a saturated ground. Inside it the accent
role inverts to the *darkest* value, because the field is already the accent.

Three grounds is the whole vocabulary. A fourth would make none of them mean
anything.

## Typography

| Role | Family | Usage |
| --- | --- | --- |
| Display | Space Grotesk 500/700 | Name, section headlines, project titles |
| Body | DM Sans 400/500/600 | Paragraphs and lists |
| Caption | JetBrains Mono 400 | The `.meta` layer — section numbers, labels, dates, status |
| Emphasis | System serif, italic | One phrase per headline, via `.emph` |

`.emph` is the only typographic contrast the system allows — an italic serif
phrase inside a grotesque headline. It carries weight precisely because it is
rationed: **one per headline, never two.** It uses system serifs, so it costs
no bytes.

`.meta` is uppercase JetBrains Mono at 11px with `0.18em` tracking. It is the
site's connective tissue: if a piece of text is a label rather than content, it
belongs in this layer.

Scale is fluid (`--text-*` clamps). `--text-mega` drives `.masthead`, which
adds `line-height: 0.86` and `-0.045em` tracking.

## Layout

- `.gutter` is the single source of horizontal rhythm: 20px / 32px / 48px.
- Page container is `max-w-[1440px]`.
- Content sits on a 12-column grid at `lg`; asymmetric splits (7/5, 5/7, 4/8)
  are preferred over centred columns.
- `.rule` is a 1px top hairline. Section headers, figure captions, footer rows,
  and index rows all hang off one.

## Motion

`src/components/ui/reveal.tsx` is the only entrance animation. Each element
observes independently — no parent variant tree — so composition never breaks
the animation. `index` adds a 60ms stagger step; `immediate` plays on mount for
above-the-fold content.

The masthead uses a pure-CSS clip reveal (`.set-type`), so the name sets itself
with no JavaScript.

Under `prefers-reduced-motion: reduce`, `Reveal` renders its final state
directly, the custom cursor never mounts, page transitions are skipped, and all
CSS animation is disabled. Reduced motion is a complete, still design — not a
degraded one.

## Components

| Component | Responsibility |
| --- | --- |
| `ui/reveal.tsx` | The entrance gesture |
| `ui/section-marker.tsx` | Numbered section header on a rule; `as="h2"` when it is the section's only heading |
| `ui/page-header.tsx` | Sub-page masthead, so every page reads as one publication |
| `ui/project-index.tsx` | The work index and its cursor-following preview |
| `ui/contribution-graph.tsx` | Fig. 02: a year of GitHub activity, rendered on the server |
| `ui/signature-mark.tsx` | Single-stroke sign-off, drawn in code |
| `ui/local-time.tsx` | Client island for the live clock |
| `ui/email-link.tsx` | Address plus copy-to-clipboard |
| `ui/social-icon.tsx` | One definition of each social mark |

## Content

`src/lib/site-data.ts` is the single source of truth for copy — profile, bio,
skills, experience, experiments, planned writing, colophon. Components never
inline prose.

`src/lib/projects.ts` holds `FALLBACK_PROJECTS`. Firestore is the system of
record, but `src/lib/firebase/projects.ts` falls back to the static list when
credentials are missing, the collection is empty, or a read throws — so the
Projects section can never render empty in local dev or a preview deploy.

`src/lib/github.ts` reads the GitHub contribution calendar with `GITHUB_TOKEN`.
If the token is missing or GitHub fails, it returns null and the figure does
not render. There is no static fallback, because a snapshot would misstate
current activity.

## Rules of thumb

- New colour idea? There isn't one. Use soil, bone, sage, or the accent.
- New animation idea? Use `Reveal`, or reconsider.
- Reaching for a shadow? Reach for a hairline instead.
- Writing a label? It goes in `.meta`.
- Adding an image? It gets a `Fig. NN` caption on a rule.
