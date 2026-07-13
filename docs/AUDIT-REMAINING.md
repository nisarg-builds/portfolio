# Audit — Remaining Items

Items that require manual work, asset creation, or external tool verification.
(Updated 2026-07-13 for the Toybox redesign — see `07-REDESIGN-TOYBOX.md`.)

## Assets Needed

- [x] **OG image** (`public/og-image.png`) — 1200x630 Toybox composition (name + shape cluster), generated 2026-07-13
- [x] **Apple touch icon** (`public/apple-touch-icon.png`) — 180x180 grape Pinwheel on canvas
- [x] **PWA icons** — `public/icon-192.png` / `public/icon-512.png`, wired into `manifest.json`
- [x] **Favicon** — `src/app/icon.svg` (Pinwheel) + PNG-based `src/app/favicon.ico`
- [ ] **Portrait review** — current `portrait.png` is a busy sticker-collage image; consider a cleaner cut-out for the lilac arch frame (docs/07 §10)

## Verification Tasks

- [ ] **Color contrast audit** — Measured ratios for every Toybox pairing are in `07-REDESIGN-TOYBOX.md` §8 (all reading text ≥ AA). Re-verify on the live site with axe DevTools; pay attention to:
  - `ink-faint` (#6e6e64) — metadata labels only, never body copy
  - White text is only allowed on blurple, grape, and ink surfaces
  - Grass/tangerine/sky/punch are never text colors on canvas
- [ ] **Mobile device testing** — Test on real devices at these widths:
  - iPhone SE (375px)
  - iPhone 12 (390px)
  - Pixel 5 (393px)
  - Galaxy S20 (360px)
  - iPad (768px)
  - iPad Pro (1024px)
- [ ] **Screen reader testing** — Test with VoiceOver (macOS/iOS) or NVDA (Windows):
  - Navigate entire home page via headings (Rotor → Headings)
  - Verify skip-to-content link works (lime pill)
  - Verify mobile menu is announced as dialog
  - Verify project cards are navigable
  - Verify the skills marquee is skipped (sr-only list carries content)
- [ ] **Lighthouse audit** — Run in Chrome DevTools (Performance, Accessibility, SEO, Best Practices). Target: Performance >90, Accessibility >95, SEO >95 (grain removal + single motion library should help)
- [ ] **Keyboard-only navigation test** — Tab through entire site without mouse. Verify:
  - All interactive elements reachable
  - Focus rings visible on canvas (ink ring) AND on the ink band (lime ring via `.on-ink`)
  - Mobile menu focus trap cycles correctly
  - Escape closes mobile menu
- [ ] **Admin CMS legibility pass** — admin inherits Toybox via the semantic token bridge (docs/07 §3.2); spot-check login, dashboard, and forms

## Enhancement Ideas (Low Priority)

- [ ] **Dynamic OG images per project** — `projects/[slug]/opengraph-image.tsx` with the project hue band + mascot. Note: satori doesn't read woff2 — add a TTF/woff of Space Grotesk first, or keep generating static PNGs via headless Chromium
- [ ] **Shape-wipe route transition** — blurple panel sweep (docs/07 §9); current transitions are entrance-only by design (App Router exit-animation limitation)
- [ ] **Active-section nav tracking on `/`** — move the Star4 indicator between Home/Projects/Contact as sections scroll into view
- [ ] **Breadcrumbs on project detail** — Add `Home > Projects > Project Name` breadcrumb trail
- [ ] **Contact form** — Replace mailto link with server-side contact form to avoid email harvesting
- [ ] **Loading skeletons** — Add skeleton UI for project cards and portrait image during data fetch
- [ ] **JSON-LD on project pages** — Add `CreativeWork` or `SoftwareApplication` schema to project detail pages
- [ ] **Enhanced JSON-LD on home** — Add `image` URL and `ProfilePage` wrapper to existing Person schema
