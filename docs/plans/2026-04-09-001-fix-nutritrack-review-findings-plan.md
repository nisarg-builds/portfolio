---
title: "fix: Resolve NutriTrack UI redesign code review findings"
type: fix
status: active
date: 2026-04-09
---

# Fix: Resolve NutriTrack UI Redesign Code Review Findings

## Overview

The NutriTrack UI redesign introduced a dark theme, responsive two-panel layout, new components (CalorieRing, MacroProgressBars, WeekNavigator, FloatingActionButton), and restructured navigation. A 5-persona code review surfaced 3 P1, 12 P2, and 4 P3 findings across correctness, maintainability, type safety, project standards, and adversarial failure scenarios. This plan addresses all findings in dependency order.

## Problem Frame

The redesign is functionally complete but has:
- A data bug (week stats always show current week regardless of navigation)
- Dual component mounting on desktop wasting renders and risking side-effect conflicts
- Missing `prefers-reduced-motion` support (CLAUDE.md requirement)
- Memory leaks (blob URLs), misleading UI (50% macro bars), and type safety gaps

## Requirements Trace

- R1. Week chart displays correct data for the selected week offset
- R2. Only one component tree renders per viewport (no dual mounting)
- R3. All animations respect `prefers-reduced-motion`
- R4. No memory leaks from blob URLs
- R5. Macro bars show meaningful progress or explicit "no target" state
- R6. Type unions derived from store, not manually duplicated
- R7. Dead code removed (InsightsView, quickFoods state)
- R8. Shared loading flags split per-view to prevent cross-view skeleton flash
- R9. CalorieRing handles target=0 gracefully
- R10. Macro totals computed consistently across views

## Scope Boundaries

- No new features — purely fixing review findings
- No test file creation (project has no test infrastructure set up yet)
- No changes to Firestore data model or AI service
- Profile debounce optimization (P2 advisory) is deferred — it's a performance improvement, not a bug

## Key Technical Decisions

- **useMediaQuery hook for responsive rendering**: Use a client-side `useMediaQuery('(min-width: 1024px)')` hook instead of CSS `lg:hidden`/`hidden lg:block` to conditionally render one component tree. This prevents dual mounting (R2). The hook returns `false` during SSR (mobile-first) and hydrates correctly.
- **MotionConfig for reduced motion**: Wrap the NutriTrack app root in `<MotionConfig reducedMotion="user">` from Framer Motion. This handles the systemic reduced-motion gap (R3) with a single change rather than adding hooks to 11+ components individually. Framer Motion's built-in support respects `prefers-reduced-motion: reduce` at the provider level.
- **Derived macro targets**: `ComputedTargets` already has `fatMinG` and `carbsRemainingG`. Pass these as `fatTarget` and `carbsTarget` to MacroProgressBars (R5).
- **Split loading flags**: Replace single `isLoadingEntries` with `isLoadingToday` and `isLoadingWeek` in the Zustand store (R8).

## Implementation Units

- [ ] **Unit 1: Delete dead code and clean up store**

  **Goal:** Remove InsightsView.tsx and unused `quickFoods` state field (R7).

  **Dependencies:** None

  **Files:**
  - Delete: `src/app/(nutritrack)/_components/insights/InsightsView.tsx`
  - Modify: `src/lib/nutritrack/hooks/useNutriStore.ts` — remove `quickFoods: QuickFood[]` from NutriState interface (line 39), remove initial value (line 87), remove `QuickFood` from import

  **Approach:**
  - Verify InsightsView has zero importers (confirmed: only its own export references it)
  - Remove `quickFoods` field and its `QuickFood` type import from the store
  - Keep `InsightBadge` and `useInsights` — they are still used by WeekView

  **Test expectation:** none — pure dead code removal

  **Verification:**
  - `npm run build` succeeds with no errors
  - No references to `InsightsView` or `quickFoods` remain in codebase

---

