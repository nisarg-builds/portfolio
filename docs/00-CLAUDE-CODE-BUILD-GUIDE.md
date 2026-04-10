# FitGlass — Claude Code Build Guide

> Step-by-step prompts for building FitGlass iteratively with Claude Code.
> Feed this document + the 5 spec docs (01 through 05) as context.
>
> **Stack**: Next.js 16.2.1 (App Router, TS), React 19, Tailwind CSS v4, Framer Motion 12, Firebase Admin 13.7 (existing) + Firebase Client SDK (new), Zustand, Recharts. Deployed on Vercel.

---

## How to Use This Document

This guide is organized into **phases**, each containing **numbered prompts** you paste into Claude Code one at a time. Each prompt builds on the previous one.

### Rules for yourself

1. **One prompt at a time.** Don't skip ahead. Each prompt assumes the previous one works.
2. **Test after every prompt.** Run `npm run dev`, click around, check console. Fix before moving on.
3. **Provide the spec docs upfront.** At the start of your Claude Code session, provide all 5 spec documents. You only need to do this once per session.
4. **If something breaks**, describe the exact error. Don't re-paste the whole prompt.
5. **Commit after each phase.** `git commit` before starting the next phase.

### Session setup prompt

Paste this at the very start of every new Claude Code session:

```
I'm building FitGlass, an AI-powered calorie tracker as a module inside my existing Next.js portfolio website. I've attached 5 spec documents (01-ARCHITECTURE through 05-UTILS-AND-CONSTANTS).

My existing portfolio stack:
- Next.js 16.2.1 (App Router, TypeScript)
- React 19.2.4
- Tailwind CSS v4 with Typography plugin (CSS-based config, NOT tailwind.config.js)
- Framer Motion 12.38 (already installed)
- GSAP 3.14 + ScrollTrigger (already installed, not used by FitGlass)
- Firebase Admin 13.7 (already installed for Firestore + Cloud Storage)
- MDX via next-mdx-remote 6.0 (blog, not related)
- Vercel Analytics 2.0
- ESLint 9 + Prettier (with Tailwind plugin)
- Deployed on Vercel

FitGlass lives inside this repo as:
- Route: app/(fitglass)/fitglass/ — URL is /fitglass
- Components: app/(fitglass)/_components/
- Logic: lib/fitglass/ (models, hooks, utils, constants, services)
- API: app/api/fitglass/analyze/route.ts
- Styles: lib/fitglass/styles/fitglass.css (Tailwind v4 @theme tokens)

New dependencies needed: zustand, recharts, firebase (client SDK), @anthropic-ai/sdk

Key constraints:
- Tailwind v4 uses @theme directive in CSS, not tailwind.config.js
- All FitGlass color tokens use "nt-" prefix (e.g., bg-fg-card, text-fg-accent)
- Use Framer Motion for all animations (no raw CSS animations)
- Firebase Client SDK (for auth + realtime) is SEPARATE from the existing Firebase Admin SDK
- AI proxy is a Next.js API Route, NOT a Firebase Cloud Function
- All FitGlass components are 'use client' (they use hooks, state, browser APIs)
- Font loading via next/font/google (DM Sans)
- Follow the existing ESLint 9 + Prettier config

Let me know you've understood the architecture and I'll start with the first task.
```

---

## Phase 1 — Foundation & Types

> Goal: New dependencies installed, all TypeScript types in place, utility functions written, Tailwind tokens registered. No UI yet.

### Prompt 1.1 — Install dependencies and scaffold

```
Install the new dependencies FitGlass needs:

npm install zustand recharts firebase @anthropic-ai/sdk

Then create the directory structure. DON'T write component code yet — just empty placeholder files or directories:

1. app/(fitglass)/fitglass/page.tsx — placeholder that exports a simple <div>FitGlass coming soon</div>
2. app/(fitglass)/fitglass/layout.tsx — loads DM Sans via next/font/google, imports fitglass.css
3. app/(fitglass)/_components/ — empty directory (we'll add components later)
4. app/api/fitglass/analyze/route.ts — placeholder that returns { message: "not implemented yet" }
5. lib/fitglass/ — create subdirectories: models/, hooks/, services/, utils/, constants/, styles/
6. lib/fitglass/styles/fitglass.css — add the @theme block with all nt-* color tokens from 04-UI-COMPONENTS.md section 1.1

Make sure the fitglass.css is imported in the layout so the tokens are available. After this, visiting /fitglass should show the placeholder text with DM Sans font applied and no errors.
```

