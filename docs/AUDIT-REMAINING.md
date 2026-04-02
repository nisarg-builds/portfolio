# Audit — Remaining Items

Items that require manual work, asset creation, or external tool verification.

## Assets Needed

- [ ] **OG image** (`public/og-image.png`) — 1200x630px social sharing image for the site. Used by OpenGraph and Twitter cards. Should show your name, title, and branding. Tools: Figma, Canva, or Next.js `ImageResponse` route handler
- [ ] **Apple touch icon** (`public/apple-touch-icon.png`) — 180x180px PNG for iOS home screen bookmarks
- [ ] **PWA icons** — 192x192 and 512x512 PNG icons for the web manifest (update `public/manifest.json` once created)
- [ ] **Favicon SVG** (`public/favicon.svg`) — Optional SVG favicon that supports dark mode

## Verification Tasks

- [ ] **Color contrast audit** — Run WebAIM Contrast Checker or axe DevTools on the live site. Check:
  - `text-secondary` (#a8a49e) on `bg` (#111110) — needs 4.5:1 for WCAG AA
  - `text-tertiary` (#6b6862) on `bg` (#111110) — likely fails AA
  - Accent text (#ce796b) on dark backgrounds
  - Light mode equivalents
- [ ] **Mobile device testing** — Test on real devices at these widths:
  - iPhone SE (375px)
  - iPhone 12 (390px)
  - Pixel 5 (393px)
  - Galaxy S20 (360px)
  - iPad (768px)
  - iPad Pro (1024px)
- [ ] **Screen reader testing** — Test with VoiceOver (macOS/iOS) or NVDA (Windows):
  - Navigate entire home page via headings (Rotor → Headings)
  - Verify skip-to-content link works
  - Verify mobile menu is announced as dialog
  - Verify project cards are navigable
- [ ] **Lighthouse audit** — Run in Chrome DevTools (Performance, Accessibility, SEO, Best Practices). Target: Performance >90, Accessibility >95, SEO >95
- [ ] **Keyboard-only navigation test** — Tab through entire site without mouse. Verify:
  - All interactive elements reachable
  - Focus rings visible on all elements
  - Mobile menu focus trap cycles correctly
  - Escape closes mobile menu

## Enhancement Ideas (Low Priority)

- [ ] **Dynamic OG images per project** — Create `src/app/(public)/projects/[slug]/opengraph-image.tsx` using `ImageResponse` to auto-generate social images with project title + color
- [ ] **Breadcrumbs on project detail** — Add `Home > Projects > Project Name` breadcrumb trail
- [ ] **Contact form** — Replace mailto link with server-side contact form to avoid email harvesting
- [ ] **Loading skeletons** — Add skeleton UI for project cards and portrait image during data fetch
- [ ] **JSON-LD on project pages** — Add `CreativeWork` or `SoftwareApplication` schema to project detail pages
- [ ] **Enhanced JSON-LD on home** — Add `image` URL and `ProfilePage` wrapper to existing Person schema