- [ ] **Unit 2: Fix week stats offset bug (P1)**

  **Goal:** `computeWeeklyStats` uses the correct week offset so past-week charts show real data (R1).

  **Dependencies:** None

  **Files:**
  - Modify: `src/lib/nutritrack/hooks/useInsights.ts` — add `offset` parameter to `computeWeeklyStats`
  - Modify: `src/app/(nutritrack)/_components/week/WeekView.tsx` — pass `weekOffset` to `computeWeeklyStats`

  **Approach:**
  - Add `offset = 0` parameter to `computeWeeklyStats` signature
  - Pass it through to `getLastNDays(7, offset)` on line 19 of useInsights.ts
  - In WeekView, update the `useMemo` call: `computeWeeklyStats(weekEntries, dailyTarget, tdee, weekOffset)`

  **Patterns to follow:** Same pattern as `loadWeekEntries(offset)` in the store

  **Test scenarios:**
  - Happy path: `computeWeeklyStats({}, 2000, 2200, 0)` generates current-week date keys
  - Happy path: `computeWeeklyStats({}, 2000, 2200, -1)` generates last-week date keys that match `getLastNDays(7, -1)`
  - Edge case: `computeWeeklyStats({}, 2000, 2200, -52)` generates date keys from ~1 year ago without error

  **Verification:**
  - Navigate to "Last Week" in WeekView — chart shows actual data instead of all zeros

---

- [ ] **Unit 3: Fix CalorieRing division by zero (P2)**

  **Goal:** CalorieRing handles target=0 without NaN in SVG (R9).

  **Dependencies:** None

  **Files:**
  - Modify: `src/app/(nutritrack)/_components/today/CalorieRing.tsx`

  **Approach:**
  - Change line 16 from `Math.min(consumed / target, 1.5)` to `target > 0 ? Math.min(consumed / target, 1.5) : 0`

  **Test scenarios:**
  - Edge case: `consumed=0, target=0` → percentage is 0, ring is empty, no NaN
  - Edge case: `consumed=500, target=0` → percentage is 0, displays "0 kcal remaining"
  - Happy path: `consumed=1500, target=2000` → 75% fill, shows "500 kcal remaining"

  **Verification:**
  - No NaN in SVG attributes when target is 0

---

- [ ] **Unit 4: Pass macro targets and fix 50% fallback (P2)**

  **Goal:** MacroProgressBars shows meaningful progress for all three macros (R5).

  **Dependencies:** None

  **Files:**
  - Modify: `src/app/(nutritrack)/_components/today/TodayView.tsx` — pass `carbsTarget` and `fatTarget`
  - Modify: `src/app/(nutritrack)/_components/today/MacroProgressBars.tsx` — change fallback from 0.5 to 0

  **Approach:**
  - `ComputedTargets` has `fatMinG` and `carbsRemainingG`. Pass as: `fatTarget={targets?.fatMinG}`, `carbsTarget={targets?.carbsRemainingG}`
  - Change MacroBar fallback: when `target` is undefined, show `percentage = 0` (empty bar) instead of misleading 0.5
  - The text already handles the no-target case correctly (shows just grams, no "/ Xg")

  **Test scenarios:**
  - Happy path: all three targets provided → bars fill proportionally
  - Edge case: no targets (null) → all bars show 0% width, text shows gram values only

  **Verification:**
  - Carbs and fat bars show proportional fill matching actual intake vs target

---

- [ ] **Unit 5: Split loading flags to prevent cross-view skeleton flash (P2)**

  **Goal:** WeekView loading doesn't flash TodayView skeleton on desktop (R8).

  **Dependencies:** None

  **Files:**
  - Modify: `src/lib/nutritrack/hooks/useNutriStore.ts` — split `isLoadingEntries` into `isLoadingToday` and `isLoadingWeek`
  - Modify: `src/app/(nutritrack)/_components/today/TodayView.tsx` — read `isLoadingToday` instead of `isLoadingEntries`
  - Modify: `src/app/(nutritrack)/_components/week/WeekView.tsx` — read `isLoadingWeek` instead of `isLoadingEntries`

  **Approach:**
  - Replace `isLoadingEntries: boolean` with `isLoadingToday: boolean` and `isLoadingWeek: boolean` in NutriState
  - `loadTodayEntries` sets `isLoadingToday`
  - `loadWeekEntries` sets `isLoadingWeek`
  - Update all consumers (TodayView reads `isLoadingToday`, WeekView reads `isLoadingWeek`)

  **Test scenarios:**
  - Happy path: navigating weeks on desktop doesn't flash TodayView skeleton
  - Happy path: loading today's entries still shows TodayView skeleton correctly

  **Verification:**
  - On desktop, clicking "Previous Week" in WeekView does not cause TodayView to flash skeleton