### Prompt 1.2 — TypeScript models

```
Create all TypeScript type definitions in lib/fitglass/models/. Reference 02-DATA-MODELS.md section 1 for exact types.

Create:
- lib/fitglass/models/user.ts — UserProfile, FitnessGoal, Gender, ActivityLevel, ComputedTargets
- lib/fitglass/models/food.ts — FoodEntry, QuickFood, NutritionData, Macronutrients, Micronutrients, FoodEntrySource, MealType
- lib/fitglass/models/chat.ts — ChatMessage, AIFoodItem, AIFoodResponse, AnalyzeFoodRequest, AnalyzeFoodResponse
- lib/fitglass/models/insights.ts — Insight, InsightType, WeeklyStats, DaySummary
- lib/fitglass/models/index.ts — re-export everything

Every interface needs JSDoc comments. Follow exact field names and types from the spec. Use strict TypeScript — no `any`.
```

### Prompt 1.3 — Constants

```
Create the constants files in lib/fitglass/constants/. Reference 05-UTILS-AND-CONSTANTS.md section 4.

- lib/fitglass/constants/activityLevels.ts — ACTIVITY_LEVELS array + getActivityLevel() helper
- lib/fitglass/constants/quickFoods.ts — PRESET_QUICK_FOODS (all 15 items including dal, paneer, roti)
- lib/fitglass/constants/prompts.ts — FOOD_ANALYSIS_SYSTEM_PROMPT (reference copy, actual prompt is in API route)

Import types from lib/fitglass/models/. Everything should be properly typed.
```

### Prompt 1.4 — Utility functions

```
Create the utility modules in lib/fitglass/utils/. Reference 05-UTILS-AND-CONSTANTS.md sections 1-3.

- lib/fitglass/utils/calculations.ts — calculateBMR, calculateTDEE, calculateDailyTarget, calculateMacroTargets, computeAllTargets
- lib/fitglass/utils/dates.ts — getDateKey, formatDateKey, getLastNDays, isToday
- lib/fitglass/utils/validators.ts — validateProfile, validateFoodEntry
- lib/fitglass/utils/converters.ts — aiItemToNutrition, inferMealType, aiItemToFoodEntry

All functions need JSDoc comments. Handle edge cases (1200 kcal floor, 500 surplus cap). Use exact formulas from spec.

Also write unit tests in lib/fitglass/utils/__tests__/calculations.test.ts covering the cases in 05-UTILS-AND-CONSTANTS.md section 1.2.
```

**✅ Phase 1 checkpoint:** `npm run dev` works, /fitglass shows placeholder, `npm test` passes, all types compile with no errors.

---

## Phase 2 — Firebase Client & State

> Goal: Firebase client SDK initialized (separate from admin), Auth working, Zustand store wired to Firestore.

### Prompt 2.1 — Firebase client service

```
Create lib/fitglass/services/firebase-client.ts. Reference 03-API-ROUTE-AND-AI.md section 3.

This is the FIREBASE CLIENT SDK — separate from the portfolio's existing firebase-admin setup. They are different packages.

This file should:
1. Initialize the Firebase client app using NEXT_PUBLIC_FIREBASE_* env vars
2. Handle the case where the app is already initialized (getApps() check for HMR)
3. Export auth (getAuth), db (getFirestore with offline persistence), googleProvider
4. Export typed helper functions: getUserProfileRef(uid), getFoodLogCollection(uid), getQuickFoodsCollection(uid)
5. Enable Firestore persistent local cache with multi-tab manager

Also create a .env.local.example file listing all required env vars (both NEXT_PUBLIC_FIREBASE_* and ANTHROPIC_API_KEY). Add it to the repo but NOT .env.local itself (make sure .env.local is in .gitignore).
```

### Prompt 2.2 — Auth hook

