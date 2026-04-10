---
title: "fix: Resolve NutriTrack review round 2 findings"
type: fix
status: active
date: 2026-04-09
---

# fix: Resolve NutriTrack review round 2 findings

## Overview

The second code review of the NutriTrack UI redesign identified 4 P1, 10 P2, and 4 P3 findings across correctness, maintainability, TypeScript safety, project standards, and test coverage. This plan addresses all P1 and P2 findings, plus the highest-value P3 items.

## Problem Frame

After implementing the dark theme, responsive layout, and merged views, a 6-persona review surfaced: a race condition in week navigation, stale `weekEntries` after food add/remove, incorrect weekly averages, zero test coverage on critical pure functions, duplicated SVG icons, dead code, missing accessibility attributes, and inline styles that should use Tailwind classes.

## Requirements Trace

- R1. Week navigation must display data matching the displayed week label, even under rapid interaction
- R2. Food add/remove must update both `todayEntries` and `weekEntries` for the current day
- R3. Weekly averages must divide by days with data, not hardcoded 7
- R4. Critical pure functions (`getLastNDays`, `computeWeeklyStats`, `getWeekLabel`, macro computation) must have unit test coverage
- R5. Decorative elements must have `aria-hidden="true"` per CLAUDE.md
- R6. Inline `style={}` must only be used for truly dynamic values (positions, transforms)
- R7. Dead code (`getQuickFoodsCollection`, unreachable switch default, invisible SVG rect) must be removed
- R8. Duplicated SVG nav icons must be shared between BottomNav and DesktopNav
- R9. `ActiveView` component naming collision must be resolved
- R10. Duplicated chat-to-today mapping logic must be consolidated

## Scope Boundaries

- NOT fixing SSR hydration flash (P2-ADV-002) — inherent to `useSyncExternalStore` pattern; would require CSS-based responsive layout which conflicts with the conditional rendering architecture. Accepted risk.
- NOT fixing the optimistic add + concurrent delete phantom entry (P2-ADV-008) — pre-existing store pattern, not introduced by this diff. Low probability.
- NOT adding safe area inset support to BottomNav (P2-ADV-006) — separate concern, not introduced by this diff.
- NOT adding `as const` to VALID_IMAGE_TYPES (P2) — was intentionally changed to `readonly string[]` to avoid TypeScript `.includes()` type narrowing issues.

## Key Technical Decisions

- **Race condition fix**: Use a request counter (`weekRequestId`) in the store. Increment on each `loadWeekEntries` call; only write results if the counter still matches. Simpler than AbortController and sufficient since Firestore `getDocs` is not cancellable anyway.
- **weekEntries sync**: After optimistic add/remove of today's entry, also update the corresponding day in `weekEntries` if the date key exists in the current week data. This avoids a full reload.
- **Shared nav icons**: Extract icon paths into a `src/app/(nutritrack)/_components/layout/nav-icons.tsx` file exporting small icon components that accept a `size` prop.
- **Test infrastructure**: Add test files alongside the source using `__tests__/` convention matching the existing `calculations.test.ts` pattern.

## Implementation Units

- [ ] **Unit 1: Fix race condition in loadWeekEntries**

**Goal:** Prevent stale week data from overwriting fresh data during rapid navigation.

**Requirements:** R1

**Dependencies:** None

**Files:**
- Modify: `src/lib/nutritrack/hooks/useNutriStore.ts`

**Approach:**
- Add a `_weekRequestId: number` field (not exposed in NutriState interface — internal counter) at module scope or as a store field
- In `loadWeekEntries`, capture `const requestId = ++_weekRequestId` before the async call
- After `getDocs` resolves, check `if (requestId !== _weekRequestId) return` before calling `set()`
- This ensures only the most recent request writes to state

**Patterns to follow:**
- Existing `loadTodayEntries` / `loadWeekEntries` structure in `useNutriStore.ts`

**Test scenarios:**
- Happy path: loadWeekEntries(0) completes and sets weekEntries with correct grouped data
- Edge case: Two rapid calls — loadWeekEntries(-1) then loadWeekEntries(-2) — only the last call's data persists
- Error path: Failed Firestore query still clears isLoadingWeek even if stale

**Verification:**
- Rapidly clicking prev/next in WeekNavigator always shows data matching the displayed week label

---

- [ ] **Unit 2: Sync weekEntries on food add/remove**

**Goal:** Keep `weekEntries` consistent with `todayEntries` during optimistic updates.

**Requirements:** R2

**Dependencies:** None

**Files:**
- Modify: `src/lib/nutritrack/hooks/useNutriStore.ts`