---

- [ ] **Unit 6: Fix URL.createObjectURL memory leak (P2)**

  **Goal:** Blob URLs are properly revoked on send and component unmount (R4).

  **Dependencies:** None

  **Files:**
  - Modify: `src/app/(nutritrack)/_components/chat/ChatInput.tsx`

  **Approach:**
  - In `handleSend`, revoke the blob URL before clearing state: add `if (imagePreview) URL.revokeObjectURL(imagePreview);` before the `setImagePreview(null)` call
  - Add a cleanup effect for unmount: `useEffect(() => { return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }; }, [imagePreview]);`

  **Test scenarios:**
  - Happy path: sending a message with an image revokes the blob URL
  - Edge case: navigating away while image is selected revokes on unmount

  **Verification:**
  - No blob URL accumulation in browser memory during repeated image sends

---

- [ ] **Unit 7: Extract shared macro totals hook (P2)**

  **Goal:** Macro totals computed once with consistent rounding across TodayView, ChatView, and WeekView (R10).

  **Dependencies:** Unit 5 (store changes)

  **Files:**
  - Create: `src/lib/nutritrack/hooks/useTodayMacros.ts`
  - Modify: `src/app/(nutritrack)/_components/today/TodayView.tsx` — use hook
  - Modify: `src/app/(nutritrack)/_components/chat/ChatView.tsx` — use hook

  **Approach:**
  - Create a lightweight derived hook:
    ```
    useTodayMacros() → { consumed, proteinG, carbsG, fatG }
    ```
  - Reads `todayEntries` from the store, computes and rounds consistently
  - Replace inline reduce calls in TodayView (lines 131-134) and ChatView (lines 33-36)
  - WeekView's per-day totals are different (they compute from weekEntries, not todayEntries) so it stays independent for the per-day chart, but its todayCalories/todayProteinG used for insights can also use this hook

  **Patterns to follow:** Same pattern as existing `useChat` hook

  **Test scenarios:**
  - Happy path: all three views show identical macro values for the same data
  - Edge case: empty todayEntries → all values are 0

  **Verification:**
  - ChatView summary bar and TodayView macro bars show identical numbers

---

- [ ] **Unit 8: Fix dual rendering with useMediaQuery (P2)**

  **Goal:** Only one component tree renders per viewport — no hidden mount (R2).

  **Dependencies:** Unit 7 (shared hook reduces impact of dual mounting during transition)

  **Files:**
  - Create: `src/lib/nutritrack/hooks/useMediaQuery.ts`
  - Modify: `src/app/(nutritrack)/_components/layout/AppShell.tsx`

  **Approach:**
  - Create a `useMediaQuery` hook using `window.matchMedia`. Returns `false` during SSR (mobile-first). The hook subscribes to the media query change event and updates state.
  - In AppShell, replace the two CSS-hidden divs with a single conditional:
    ```
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    // Then render one branch:
    {isDesktop ? (activeView === 'chat' ? <TodayView /> : <ActiveView />) : <ActiveView />}
    ```
  - This eliminates the dual mounting entirely

  **Test scenarios:**
  - Happy path: on mobile viewport, only mobile ActiveView mounts
  - Happy path: on desktop viewport, only desktop branch mounts
  - Edge case: resizing from mobile to desktop transitions cleanly without flash

  **Verification:**
  - React DevTools shows only one instance of each view component at any viewport width

---