```
Create lib/fitglass/hooks/useAuth.ts — a 'use client' hook.

This should:
1. Listen to Firebase auth state changes (onAuthStateChanged) using the client SDK from firebase-client.ts
2. Expose: { user, loading, signInWithGoogle, signOut }
3. user = { uid, email, displayName } | null
4. Use Google sign-in (signInWithPopup with googleProvider from firebase-client.ts)
5. Clean up the listener on unmount
6. Handle the case where sign-in popup is blocked (try signInWithRedirect as fallback)
```

### Prompt 2.3 — Zustand store

```
Create lib/fitglass/hooks/useFitGlassStore.ts. Reference the store shape in 02-DATA-MODELS.md section 1.5.

Implement all state fields and these actions:
1. setProfile — saves to state AND writes to Firestore (debounced 500ms). Recomputes targets via computeAllTargets.
2. addFoodEntry — optimistic add to todayEntries, then write to Firestore. On failure, roll back the optimistic update.
3. removeFoodEntry — optimistic remove from todayEntries, then delete from Firestore. On failure, roll back.
4. loadTodayEntries — query Firestore foodLog where dateKey == today, ordered by loggedAt desc
5. loadWeekEntries — query Firestore foodLog where dateKey is in last 7 days
6. setActiveView — set the view string
7. addChatMessage — append to chatMessages
8. analyzeFood — placeholder for now: log "AI not connected yet" to console

Use firebase-client.ts for all Firestore operations (client SDK: addDoc, deleteDoc, getDocs, query, where, orderBy). NOT firebase-admin.

All operations must be in try/catch. Errors should be logged but not crash the app.
```

### Prompt 2.4 — Data loading + auth gate

```
Create these hooks:

lib/fitglass/hooks/useProfile.ts:
- On mount (when user is authenticated), load profile from Firestore
- If no profile exists, create one with defaults and save
- Expose: { profile, targets, updateProfile, isLoading }
- updateProfile validates with validateProfile before saving

lib/fitglass/hooks/useFoodLog.ts:
- On mount, call loadTodayEntries and loadWeekEntries from store
- Set up a Firestore realtime listener (onSnapshot via client SDK) for today's foodLog entries
- Expose: { todayEntries, weekEntries, addFood, removeFood, isLoading }
- addFood validates with validateFoodEntry before saving

Now update the main app:

app/(fitglass)/_components/FitGlassApp.tsx ('use client'):
- Use useAuth hook
- If loading: show a centered loading spinner (use Framer Motion fade)
- If not authenticated: show a sign-in screen with a "Sign in with Google" button (styled with fg-accent, use motion.button with whileTap scale)
- If authenticated: load profile and food data, then render a placeholder "Welcome, {name}" text

app/(fitglass)/fitglass/page.tsx:
- Import and render <FitGlassApp />
```

**✅ Phase 2 checkpoint:** Visit /fitglass → see sign-in screen → sign in with Google → see "Welcome, {name}" → profile saved in Firestore → manually add test food doc to Firestore → see it load. No UI components yet.

---

## Phase 3 — Core UI Components

> Goal: Today view fully functional. Food logging works.

### Prompt 3.1 — Layout shell and shared components

```
Build the app layout. Reference 04-UI-COMPONENTS.md sections 1 and 2.1.

Create these 'use client' components:

app/(fitglass)/_components/layout/AppShell.tsx:
- Max-width 480px centered, min-h-screen, bg-fg-bg
- Renders BottomNav at top (sticky)
- Renders active view below, wrapped in Framer Motion AnimatePresence for view transitions (fade + slight slide)

app/(fitglass)/_components/layout/BottomNav.tsx:
- 5 tabs: Today, AI Chat, Week, Insights, Profile
- Active tab: font-semibold text-fg-text, 2px accent bottom border
- Use Framer Motion motion.div with layoutId for the active indicator (smooth sliding underline)
- Reads/sets activeView from Zustand store

Shared components:
- app/(fitglass)/_components/shared/Card.tsx — bg-fg-card rounded-xl p-5 border border-fg-border
- app/(fitglass)/_components/shared/Button.tsx — variants: "primary" (bg-fg-accent), "ghost" (border, transparent), "danger" (bg-fg-danger). Use motion.button with whileTap={{ scale: 0.97 }}.
- app/(fitglass)/_components/shared/ProgressBar.tsx — role="progressbar", aria-valuenow/min/max. Animate width with Framer Motion. Green under target, red when over.

Wire FitGlassApp.tsx to render AppShell after auth. Each tab should show placeholder text for now.
```

