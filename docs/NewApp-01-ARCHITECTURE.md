# NutriTrack — Architecture & Implementation Spec

> A production-ready AI-powered calorie and nutrition tracker, built as a route module inside an existing Next.js 16 portfolio website.

---

## 1. Product Overview

NutriTrack is a calorie and nutrition tracking app that lets users log food via text, image upload, or manual entry. An AI chat interface (powered by Claude) analyzes food descriptions and photos to estimate calories, macronutrients, and micronutrients. The app calculates TDEE, sets calorie targets based on user goals (fat loss / muscle gain / maintenance), and provides weekly insights and trend visualization.

### Core User Flows

1. **Quick log** — User taps "+ Add", selects from favorites/recent, or types custom entry with manual macro values.
2. **AI chat log** — User types "grilled chicken with rice and salad" or uploads a food photo. The AI returns structured nutrition data. User taps "Log" on the food card to add it to their daily log.
3. **Review & insights** — User checks daily summary (calories, macros, progress bar), weekly bar chart trends, and computed insights (deficit tracking, protein adequacy, consistency score).
4. **Profile setup** — User enters weight, height, age, gender, activity level, and goal. App auto-calculates TDEE and daily calorie target.

### Non-Functional Requirements

- **Performance**: First contentful paint < 1.5s. AI chat responses < 5s.
- **Offline**: Core logging (manual entry, favorites) works with Firestore offline persistence. AI chat requires network.
- **Responsive**: Mobile-first, works on all viewports 320px+.
- **Accessibility**: WCAG 2.1 AA. Keyboard navigable. Screen reader labels on all interactive elements.
- **Security**: Firebase Auth for user identity. Firestore security rules enforce per-user data isolation. Anthropic API key stays server-side in Next.js API route. No PII in AI API calls beyond food descriptions.

---

## 2. Tech Stack

This app lives **inside** the existing portfolio repo. No new framework, no separate build.

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.2.1 (App Router) | Already in portfolio. NutriTrack is a route group. |
| UI | React 19.2.4 | Already in portfolio. |
| Styling | Tailwind CSS v4 (with Typography plugin) | Already in portfolio. Use `@layer` and `@theme` for NutriTrack tokens. No `tailwind.config.js` — Tailwind v4 uses CSS-based config. |
| Animations | Framer Motion 12.38 | Already in portfolio. Use for page transitions, modal enter/exit, micro-interactions. |
| State | Zustand | **New dependency.** Lightweight client state for the NutriTrack module. |
| Backend (existing) | Firebase Admin 13.7 | Already in portfolio for Firestore + Cloud Storage. Reuse the same Firebase project. |
| Backend (client) | Firebase Client SDK (new) | **New dependency.** Needed for client-side Auth and Firestore realtime listeners. The portfolio uses Admin SDK server-side — NutriTrack needs the client SDK too. |
| AI | Anthropic Claude API | Called via Next.js API Route (server-side). API key in environment variable. |
| Charts | Recharts | **New dependency.** React-native charting. |
| Deployment | Vercel | Already configured. NutriTrack deploys with the portfolio. |

### New dependencies to install

```bash
npm install zustand recharts firebase
# firebase = client SDK (different from firebase-admin which is already installed)
```

### Why NOT separate packages

- The portfolio already has Next.js, React, Tailwind, Framer Motion, Firebase Admin, and Vercel configured.
- Adding NutriTrack as a route group (`app/(nutritrack)/`) means zero new build config.
- The API route for Claude lives alongside existing API routes.
- Tailwind v4's `@layer` system lets us scope NutriTrack tokens without prefixing.

---

## 3. Project Structure

NutriTrack files live inside the existing portfolio repo. Nothing outside these paths is modified.