- [ ] **Unit 9: Fix DesktopNav active tab when activeView is 'chat' (P1)**

  **Goal:** DesktopNav highlights "Today" when activeView is 'chat' on desktop.

  **Dependencies:** Unit 8 (uses the same useMediaQuery approach)

  **Files:**
  - Modify: `src/app/(nutritrack)/_components/layout/DesktopNav.tsx`

  **Approach:**
  - In the active-tab check, treat 'chat' as equivalent to 'today': `const isActive = activeView === item.id || (item.id === 'today' && activeView === 'chat')`
  - This matches AppShell behavior where activeView='chat' on desktop shows TodayView in the main panel

  **Test scenarios:**
  - Happy path: on desktop with activeView='today', Today tab is highlighted
  - Edge case: on desktop with activeView='chat', Today tab is highlighted (not no tab)

  **Verification:**
  - Resize from mobile (on chat tab) to desktop — Today tab appears active

---

- [ ] **Unit 10: Derive type unions from store (P2)**

  **Goal:** Navigation type unions are derived from the store, not manually duplicated (R6).

  **Dependencies:** Unit 9

  **Files:**
  - Modify: `src/lib/nutritrack/hooks/useNutriStore.ts` — export `ActiveView` type
  - Modify: `src/app/(nutritrack)/_components/layout/BottomNav.tsx` — import and use derived type
  - Modify: `src/app/(nutritrack)/_components/layout/DesktopNav.tsx` — import and use `Exclude<ActiveView, 'chat'>`
  - Modify: `src/app/(nutritrack)/_components/layout/AppShell.tsx` — type ActiveView prop with store type

  **Approach:**
  - Export: `export type ActiveView = NutriState['activeView'];` from the store
  - BottomNav: replace `type ViewId = 'today' | 'chat' | 'week' | 'profile'` with `import { type ActiveView } from '...'`
  - DesktopNav: use `type DesktopViewId = Exclude<ActiveView, 'chat'>`
  - AppShell ActiveView component: type `view` prop as `ActiveView` instead of `string`

  **Test scenarios:**
  - Happy path: adding a new view to the store union causes compile errors in nav components (exhaustiveness)

  **Verification:**
  - `npm run build` succeeds; no manual type duplication remains

---

- [ ] **Unit 11: Add MotionConfig for reduced motion (P2)**

  **Goal:** All NutriTrack animations respect `prefers-reduced-motion` (R3).

  **Dependencies:** None (can run in parallel with other units)

  **Files:**
  - Modify: `src/app/(nutritrack)/_components/NutriTrackApp.tsx` — wrap in `<MotionConfig reducedMotion="user">`

  **Approach:**
  - Import `MotionConfig` from `framer-motion`
  - Wrap the outermost element in `<MotionConfig reducedMotion="user">...</MotionConfig>`
  - Framer Motion automatically disables all `motion.*` animations when the user has `prefers-reduced-motion: reduce` set in their OS. This covers all 11+ animated components (CalorieRing, MacroProgressBars, ChatMessage, AppShell transitions, FAB, WeekNavigator, etc.) with a single change.

  **Test expectation:** Verify with macOS Accessibility → Reduce Motion enabled — all NutriTrack animations should be instant/disabled.

  **Verification:**
  - Enable "Reduce motion" in OS settings → NutriTrack shows no animations

---

- [ ] **Unit 12: Fix ChatView height and use cn() for conditional classes (P2/P3)**

  **Goal:** ChatView fills available space without magic pixel values; conditional classes use `cn()`.

  **Dependencies:** Unit 8 (layout restructure)

  **Files:**
  - Modify: `src/app/(nutritrack)/_components/chat/ChatView.tsx` — replace `h-[calc(100dvh-68px)]` with flex-based height
  - Modify: `src/app/(nutritrack)/_components/chat/ChatMessage.tsx` — replace template literals with `cn()`

  **Approach:**
  - ChatView: The parent in AppShell already constrains height via `flex-1 overflow-y-auto`. Change ChatView root from `h-[calc(100dvh-68px)] lg:h-full` to simply `h-full`. On mobile, the parent flex container already provides the correct height constraint. On desktop, `lg:h-full` was already working — now just use `h-full` universally.
  - ChatMessage line 21: `className={cn('flex', isUser ? 'justify-end' : 'justify-start')}`
  - ChatMessage line 77: `className={cn('text-sm', message.isError ? 'text-nt-danger' : 'text-nt-text')}`
  - Add `import { cn } from '@/lib/utils'` to ChatMessage

  **Test scenarios:**
  - Happy path: chat input stays flush to bottom on mobile without hidden behind BottomNav
  - Happy path: on desktop, chat panel fills right column height correctly

  **Verification:**
  - No 12px gap or overlap with BottomNav on mobile
  - No template literal conditionals in ChatMessage