### Prompt 3.2 — Today view

```
Build the Today view components. Reference 04-UI-COMPONENTS.md section 2.2.

app/(fitglass)/_components/today/TodayView.tsx — assembles three sections
app/(fitglass)/_components/today/CalorieSummaryCard.tsx — big calorie number, ProgressBar, remaining/over text, TDEE
app/(fitglass)/_components/today/MacroDonut.tsx — Recharts PieChart donut (innerRadius) with P/C/F. Only show if entries exist.
app/(fitglass)/_components/today/FoodLogList.tsx — header with "AI Chat" + "+ Add" buttons, list of FoodLogItem, empty state
app/(fitglass)/_components/today/FoodLogItem.tsx — food name, macro summary, cal count, delete button (aria-label)

Wire to Zustand store using useFoodLog and useProfile hooks. Real data. "AI Chat" button calls setActiveView('chat'). "+ Add" opens AddFoodModal (next prompt).

Animate the calorie summary's progress bar width with Framer Motion. Use motion.div for entry list items with staggered entrance animation.
```

### Prompt 3.3 — Add food modal

```
Build AddFoodModal. Reference 04-UI-COMPONENTS.md section 2.4.

app/(fitglass)/_components/shared/AddFoodModal.tsx:

Framer Motion animations:
- Overlay: motion.div, initial opacity 0, animate to 1, exit to 0
- Sheet: motion.div, initial y="100%", animate y=0 with spring damping 25 stiffness 300, exit y="100%"
- Wrap both in AnimatePresence in the parent component (TodayView or AppShell)

Content:
- Header "Add food" + × close button
- Search input (autoFocus on mount) — filters PRESET_QUICK_FOODS case-insensitive
- Scrollable quick foods list (max-h-48 overflow-y-auto) — click to log + close
- Divider
- Custom food: name input + 2x2 grid (calories, protein, carbs, fat) + add button
- Add button disabled until name + calories filled

On add:
1. Validate with validateFoodEntry
2. Call addFood from useFoodLog
3. Close modal with exit animation

Dismiss: click overlay, press Escape, or × button. Basic focus trap (Tab cycles within modal).
```

**✅ Phase 3 checkpoint:** Today view shows real data. Add food via quick-add or custom. Delete food. Calorie/macro summary updates in real-time. Progress bar animates. Modal slides up/down smoothly.

---

## Phase 4 — AI Chat

> Goal: Chat with Claude. Text and image food analysis. Log from chat.

### Prompt 4.1 — API Route

```
Build the Next.js API route for AI food analysis. Reference 03-API-ROUTE-AND-AI.md section 1.2.

app/api/fitglass/analyze/route.ts:

This is a POST handler that:
1. Reads Authorization header, extracts Bearer token
2. Verifies token using firebase-admin auth().verifyIdToken() — use the portfolio's existing admin SDK initialization
3. Checks rate limit (Firestore counter via admin SDK — rateLimits/{uid} collection)
4. Validates request body (text/imageBase64/imageMediaType)
5. Calls Claude API (claude-sonnet-4-20250514) with the system prompt from the spec
6. Validates response JSON (parse, check schema, verify field types)
7. On invalid JSON: retry once with stricter prompt
8. Returns { success, data, rateLimitRemaining } or error with appropriate HTTP status

Config:
- export const maxDuration = 30 (Vercel serverless timeout)
- export const dynamic = 'force-dynamic'

IMPORTANT: Make sure the firebase-admin initialization is compatible with the portfolio's existing setup. The portfolio likely already calls initializeApp somewhere — check for that and don't double-initialize. Use getApps().length check.

After creating the route, tell me how to test it with curl.
```

### Prompt 4.2 — Client AI service + store wiring