```
app/
├── (nutritrack)/                      # Route group (no URL prefix from the parens)
│   ├── nutritrack/                    # URL: /nutritrack
│   │   ├── page.tsx                   # Main entry — renders <NutriTrackApp />
│   │   └── layout.tsx                 # NutriTrack-specific layout (metadata, fonts)
│   │
│   └── _components/                   # NutriTrack-only components (not routed)
│       ├── NutriTrackApp.tsx          # Root client component, auth gate, view router
│       │
│       ├── layout/
│       │   ├── AppShell.tsx           # Nav bar, view switching, layout wrapper
│       │   └── BottomNav.tsx          # Tab navigation
│       │
│       ├── today/
│       │   ├── TodayView.tsx          # Daily summary + food log
│       │   ├── CalorieSummaryCard.tsx
│       │   ├── MacroDonut.tsx
│       │   ├── FoodLogList.tsx
│       │   └── FoodLogItem.tsx
│       │
│       ├── chat/
│       │   ├── ChatView.tsx           # AI chat interface
│       │   ├── ChatMessage.tsx
│       │   ├── FoodCard.tsx
│       │   ├── MicroBadge.tsx
│       │   ├── ChatInput.tsx
│       │   └── ImagePreview.tsx
│       │
│       ├── week/
│       │   ├── WeekView.tsx
│       │   └── WeeklyBarChart.tsx
│       │
│       ├── insights/
│       │   ├── InsightsView.tsx
│       │   └── InsightBadge.tsx
│       │
│       ├── profile/
│       │   ├── ProfileView.tsx
│       │   └── TargetCard.tsx
│       │
│       └── shared/
│           ├── AddFoodModal.tsx
│           ├── Button.tsx
│           ├── Card.tsx
│           └── ProgressBar.tsx
│
├── api/
│   └── nutritrack/
│       └── analyze/
│           └── route.ts               # POST handler — Claude API proxy
│
lib/
├── nutritrack/
│   ├── models/
│   │   ├── index.ts                   # Re-exports all types
│   │   ├── user.ts
│   │   ├── food.ts
│   │   ├── chat.ts
│   │   └── insights.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNutriStore.ts           # Zustand store
│   │   ├── useFoodLog.ts
│   │   ├── useProfile.ts
│   │   ├── useInsights.ts
│   │   └── useChat.ts
│   │
│   ├── services/
│   │   ├── firebase-client.ts         # Firebase CLIENT SDK init (separate from portfolio's admin SDK)
│   │   ├── ai.ts                      # Client-side fetch to /api/nutritrack/analyze
│   │   └── nutrition.ts               # TDEE calc, target calc
│   │
│   ├── utils/
│   │   ├── dates.ts
│   │   ├── calculations.ts
│   │   ├── validators.ts
│   │   └── converters.ts
│   │
│   ├── constants/
│   │   ├── quickFoods.ts
│   │   ├── activityLevels.ts
│   │   └── prompts.ts
│   │
│   └── styles/
│       └── nutritrack.css             # @theme tokens + component styles
```

### Key architectural decisions

**Route group `(nutritrack)`**: The parentheses mean Next.js doesn't add "nutritrack" twice to the URL. The actual URL is just `/nutritrack`.

**`_components` directory**: The underscore prefix tells Next.js App Router this is NOT a route segment. It's a private folder for components.

**`lib/nutritrack/`**: Shared logic (types, hooks, utils) lives in `lib/` following Next.js conventions. This keeps it importable from both server components (layout) and client components.

**Two Firebase instances**: The portfolio already uses `firebase-admin` server-side. NutriTrack needs the `firebase` client SDK for Auth (sign-in popup) and Firestore realtime listeners. These are different packages — `firebase-client.ts` initializes the client SDK separately.

**API Route instead of Cloud Function**: Since the portfolio is on Vercel, we use a Next.js API Route (`app/api/nutritrack/analyze/route.ts`) instead of Firebase Cloud Functions. Same logic — auth verification, rate limiting, Claude API call — but deployed as a Vercel serverless function automatically. No separate `functions/` directory needed.

---

## 4. Tailwind v4 Integration

Tailwind v4 uses CSS-based configuration. No `tailwind.config.js` needed.

NutriTrack adds its design tokens via a CSS file that's imported in the NutriTrack layout:

```css
/* lib/nutritrack/styles/nutritrack.css */

@theme {
  --color-nt-bg: #FAFAF8;
  --color-nt-card: #FFFFFF;
  --color-nt-border: #ECECEC;
  --color-nt-text: #1A1A1A;
  --color-nt-text-soft: #8A8A8A;
  --color-nt-accent: #2D6A4F;
  --color-nt-accent-light: #D8F3DC;
  --color-nt-protein: #2D6A4F;
  --color-nt-carbs: #E9C46A;
  --color-nt-fat: #E76F51;
  --color-nt-danger: #DC3545;
  --color-nt-danger-light: #FDE8EA;
  --color-nt-chat-user: #E8F0E8;
  --color-nt-chat-ai: #F5F5F3;
}
```

Then use in components: `className="bg-nt-card text-nt-text border-nt-border"`.

This approach uses Tailwind v4's `@theme` directive to register custom colors. No prefix collision with the portfolio's existing Tailwind classes because all NutriTrack tokens start with `nt-`.

---

## 5. API Route Architecture (replaces Cloud Functions)

```
┌─────────────┐     POST /api/nutritrack/analyze     ┌──────────────────┐     HTTPS POST     ┌───────────────┐
│   Browser    │ ──────────────────────────────────► │  Next.js API     │ ─────────────────► │  Claude API   │
│  (ChatView)  │                                     │  Route Handler   │                    │  (Sonnet 4)   │
│              │ ◄────────────────────────────────── │                  │ ◄───────────────── │               │
│  FoodCard[]  │         JSON response               │  - Auth verify   │   JSON response    │  - Vision     │
│              │                                     │  - Rate limit    │                    │  - Text       │
└─────────────┘                                     │  - Input sanitize│                    └───────────────┘
                                                    │  - Key from env  │
                                                    └──────────────────┘
                                                    (Vercel serverless fn)
```

