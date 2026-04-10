---
title: "refactor: Rebrand NutriTrack to FitGlass"
type: refactor
status: active
date: 2026-04-09
---

# Rebrand NutriTrack to FitGlass

## Overview

Rename all references to "NutriTrack" → "FitGlass" across the entire codebase. This includes display text, CSS token prefixes (`nt-*` → `fg-*`), file/folder paths, API routes, component/hook names, imports, comments, tests, and documentation. No functional changes — purely a branding rename.

## Problem Frame

The user no longer wants the app called "NutriTrack." The new name is "FitGlass." Every occurrence of the old name — user-facing strings, internal identifiers, directory structure, CSS tokens, and API paths — must be updated.

## Requirements Trace

- R1. All user-facing text shows "FitGlass" instead of "NutriTrack"
- R2. CSS custom property prefix changes from `nt-` to `fg-` (e.g., `--color-nt-bg` → `--color-fg-bg`)
- R3. All Tailwind class usage changes from `nt-*` to `fg-*` (e.g., `bg-nt-bg` → `bg-fg-bg`)
- R4. Directory paths rename: `(nutritrack)` → `(fitglass)`, `src/lib/nutritrack` → `src/lib/fitglass`
- R5. API route renames: `/api/nutritrack/analyze` → `/api/fitglass/analyze`
- R6. Component/hook names update: `NutriTrackApp` → `FitGlassApp`, `useNutriStore` → `useFitGlassStore`
- R7. All imports, comments, tests, and docs updated to match
- R8. No functional changes — app behavior identical before and after

## Scope Boundaries

- No design, color, or layout changes
- No new features or refactors beyond the rename
- Documentation files in `docs/` get text updates but are not the primary concern (old plan files can keep historical references)
- `package-lock.json` is not manually edited — only touched if `package.json` name field changes

## Key Technical Decisions

- **Rename directories via git mv**: Use `git mv` for folder renames to preserve git history
- **Rename CSS tokens in-place**: Update the `@theme` block in the CSS file, then find-replace all Tailwind class usage
- **Rename sequentially by layer**: CSS tokens first (foundation), then file/folder structure, then component internals, then external references. This avoids broken imports mid-rename
- **API route path**: Rename the folder from `api/nutritrack/` to `api/fitglass/` — the client-side `ai.ts` service that calls it will update its fetch URL accordingly
- **Old plan files**: Historical plan files in `docs/plans/` that reference "nutritrack" in their *content* will not be updated (they are historical records). Only the currently active codebase matters

## Implementation Units

- [x] **Unit 1: Rename CSS tokens (nt-* → fg-*)**

  **Goal:** Update all CSS custom property definitions and their Tailwind class consumers.

  **Requirements:** R2, R3

  **Dependencies:** None

  **Files:**
  - Modify: `src/lib/nutritrack/styles/nutritrack.css` — rename all `--color-nt-*` to `--color-fg-*`
  - Modify: All ~50 component files under `src/app/(nutritrack)/_components/` — find-replace `nt-` → `fg-` in Tailwind classes (e.g., `bg-nt-bg` → `bg-fg-bg`, `text-nt-text` → `text-fg-text`, `border-nt-border` → `border-fg-border`)

  **Approach:**
  - Start with the CSS file where tokens are defined (16 custom properties)
  - Then bulk find-replace `nt-` → `fg-` across all component TSX files
  - Be careful not to replace non-NutriTrack occurrences of `nt-` (grep confirms all `nt-` in the component files are NutriTrack tokens)

  **Patterns to follow:**
  - Current `nutritrack.css` `@theme` block structure

  **Test expectation:** none — pure styling token rename, visually verified

  **Verification:**
  - `grep -r "nt-" src/app/\(nutritrack\)/ src/lib/nutritrack/` returns zero matches
  - App renders with correct colors (no missing token errors in browser console)

- [x] **Unit 2: Rename file/folder structure**

  **Goal:** Move directories and files to use "fitglass" naming.

  **Requirements:** R4, R5

  **Dependencies:** Unit 1

  **Files:**
  - Rename: `src/app/(nutritrack)/` → `src/app/(fitglass)/`
  - Rename: `src/app/(nutritrack)/nutritrack/` → `src/app/(fitglass)/fitglass/` (the route segment)
  - Rename: `src/lib/nutritrack/` → `src/lib/fitglass/`
  - Rename: `src/app/api/nutritrack/` → `src/app/api/fitglass/`
  - Rename: `src/lib/nutritrack/styles/nutritrack.css` → `src/lib/fitglass/styles/fitglass.css`

  **Approach:**
  - Use `git mv` for each directory rename to preserve history
  - The route group `(nutritrack)` is a Next.js route group (parenthesized) — renaming it does not affect URLs
  - The actual route segment `nutritrack/` inside the group determines the URL path `/nutritrack` — renaming to `fitglass/` changes the URL to `/fitglass`
  - API route folder rename changes endpoint from `/api/nutritrack/analyze` to `/api/fitglass/analyze`

  **Test expectation:** none — structural rename only

  **Verification:**
  - No files remain under old paths
  - `git status` shows renames, not deletes + creates