```
Build the client-side AI service. Reference 03-API-ROUTE-AND-AI.md section 2.

lib/fitglass/services/ai.ts:
- analyzeFood(text?, imageBase64?, imageMediaType?) — sends POST to /api/fitglass/analyze with Firebase ID token in Authorization header
- fileToBase64(file, maxSizeBytes) — converts File to base64, auto-resizes if >5MB
- resizeImage(file) — canvas-based resize, 1920px max, JPEG 0.7 quality
- Map HTTP error codes to user-friendly messages

Now wire up the analyzeFood action in the Zustand store (replace the placeholder):
1. Add user ChatMessage
2. Add loading ChatMessage (isLoading: true)
3. Call ai.analyzeFood()
4. Replace loading message with response (foods + message)
5. On error: replace with error message (isError: true)

Also create lib/fitglass/hooks/useChat.ts:
- Manages chat-specific state and actions
- Exposes: { messages, sendMessage, isLoading }
- sendMessage accepts text + optional image File
- Handles fileToBase64 conversion, then calls store.analyzeFood
```

### Prompt 4.3 — Chat UI components

```
Build all Chat view components. Reference 04-UI-COMPONENTS.md section 2.3.

app/(fitglass)/_components/chat/ChatView.tsx:
- Compact summary bar at top (consumed/target + P/C/F)
- Scrollable message area (flex-1 overflow-y-auto)
- Auto-scroll to bottom on new messages (useRef + scrollIntoView)
- ImagePreview strip (conditional)
- ChatInput at bottom

app/(fitglass)/_components/chat/ChatMessage.tsx:
- User messages: right-aligned, bg-fg-chat-user bubble, optional image above text
- AI messages: left-aligned, small accent avatar, "Lens" label, bg-fg-chat-ai bubble
- Animate each new message with Framer Motion (motion.div fade+slideUp)

app/(fitglass)/_components/chat/FoodCard.tsx:
- Shows food name, macro MicroBadge pills (Cal, P, C, F), "+ Log" button
- Expandable "Show micronutrients ›" — AnimatePresence for expand/collapse
- "+ Log" calls addFood via useFoodLog, posts confirmation in chat

app/(fitglass)/_components/chat/MicroBadge.tsx:
- Small pill: label + value + unit. Rounded, light background.

app/(fitglass)/_components/chat/ChatInput.tsx:
- [image button] [textarea] [send button]
- Textarea: auto-expanding, Enter sends, Shift+Enter for newline
- Send disabled when loading or empty
- Image button opens file picker

app/(fitglass)/_components/chat/ImagePreview.tsx:
- Thumbnail with × remove button

Loading state: three dots with Framer Motion staggered opacity+scale animation.
```

### Prompt 4.4 — Chat edge cases

```
Handle these chat edge cases:

1. Non-JPEG/PNG/WebP image → inline error message in chat
2. Image >5MB → auto-resize silently via fileToBase64
3. AI returns empty foods array → show message with no FoodCards
4. Network offline → "You're offline. AI chat requires internet." Disable send.
5. Rate limit 429 → show the error from API response
6. Text >1000 chars → truncate client-side, warn "trimmed to 1000 characters"
7. Prevent double-send: disable send button while loading
8. Welcome message on first render: "Hey! Tell me what you ate or snap a photo of your meal — I'll break down the calories, macros, and micronutrients for you."
9. After successful analysis, if the user hasn't set up their profile yet, show a subtle hint: "Set up your profile to get personalized calorie targets."
```

**✅ Phase 4 checkpoint:** Type "2 eggs and toast with butter" → get structured response → tap Log → appears in Today view. Upload food photo → get analysis. Error states handled.

---

## Phase 5 — Week View & Insights

### Prompt 5.1 — Week view

```
Build the Week view. Reference 04-UI-COMPONENTS.md section 2.5.

app/(fitglass)/_components/week/WeekView.tsx
app/(fitglass)/_components/week/WeeklyBarChart.tsx

- Recharts BarChart: 7 days, accent green bars, rounded top corners
- Clean axes: muted labels, no axis lines, no tick lines
- Tooltip: rounded, bordered, shows "X kcal"
- Two stat cards below: avg/day + days on target
- Use computeWeeklyStats from lib/fitglass/hooks/useInsights.ts
- Animate bars entrance with Framer Motion (fade in the chart container)
```

### Prompt 5.2 — Insights view

```
Build the Insights view. Reference 04-UI-COMPONENTS.md section 2.6.

app/(fitglass)/_components/insights/InsightsView.tsx
app/(fitglass)/_components/insights/InsightBadge.tsx

Three cards:
1. Dynamic insight badges using generateInsights() — bg-fg-accent-light/bg-fg-danger-light/bg-gray-100
2. Fat loss overview (prose: TDEE, target, deficit, projected loss, protein tip)
3. Quick tips (4 static tips with left border accent)

Stagger insight badge entrance with Framer Motion (each badge delays 0.05s after the previous).
```