### Why API Route over Cloud Functions

1. **Already on Vercel** — API routes deploy automatically with the portfolio. No separate `firebase deploy --only functions`.
2. **Same codebase** — No separate `functions/` directory, `package.json`, or TypeScript config.
3. **Firebase Admin already installed** — The portfolio already has `firebase-admin` for Firestore. The API route can use it directly for auth token verification and rate limiting.
4. **Cold start** — Vercel serverless functions have comparable cold start to Firebase Cloud Functions.
5. **Simpler CI/CD** — One `git push` deploys everything.

---

## 6. Build Sequence (Iterative Phases)

### Phase 1 — Foundation (Day 1-2)
1. Install new dependencies (zustand, recharts, firebase client SDK)
2. Create all TypeScript models/types in `lib/nutritrack/models/`
3. Create `lib/nutritrack/services/firebase-client.ts` (client SDK init, separate from portfolio's admin SDK)
4. Create utility functions (calculations, dates, validators)
5. Create constants (quick foods, activity levels, prompts)
6. Set up Tailwind v4 theme tokens in `nutritrack.css`
7. Create the NutriTrack route (`app/(nutritrack)/nutritrack/page.tsx` + `layout.tsx`)

### Phase 2 — State & Auth (Day 3-4)
1. Create Zustand store (`lib/nutritrack/hooks/useNutriStore.ts`)
2. Create Firebase Auth hook (Google sign-in via client SDK)
3. Wire Firestore reads/writes for profile and food log
4. Build auth gate in `NutriTrackApp.tsx` (sign-in screen → app)

### Phase 3 — Core UI (Day 5-6)
1. Build AppShell + BottomNav with Framer Motion tab transitions
2. Build TodayView (calorie card, macro donut, food log)
3. Build AddFoodModal with Framer Motion enter/exit animation

### Phase 4 — AI Chat (Day 7-9)
1. Create API Route (`app/api/nutritrack/analyze/route.ts`)
2. Build client AI service (`lib/nutritrack/services/ai.ts`)
3. Build ChatView with all sub-components
4. Wire "Log" button to food log

### Phase 5 — Analytics (Day 10-11)
1. Build WeekView with Recharts bar chart
2. Build InsightsView with computed insights

### Phase 6 — Profile & Polish (Day 12-14)
1. Build ProfileView with live-updating targets
2. Loading states, error boundaries, empty states
3. Accessibility pass
4. Performance optimization (dynamic imports, memoization)
5. Firestore security rules
6. Deploy

---

## 7. Environment Variables

Add these to `.env.local` (and Vercel project settings):

```env
# ─── Existing (portfolio already has these) ───
# FIREBASE_ADMIN_* variables for firebase-admin (server-side)

# ─── New: Firebase Client SDK (for NutriTrack client-side auth + Firestore) ───
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# ─── New: Anthropic API (server-side only, no NEXT_PUBLIC_ prefix) ───
ANTHROPIC_API_KEY=sk-ant-...
```

The `NEXT_PUBLIC_` prefix makes Firebase client config available in the browser (it's not secret — Firebase client config is designed to be public). The `ANTHROPIC_API_KEY` has NO prefix, so it's server-side only.

---

## 8. Error Handling Strategy

| Error Type | Handling |
|-----------|---------|
| Network offline | Show cached Firestore data, disable AI chat, show "offline" badge |
| AI API failure | Show friendly error in chat, offer retry |
| AI returns invalid JSON | Retry once with stricter prompt, then show error |
| Firebase auth expired | Silent token refresh (client SDK handles this automatically) |
| Firestore write failure | Optimistic UI rollback + toast notification |
| Image too large (>5MB) | Client-side resize before upload, show size warning |
| Rate limit exceeded | Show "slow down" message with cooldown timer |
| Vercel function timeout (10s default) | Increase to 30s in route config, show timeout error if exceeded |

---

## 9. Security Checklist

- [ ] `ANTHROPIC_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix)
- [ ] API route verifies Firebase ID token on every request (using `firebase-admin` `auth().verifyIdToken()`)
- [ ] Firestore rules enforce `request.auth.uid == resource.data.userId` on all reads/writes
- [ ] Image uploads validated for type (JPEG/PNG/WebP only) and size (<5MB)
- [ ] AI system prompt is server-side only (in API route), not sent from client
- [ ] Rate limiting: 30 AI requests/user/hour (Firestore-backed counter)
- [ ] No PII sent to Claude — only food descriptions and images
- [ ] API route only accepts POST requests
- [ ] Input sanitization: text length capped at 1000 chars, image at 5MB base64