- [x] **Unit 3: Update all imports and internal references**

  **Goal:** Fix all import paths, component names, hook names, and internal string references.

  **Requirements:** R1, R6, R7

  **Dependencies:** Unit 2

  **Files:**
  - Modify: `src/app/(fitglass)/fitglass/layout.tsx` — update CSS import path, metadata title
  - Modify: `src/app/(fitglass)/fitglass/page.tsx` — update import path, component name
  - Modify: `src/app/(fitglass)/_components/NutriTrackApp.tsx` — rename file to `FitGlassApp.tsx`, rename component
  - Modify: All component files under `src/app/(fitglass)/_components/` — update `@/lib/nutritrack/` → `@/lib/fitglass/` in imports
  - Modify: `src/lib/fitglass/hooks/useNutriStore.ts` — rename to `useFitGlassStore.ts`, rename export
  - Modify: `src/lib/fitglass/services/ai.ts` — update fetch URL to `/api/fitglass/analyze`
  - Modify: `src/lib/fitglass/constants/prompts.ts` — update any "NutriTrack" text in AI prompts
  - Modify: All hook files — update cross-references
  - Modify: All test files under `__tests__/` — update imports

  **Approach:**
  - Rename key files first: `NutriTrackApp.tsx` → `FitGlassApp.tsx`, `useNutriStore.ts` → `useFitGlassStore.ts`
  - Bulk find-replace import paths: `@/lib/nutritrack/` → `@/lib/fitglass/`
  - Bulk find-replace: `useNutriStore` → `useFitGlassStore`, `NutriTrackApp` → `FitGlassApp`, `NutriTrack` → `FitGlass` (in strings/comments)
  - Update the `ActiveView` type export location reference
  - Update AI service fetch URL

  **Patterns to follow:**
  - Existing import alias pattern `@/lib/...`
  - Named export pattern used throughout

  **Test scenarios:**
  - Happy path: All existing tests pass after import path updates
  - Happy path: TypeScript compilation succeeds with zero errors

  **Verification:**
  - `grep -r "nutritrack\|NutriTrack\|useNutriStore\|NutriTrackApp" src/` returns zero matches (excluding historical docs)
  - `npx tsc --noEmit` passes
  - All vitest tests pass

- [x] **Unit 4: Update external references (portfolio site, docs, config)**

  **Goal:** Update all references outside the FitGlass app directory — portfolio pages, navigation, CLAUDE.md, and docs.

  **Requirements:** R1, R7

  **Dependencies:** Unit 3

  **Files:**
  - Modify: `src/components/layout/navigation.tsx` — update `/nutritrack` link to `/fitglass`
  - Modify: `src/components/layout/footer.tsx` — update any NutriTrack references
  - Modify: `src/components/sections/hero-section.tsx` — update references
  - Modify: `src/components/sections/projects-section.tsx` — update project name/link
  - Modify: `src/components/sections/about-section.tsx` — update references
  - Modify: `src/components/sections/contact-section.tsx` — update references
  - Modify: `src/components/ui/project-card.tsx` — update references
  - Modify: `src/app/layout.tsx` — update metadata if it references NutriTrack
  - Modify: `src/app/not-found.tsx` — update references
  - Modify: `src/app/error.tsx` — update references
  - Modify: `src/app/(public)/projects/[slug]/page.tsx` — update references
  - Modify: `src/app/(public)/playground/playground-content.tsx` — update references
  - Modify: `src/app/(admin)/` files — update admin references
  - Modify: `CLAUDE.md` — update all NutriTrack references to FitGlass
  - Modify: `docs/` files — update active documentation (not historical plans)

  **Approach:**
  - Bulk find-replace `NutriTrack` → `FitGlass` and `nutritrack` → `fitglass` across all non-app files
  - Update URL paths `/nutritrack` → `/fitglass` in navigation and links
  - Update CLAUDE.md module documentation section

  **Test expectation:** none — text and link updates only

  **Verification:**
  - `grep -rn "nutritrack\|NutriTrack" src/ CLAUDE.md` returns zero matches (old plan docs excluded)
  - Navigation links point to `/fitglass`
  - Production build succeeds: `npm run build`

## System-Wide Impact

- **URL change:** `/nutritrack` → `/fitglass` — if the site is live and indexed, old URLs will 404. Consider a redirect if needed (deferred — not in scope for this rename)
- **API endpoint change:** `/api/nutritrack/analyze` → `/api/fitglass/analyze` — only consumed by the app's own `ai.ts` service, so no external consumers break
- **Firebase data:** Firestore paths (`users/{uid}/foodLog`, `users/{uid}/profile`) are NOT changing — data layer is unaffected
- **Environment variables:** Firebase env vars are prefixed `NEXT_PUBLIC_FIREBASE_*` — no rename needed

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Missed occurrence of old name | Final grep sweep in Unit 4 verification catches stragglers |
| Broken imports after folder rename | TypeScript compilation check after Unit 3 catches all import errors |
| CSS tokens not picked up after rename | Browser visual check + grep for orphaned `nt-` references |

## Sources & References

- Related code: `src/app/(nutritrack)/`, `src/lib/nutritrack/`, `src/app/api/nutritrack/`
- CSS tokens: `src/lib/nutritrack/styles/nutritrack.css` (16 custom properties)
- 830 total occurrences across 89 files (from initial grep scan)