**✅ Phase 5 checkpoint:** Week chart shows real data. Insights update when food is logged.

---

## Phase 6 — Profile & Settings

### Prompt 6.1 — Profile view

```
Build the Profile view. Reference 04-UI-COMPONENTS.md section 2.7.

app/(fitglass)/_components/profile/ProfileView.tsx
app/(fitglass)/_components/profile/TargetCard.tsx

Form:
- Weight/Height/Age: number inputs with labels
- Gender: two toggle buttons (motion.button with whileTap)
- Activity: 2x2 grid of toggle buttons
- Goal rate: row of 4 toggle buttons (0.25, 0.5, 0.75, 1.0)

Active toggle: bg-fg-accent text-white. Inactive: border-fg-border bg-transparent.

All changes: validate → update store → debounce Firestore write 500ms → recompute targets instantly.

TargetCard: 2x2 grid showing TDEE, daily target (accent), deficit, protein target.

Reset button: window.confirm → delete all foodLog docs + reset profile to defaults.
```

**✅ Phase 6 checkpoint:** Profile saves/loads. Changing any field instantly updates targets. Reset works.

---

## Phase 7 — Polish & Production

### Prompt 7.1 — Loading, empty, and error states

```
Add proper states across all views:

1. TodayView loading: skeleton cards using Tailwind animate-pulse on gray rounded rectangles
2. TodayView empty: centered message with CTA buttons for "AI Chat" and "Quick Add"
3. ChatView: welcome message already handled. Add "offline" detection using navigator.onLine + window event listeners
4. WeekView: skeleton chart while loading. Zero-height bars when no data (chart still renders axes)
5. Error boundary: create app/(fitglass)/_components/shared/ErrorBoundary.tsx — catches React errors, shows "Something went wrong" with a "Reload" button (window.location.reload). Use React 19's error boundary pattern.
6. Thin loading bar under the nav during async operations (Framer Motion animated width bar, bg-fg-accent, 2px height)
```

### Prompt 7.2 — Accessibility

```
Accessibility pass across all components:

1. aria-label on all icon-only buttons: delete food (×), upload image (📷), send message, close modal
2. role="progressbar" with aria-valuenow/min/max on CalorieSummaryCard's ProgressBar
3. Focus trap in AddFoodModal: Tab cycles within modal, Escape closes
4. Auto-focus: search input on modal open, chat textarea on view switch
5. All form inputs have <label> elements (use sr-only class for visual labels already shown)
6. aria-label on WeeklyBarChart: "Calorie intake over the last 7 days"
7. Ensure color is not the sole indicator — text labels exist alongside colors
8. All motion.div animations respect prefers-reduced-motion: use Framer Motion's useReducedMotion hook, skip animations when true
```

### Prompt 7.3 — Performance

```
Performance optimizations:

1. Dynamic import ChatView with next/dynamic (it's the heaviest view, not needed on first render):
   const ChatView = dynamic(() => import('./chat/ChatView'), { ssr: false, loading: () => <ChatSkeleton /> })
2. Memoize: computeAllTargets, computeWeeklyStats, generateInsights — use useMemo with proper deps
3. React.memo on FoodLogItem and FoodCard to prevent re-renders
4. Tree-shake recharts: import { BarChart, Bar, XAxis, ... } from 'recharts' (named imports only)
5. Firestore query limit: only fetch last 7 days for week entries (use where + orderBy + limit)
6. Image lazy loading: chat images should use loading="lazy" on <img> tags
```

### Prompt 7.4 — Security and deployment

```
Finalize for production:

1. Firestore security rules: create or update firestore.rules using the exact rules from 02-DATA-MODELS.md section 2.3. Merge with any existing portfolio rules — don't overwrite them.

2. Create firestore.indexes.json with the composite indexes from the spec.

3. Verify the API route ONLY accepts POST (it should by default since we only export POST function, but double-check).

4. Add a .env.local.example file (if not created already) listing all required env vars.

5. Test on Vercel preview deployment:
   - Set all env vars in Vercel project settings
   - Push to a branch, verify preview URL works
   - Test: sign in → add food → AI chat → check Firestore

6. Write a section in the project README (or a separate NUTRITRACK.md) explaining:
   - What FitGlass is
   - How to set up Firebase client credentials
   - How to set the Anthropic API key
   - How to run locally
   - How to deploy (just git push, Vercel handles it)
```