---

- [ ] **Unit 13: Fix WeeklyBarChart header and use interface for props (P3)**

  **Goal:** Chart heading reflects the current week; inline types converted to interfaces.

  **Dependencies:** Unit 2 (offset plumbing)

  **Files:**
  - Modify: `src/app/(nutritrack)/_components/week/WeeklyBarChart.tsx` — remove "This Week" heading (WeekNavigator already shows context)
  - Modify: `src/app/(nutritrack)/_components/chat/ChatMessage.tsx` — reuse `ChatMessageProps` for UserBubble/AssistantBubble
  - Modify: `src/app/(nutritrack)/_components/layout/DesktopNav.tsx` — change `type NavItem` to `interface NavItem`

  **Approach:**
  - WeeklyBarChart: Remove the "This Week" `<p>` heading entirely. WeekNavigator already provides the week context label directly above the chart.
  - ChatMessage: Both `UserBubble` and `AssistantBubble` already accept `{ message: ChatMessageType }` — reuse the existing `ChatMessageProps` interface.
  - DesktopNav: Change `type NavItem = {...}` to `interface NavItem {...}` per CLAUDE.md convention.

  **Test expectation:** none — cosmetic and style fixes

  **Verification:**
  - `npm run build` succeeds
  - No "This Week" label duplication with WeekNavigator

---

- [ ] **Unit 14: Extract VALID_IMAGE_TYPES constant (P2)**

  **Goal:** Single source of truth for allowed image types.

  **Dependencies:** None

  **Files:**
  - Create: `src/lib/nutritrack/constants/imageTypes.ts`
  - Modify: `src/app/(nutritrack)/_components/chat/ChatInput.tsx` — import from shared constant
  - Modify: `src/lib/nutritrack/hooks/useChat.ts` — import from shared constant

  **Approach:**
  - Create a one-line constant file: `export const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;`
  - Replace the local declarations in both files with the import

  **Test expectation:** none — pure refactor

  **Verification:**
  - `npm run build` succeeds; grep confirms only one declaration of VALID_IMAGE_TYPES

## System-Wide Impact

- **Store shape change:** Splitting `isLoadingEntries` into `isLoadingToday`/`isLoadingWeek` (Unit 5) and removing `quickFoods` (Unit 1) changes the Zustand store interface. All consumers must be updated in the same unit.
- **Rendering model change:** Moving from CSS-hidden dual rendering to JS-conditional single rendering (Unit 8) changes mount/unmount behavior. Effects that previously ran in hidden components will now only run when their view is actually visible. This is the intended behavior.
- **No API surface changes:** No Firestore queries, AI service calls, or route changes.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| `useMediaQuery` hook returns `false` on SSR, causing a hydration mismatch flash on desktop | Use `useSyncExternalStore` with a server snapshot of `false` (mobile-first). The brief flash of mobile layout on desktop first paint is acceptable for this portfolio project. |
| `MotionConfig reducedMotion="user"` disables ALL animations including layout-critical ones | Framer Motion's "user" mode still allows non-motion CSS transitions. All NutriTrack layout is Tailwind-based, not motion-dependent. |
| Splitting loading flags could miss edge cases where both load simultaneously | `loadTodayEntries` and `loadWeekEntries` are independent Firestore queries. Each flag is self-contained. |

## Sources & References

- Code review report from 2026-04-09 (5 reviewers: correctness, maintainability, TypeScript, project-standards, adversarial)
- Framer Motion `MotionConfig` docs: `reducedMotion="user"` respects OS-level prefers-reduced-motion
- Existing pattern: `useChat` hook in `src/lib/nutritrack/hooks/useChat.ts`