**Approach:**
- In `addFoodEntry`, after the optimistic `todayEntries` update, also update `weekEntries[today]` if the key exists in current weekEntries
- In `removeFoodEntry`, similarly filter the entry from `weekEntries[today]` if present
- In the rollback paths, reverse the weekEntries change as well
- In `addFoodEntry` success path (temp ID replacement), also update the entry ID in weekEntries

**Patterns to follow:**
- Existing optimistic update pattern in `addFoodEntry` / `removeFoodEntry`

**Test scenarios:**
- Happy path: Adding a food entry updates both todayEntries and weekEntries[today]
- Happy path: Removing a food entry removes from both todayEntries and weekEntries[today]
- Edge case: weekEntries does not contain today's key (user hasn't loaded week data) — skip weekEntries update silently
- Error path: Failed add rolls back both todayEntries and weekEntries

**Verification:**
- Adding food via chat or quick add is immediately reflected in WeekView bar chart without navigation

---

- [ ] **Unit 3: Fix weekly averages to divide by daysLogged**

**Goal:** Show accurate average calories/macros by dividing only by days with logged data.

**Requirements:** R3

**Dependencies:** None

**Files:**
- Modify: `src/lib/nutritrack/hooks/useInsights.ts`

**Approach:**
- Change `/ 7` to `/ Math.max(daysLogged, 1)` for avgCalories, avgProteinG, avgCarbsG, avgFatG
- `Math.max(..., 1)` prevents division by zero when no days have data

**Patterns to follow:**
- Existing `daysLogged` computation on line 41

**Test scenarios:**
- Happy path: 7 days with data produces correct average
- Edge case: Only 2 days with data — average divides by 2, not 7
- Edge case: 0 days with data — average is 0 (division by 1)
- Edge case: All 7 days logged with 0 calories — daysLogged=0, average=0

**Verification:**
- WeekView "Avg kcal / day" shows realistic numbers for partial weeks

---

- [ ] **Unit 4: Add unit tests for dates.ts**

**Goal:** Cover `getLastNDays` with offset, `getDateKey`, `formatDateKey`, `isToday`.

**Requirements:** R4

**Dependencies:** None

**Files:**
- Create: `src/lib/nutritrack/utils/__tests__/dates.test.ts`

**Approach:**
- Use vitest (already configured) with `vi.useFakeTimers()` to pin `new Date()` to a known date
- Test `getLastNDays(7, 0)` returns 7 date keys ending at today
- Test `getLastNDays(7, -1)` returns 7 date keys ending 7 days ago
- Test month boundary: pin to March 3, offset=0, verify days include Feb dates
- Test `getDateKey` format
- Test `isToday` true/false cases

**Patterns to follow:**
- `src/lib/nutritrack/utils/__tests__/calculations.test.ts` for vitest conventions

**Test scenarios:**
- Happy path: getLastNDays(7, 0) returns 7 keys, oldest first, ending at today
- Happy path: getLastNDays(7, -1) returns 7 keys ending 7 days ago
- Edge case: Month boundary — getLastNDays(7, 0) from March 3 includes Feb 25-Mar 3
- Edge case: Year boundary — getLastNDays(7, 0) from Jan 3 includes Dec dates
- Happy path: getDateKey() returns YYYY-MM-DD format
- Happy path: isToday returns true for today's key, false for yesterday

**Verification:**
- `npx vitest run src/lib/nutritrack/utils/__tests__/dates.test.ts` passes

---

- [ ] **Unit 5: Add unit tests for computeWeeklyStats**

**Goal:** Cover the weekly stats computation including the daysLogged fix from Unit 3.

**Requirements:** R4

**Dependencies:** Unit 3

**Files:**
- Create: `src/lib/nutritrack/hooks/__tests__/useInsights.test.ts`