**✅ Phase 7 checkpoint:** Production-ready. Security rules deployed. Accessible. Performance optimized. Error states handled.

---

## Phase 8 — Final Testing

### Prompt 8.1 — Testing checklist

```
Create a manual testing checklist I can go through. Cover:

1. Auth: sign in with Google, sign out, sign in again (data persists)
2. Profile: change weight → targets update. Activity → targets update. Goal rate → targets update.
3. Quick add: search "chicken", tap it, verify in food log with correct macros
4. Custom add: all fields, verify in food log
5. AI text: "dal rice with raita" → food cards → log one → verify in Today
6. AI image: upload food photo → analysis → log → verify
7. Delete food: delete entry, calorie count updates
8. Week view: log food on multiple days, chart + stats update
9. Insights: under target → "on track". Over target → warning. Low protein → warning.
10. Offline: disconnect → Today still works. Chat shows offline message.
11. Reset: profile reset clears all data
12. Multi-tab: open two tabs, add food in one → appears in other (Firestore listener)
13. Mobile: test on phone-width viewport (320px, 375px, 414px)
14. Accessibility: tab through all interactive elements with keyboard
15. Vercel: deploy preview, test all flows on real URL
```

---

## Troubleshooting Prompts

### Firebase client vs admin confusion

```
I'm getting an error about Firebase initialization. My portfolio uses firebase-admin (server-side) and FitGlass uses the firebase client SDK (browser-side). The error is: "[PASTE ERROR]".

The client SDK init is at lib/fitglass/services/firebase-client.ts. The admin SDK is at [wherever your portfolio initializes it]. Can you check for conflicts?
```

### Tailwind v4 token issues

```
My custom Tailwind v4 tokens (bg-fg-card, text-fg-accent, etc.) aren't being applied. The @theme block is in lib/fitglass/styles/fitglass.css and it's imported in app/(fitglass)/fitglass/layout.tsx.

I'm using Tailwind v4 which uses CSS-based config (@theme directive), NOT tailwind.config.js. Can you debug why the tokens aren't working?
```

### API route errors

```
The API route at app/api/fitglass/analyze/route.ts is returning: "[PASTE ERROR]".

Here's what I see in the Vercel function logs (or terminal): "[PASTE LOG]".

The route uses firebase-admin for auth verification and @anthropic-ai/sdk for Claude. Can you debug?
```

### Framer Motion issues

```
The [component] animation isn't working correctly: [describe issue]. The component uses Framer Motion's [AnimatePresence/motion.div/etc.]. 

I'm using Framer Motion 12.38 with React 19. Is there a compatibility issue or am I using the API wrong?
```

---

## Optional Enhancements (Post-MVP)

Once the core app works, add these one at a time:

```
Add a weight log feature: users log weight daily. Show a Recharts LineChart on Insights tracking weight over time. Store in users/{uid}/weightLog/{entryId} with fields: weightKg, dateKey, loggedAt. Add a small weight input card at the top of the Profile view.
```

```
Add meal categories: group food log by breakfast/lunch/dinner/snack in TodayView using collapsible sections (Framer Motion AnimatePresence). Auto-assign based on time of day. Show meal type pills on each FoodLogItem.
```

```
Add "most used" to AddFoodModal: query quickFoods sorted by usageCount desc, show top 5 above search results. Increment usageCount on every log.
```

```
Add data export: button in Profile that exports all foodLog as CSV (date, meal, name, calories, protein, carbs, fat). Use Blob + URL.createObjectURL for browser download.
```

```
Add dark mode: detect prefers-color-scheme, add toggle in Profile. Use Tailwind v4's @theme with @media (prefers-color-scheme: dark) to define dark variants of all nt-* tokens. Store preference in UserProfile.
```

```
Add a "streak" tracker: count consecutive days with at least 1 logged entry. Show as a flame icon + number on the TodayView CalorieSummaryCard. Animate the flame with Framer Motion on milestone days (7, 14, 30, etc.).
```