**Approach:**
- Test `computeWeeklyStats` as a pure function (it doesn't use hooks)
- Mock `getLastNDays` or use fake timers to control date keys
- Test full week, partial week, empty week scenarios

**Patterns to follow:**
- `src/lib/nutritrack/utils/__tests__/calculations.test.ts`

**Test scenarios:**
- Happy path: 7 days of data, avgCalories = sum/7
- Edge case: 3 days of data, avgCalories = sum/3 (not sum/7)
- Edge case: 0 days of data, avgCalories = 0
- Happy path: daysOnTarget counts days within 100 kcal of target
- Happy path: projectedWeightChangeKg computation is correct

**Verification:**
- `npx vitest run src/lib/nutritrack/hooks/__tests__/useInsights.test.ts` passes

---

- [ ] **Unit 6: Add unit tests for getWeekLabel and macro computation**

**Goal:** Cover WeekNavigator date label logic and useTodayMacros reduce logic.

**Requirements:** R4

**Dependencies:** None

**Files:**
- Create: `src/lib/nutritrack/hooks/__tests__/useTodayMacros.test.ts`
- Modify: `src/app/(nutritrack)/_components/week/WeekNavigator.tsx` (export `getWeekLabel` for testing)
- Create: `src/app/(nutritrack)/_components/week/__tests__/WeekNavigator.test.ts`

**Approach:**
- Export `getWeekLabel` from WeekNavigator (add `export` keyword)
- Test offset=0 returns "This Week", offset=-1 returns "Last Week", offset=-2 returns a date range
- For useTodayMacros: extract the reduce logic into a pure `computeMacroTotals(entries)` function in the same file, test that directly
- Test rounding behavior, empty array, single entry

**Patterns to follow:**
- `src/lib/nutritrack/utils/__tests__/calculations.test.ts`

**Test scenarios:**
- Happy path: getWeekLabel(0) = "This Week"
- Happy path: getWeekLabel(-1) = "Last Week"
- Happy path: getWeekLabel(-2) returns "Mon, Date - Mon, Date" format
- Happy path: computeMacroTotals with 2 entries sums and rounds correctly
- Edge case: computeMacroTotals with empty array returns all zeros
- Edge case: computeMacroTotals with floating point values (e.g., 10.4 + 10.3 = 21, not 20)

**Verification:**
- Both test files pass with `npx vitest run`

---

- [ ] **Unit 7: Extract shared nav icons**

**Goal:** Eliminate duplicated SVG icon markup between BottomNav and DesktopNav.

**Requirements:** R8

**Dependencies:** None

**Files:**
- Create: `src/app/(nutritrack)/_components/layout/nav-icons.tsx`
- Modify: `src/app/(nutritrack)/_components/layout/BottomNav.tsx`
- Modify: `src/app/(nutritrack)/_components/layout/DesktopNav.tsx`

**Approach:**
- Create icon components: `CalendarIcon`, `ChatIcon`, `ChartIcon`, `UserIcon` — each accepts `size?: number` (default 22 for mobile, 18 for desktop)
- All icons include `aria-hidden="true"` (fixes R5 for nav icons)
- Replace inline SVGs in both nav files with the shared components

**Patterns to follow:**
- Existing inline SVG patterns in BottomNav/DesktopNav for the SVG paths

**Test expectation:** none — pure presentation extraction with no behavioral change

**Verification:**
- Nav icons render identically at both sizes; no visual regression

---

- [ ] **Unit 8: Add missing aria-hidden attributes**

**Goal:** Add `aria-hidden="true"` to decorative elements per CLAUDE.md.

**Requirements:** R5

**Dependencies:** Unit 7 (nav icons get aria-hidden there)

**Files:**
- Modify: `src/app/(nutritrack)/_components/today/CalorieRing.tsx`
- Modify: `src/app/(nutritrack)/_components/layout/BottomNav.tsx`

**Approach:**
- CalorieRing: Add `aria-hidden="true"` to the `<svg>` element (the ring is decorative; info is in center text)
- BottomNav: Add `aria-hidden="true"` to the active tab indicator `<motion.div>` (decorative; `aria-selected` already conveys state)

**Test expectation:** none — accessibility attribute additions with no behavioral change

**Verification:**
- Screen reader testing shows no duplicate announcements from decorative elements

---

- [ ] **Unit 9: Replace inline styles with Tailwind classes**

**Goal:** Use Tailwind utility classes instead of inline `style={}` where the values are from a static set.

**Requirements:** R6

**Dependencies:** None

**Files:**
- Modify: `src/app/(nutritrack)/_components/today/CalorieRing.tsx`
- Modify: `src/app/(nutritrack)/_components/today/MacroProgressBars.tsx`

**Approach:**
- CalorieRing: Replace `style={{ color: strokeColor }}` with `className={cn('text-sm font-medium', isOver ? 'text-nt-danger' : 'text-nt-accent')}`
- CalorieRing: The SVG `stroke` attribute must remain as a CSS variable string (dynamic based on runtime state and used as SVG attribute, not a className) — this is acceptable under the "dynamic values" exception
- MacroProgressBars: Change `color` prop from CSS variable strings to Tailwind class names (e.g., `'bg-nt-protein'`). Apply via `className` instead of `style={{ backgroundColor }}`

**Test expectation:** none — styling change with no behavioral impact

**Verification:**
- CalorieRing shows green text below target, red text above target
- Macro bars display correct colors

---

- [ ] **Unit 10: Remove dead code**

**Goal:** Clean up unreachable code, dead exports, and invisible SVG elements.

**Requirements:** R7

**Dependencies:** None

**Files:**
- Modify: `src/lib/nutritrack/services/firebase-client.ts` (remove `getQuickFoodsCollection`)
- Modify: `src/app/(nutritrack)/_components/layout/AppShell.tsx` (replace default branch with never check)
- Modify: `src/app/(nutritrack)/_components/today/TodayView.tsx` (remove invisible SVG path)

**Approach:**
- Delete `getQuickFoodsCollection` export from firebase-client.ts (only referenced in docs, not code)
- In AppShell's `ActiveView` switch: replace `default: return <div>...</div>` with `default: { const _exhaustive: never = view; return _exhaustive; }` for compile-time exhaustiveness checking
- In TodayView empty state: remove `<path d="M3 3h18v18H3z" opacity="0" />`
- Keep `QuickFood` model and `quickFoods.ts` constants — still used by `AddFoodModal`

**Test expectation:** none — code removal with no behavioral change

**Verification:**
- `npm run build` succeeds with no TypeScript errors
- No runtime errors on any view

---

- [ ] **Unit 11: Rename ActiveView component and consolidate chat-to-today mapping**

**Goal:** Resolve naming collision and eliminate duplicated desktop-chat-means-today logic.

**Requirements:** R9, R10

**Dependencies:** Unit 10 (exhaustiveness check is in the same component)

**Files:**
- Modify: `src/app/(nutritrack)/_components/layout/AppShell.tsx`
- Modify: `src/app/(nutritrack)/_components/layout/DesktopNav.tsx`

**Approach:**
- Rename the `ActiveView` component to `ViewSwitch`; remove the `as ActiveViewType` import alias, import `ActiveView` directly as the type
- Extract the mainView derivation into a shared helper or keep in AppShell but pass `mainView` (already derived) to inform DesktopNav's active state. Simplest approach: DesktopNav accepts an optional `effectiveView` prop so it doesn't need to duplicate the mapping logic. AppShell passes `mainView` as `effectiveView`.
- DesktopNav simplifies to `const isActive = effectiveView === item.id`

**Test expectation:** none — refactor with no behavioral change

**Verification:**
- Desktop nav highlights Today tab when chat is active
- No TypeScript errors after rename

---

- [ ] **Unit 12: Add comment for macro target prop mapping**

**Goal:** Clarify the semantic mismatch between `carbsRemainingG`/`fatMinG` and the `carbsTarget`/`fatTarget` props.

**Requirements:** R6 (clarity)

**Dependencies:** None

**Files:**
- Modify: `src/app/(nutritrack)/_components/today/TodayView.tsx`

**Approach:**
- Add a brief comment at the prop binding explaining: `carbsRemainingG` is the daily carb allocation (remaining kcal after protein+fat, /4) and `fatMinG` is the minimum daily fat intake, both used as progress bar targets

**Test expectation:** none — comment only

**Verification:**
- Code reads clearly at the call site

---

## Dependency Graph

```
Unit 1 (race condition) ──────────────────────────────────────┐
Unit 2 (weekEntries sync) ────────────────────────────────────┤
Unit 3 (avg/daysLogged) ─── Unit 5 (insights tests) ─────────┤
Unit 4 (dates tests) ────────────────────────────────────────┤
Unit 6 (weekLabel + macro tests) ─────────────────────────────┤  All independent
Unit 7 (shared icons) ─── Unit 8 (aria-hidden) ──────────────┤
Unit 9 (inline styles) ──────────────────────────────────────┤
Unit 10 (dead code) ─── Unit 11 (rename + consolidate) ──────┤
Unit 12 (comment) ────────────────────────────────────────────┘
```

Most units are independent. Units 5, 8, and 11 depend on their prerequisites.

## System-Wide Impact

- **State lifecycle**: Units 1 and 2 modify the store's async write behavior. The staleness guard in Unit 1 must not interfere with Unit 2's synchronous weekEntries updates.
- **Test infrastructure**: Units 4-6 establish test patterns for hooks and utils. Future contributors should follow these patterns.
- **API surface parity**: The `weekEntries` sync in Unit 2 must handle both the optimistic path and the rollback path to avoid state divergence.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Request counter in Unit 1 could mask legitimate late responses | Counter is monotonically increasing; only the latest request ID is valid. Stale responses are silently dropped, which is the desired behavior. |
| weekEntries sync in Unit 2 adds complexity to optimistic updates | Keep the sync logic simple — only update if the date key already exists in weekEntries. Don't create new keys. |
| Test files in Unit 4-6 use fake timers which can be fragile | Pin to specific dates well away from boundaries for most tests; use boundary dates only for specific edge case tests. |

## Sources & References

- Code review findings from 6-persona review (correctness, maintainability, TypeScript, adversarial, project standards, testing)
- Prior plan: `docs/plans/2026-04-09-001-fix-nutritrack-review-findings-plan.md`
- CLAUDE.md project standards
