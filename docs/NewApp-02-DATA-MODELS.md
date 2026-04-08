# NutriTrack — Data Models & Firebase Schema

> All TypeScript types, Firestore document structures, and validation rules.
> Types live in `lib/nutritrack/models/`. Used by both client components and server API routes.

---

## 1. TypeScript Models

### 1.1 User Profile

```typescript
// lib/nutritrack/models/user.ts

/**
 * Supported fitness goals.
 * Determines calorie target calculation (surplus vs deficit vs maintenance).
 */
export type FitnessGoal = 'fat_loss' | 'muscle_gain' | 'maintenance';

/**
 * Gender for BMR calculation (Mifflin-St Jeor equation).
 * Affects the +5 / -161 constant.
 */
export type Gender = 'male' | 'female';

/**
 * Activity level multiplier applied to BMR to get TDEE.
 * Based on the Harris-Benedict revised activity factors.
 */
export interface ActivityLevel {
  id: string;            // e.g., 'sedentary', 'light', 'moderate', 'very_active'
  label: string;         // e.g., 'Sedentary (desk job, little exercise)'
  multiplier: number;    // e.g., 1.2, 1.375, 1.55, 1.725
}

/**
 * Core user profile. Stored in Firestore at /users/{uid}/profile/main.
 *
 * All measurements are metric (kg, cm). The UI can offer imperial input
 * but must convert before storing.
 */
export interface UserProfile {
  // ─── Identity ───
  userId: string;             // Firebase Auth UID
  displayName: string;        // From Firebase Auth or user-provided
  email: string;              // From Firebase Auth

  // ─── Body metrics ───
  weightKg: number;           // Current weight in kg. Range: 30–300.
  heightCm: number;           // Height in cm. Range: 100–250.
  age: number;                // Age in years. Range: 13–120.
  gender: Gender;

  // ─── Goals ───
  goal: FitnessGoal;
  activityLevelId: string;    // References an ActivityLevel.id
  goalRateKgPerWeek: number;  // Target weight change rate. Range: 0.1–1.0.

  // ─── Preferences ───
  preferredUnits: 'metric' | 'imperial';  // UI display only, storage always metric

  // ─── Metadata ───
  createdAt: Date;            // Firestore Timestamp
  updatedAt: Date;            // Firestore Timestamp
}

/**
 * Computed targets derived from UserProfile.
 * NOT stored in Firestore — calculated on the client.
 */
export interface ComputedTargets {
  bmr: number;                // Basal Metabolic Rate (kcal)
  tdee: number;               // Total Daily Energy Expenditure (kcal)
  dailyCalorieTarget: number; // TDEE adjusted for goal (kcal)
  dailyDeficit: number;       // Difference between TDEE and target (kcal)
  proteinTargetG: number;     // ~1.8g per kg bodyweight
  fatMinG: number;            // ~0.8g per kg bodyweight (floor)
  carbsRemainingG: number;    // Remaining calories allocated to carbs
}
```

### 1.2 Food Entry

```typescript
// lib/nutritrack/models/food.ts

/**
 * Macronutrient data. All values in grams except calories (kcal).
 * These fields are REQUIRED on every food entry.
 */
export interface Macronutrients {
  calories: number;       // kcal. Range: 0–5000.
  proteinG: number;       // grams. Range: 0–500.
  carbsG: number;         // grams. Range: 0–500.
  fatG: number;           // grams. Range: 0–500.
}

/**
 * Micronutrient data. All optional — populated by AI analysis.
 * Vitamins/minerals are % of daily value (0–100+).
 * Fiber/sugar/sodium are absolute values.
 */
export interface Micronutrients {
  fiberG?: number;
  sugarG?: number;
  sodiumMg?: number;
  vitaminAPct?: number;
  vitaminCPct?: number;
  calciumPct?: number;
  ironPct?: number;
  potassiumMg?: number;
  cholesterolMg?: number;
}

/**
 * Full nutrition data combining macros and micros.
 */
export interface NutritionData extends Macronutrients {
  micros?: Micronutrients;
}

/**
 * Source of the food entry — how it was logged.
 */
export type FoodEntrySource =
  | 'manual'
  | 'quick_add'
  | 'ai_text'
  | 'ai_image'
  | 'ai_text_image';

/**
 * Meal category for organization.
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

/**
 * A single food entry in the daily log.
 * Stored in Firestore at /users/{uid}/foodLog/{entryId}.
 */
export interface FoodEntry {
  id: string;
  userId: string;

  name: string;
  nutrition: NutritionData;
  mealType: MealType;

  source: FoodEntrySource;
  dateKey: string;         // 'YYYY-MM-DD'
  loggedAt: Date;

  aiConfidence?: number;
  aiRawResponse?: string;
  imageUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * A preset/favorite food for quick logging.
 * Stored in Firestore at /users/{uid}/quickFoods/{foodId}.
 */
export interface QuickFood {
  id: string;
  name: string;
  nutrition: NutritionData;
  usageCount: number;
  lastUsedAt?: Date;
  isBuiltIn: boolean;
  createdAt: Date;
}
```

### 1.3 Chat

```typescript
// lib/nutritrack/models/chat.ts

/**
 * A single food item returned by the AI analysis.
 */
export interface AIFoodItem {
  name: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
}

/**
 * The full response from the AI food analysis endpoint.
 */
export interface AIFoodResponse {
  message: string;
  foods: AIFoodItem[];
}

/**
 * A single message in the chat interface.
 * Chat messages are ephemeral (session-only) — NOT persisted to Firestore.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;

  imageDataUrl?: string;
  imageFile?: File;

  foods?: AIFoodItem[];
  isLoading?: boolean;
  isError?: boolean;
}

/**
 * Request body sent to POST /api/nutritrack/analyze.
 */
export interface AnalyzeFoodRequest {
  text?: string;
  imageBase64?: string;
  imageMediaType?: 'image/jpeg' | 'image/png' | 'image/webp';
}

/**
 * Response body from POST /api/nutritrack/analyze.
 */
export interface AnalyzeFoodResponse {
  success: boolean;
  data?: AIFoodResponse;
  error?: string;
  rateLimitRemaining?: number;
}
```

### 1.4 Insights

```typescript
// lib/nutritrack/models/insights.ts

export type InsightType = 'good' | 'warning' | 'info';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  message: string;
  metric?: number;
  unit?: string;
}

export interface WeeklyStats {
  days: DaySummary[];
  avgCalories: number;
  avgProteinG: number;
  avgCarbsG: number;
  avgFatG: number;
  daysOnTarget: number;
  daysLogged: number;
  weeklyDeficit: number;
  projectedWeightChangeKg: number;
}

export interface DaySummary {
  dateKey: string;
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  entryCount: number;
  isOnTarget: boolean;
}
```

### 1.5 Zustand Store Shape

```typescript
// lib/nutritrack/hooks/useNutriStore.ts

import type { UserProfile, FoodEntry, QuickFood, ChatMessage, ComputedTargets } from '../models';

export interface NutriState {
  // ─── Auth ───
  user: { uid: string; email: string; displayName: string } | null;
  authLoading: boolean;

  // ─── Profile ───
  profile: UserProfile | null;
  targets: ComputedTargets | null;

  // ─── Food Log ───
  todayEntries: FoodEntry[];
  weekEntries: Record<string, FoodEntry[]>;
  isLoadingEntries: boolean;

  // ─── Quick Foods ───
  quickFoods: QuickFood[];

  // ─── Chat ───
  chatMessages: ChatMessage[];
  isChatLoading: boolean;

  // ─── Active View ───
  activeView: 'today' | 'chat' | 'week' | 'insights' | 'profile';

  // ─── Actions ───
  setUser: (user: NutriState['user']) => void;
  setProfile: (profile: UserProfile) => void;
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  removeFoodEntry: (entryId: string) => Promise<void>;
  addChatMessage: (message: ChatMessage) => void;
  analyzeFood: (text?: string, imageBase64?: string, mediaType?: string) => Promise<void>;
  setActiveView: (view: NutriState['activeView']) => void;
  loadTodayEntries: () => Promise<void>;
  loadWeekEntries: () => Promise<void>;
}
```

---

## 2. Firestore Schema

### 2.1 Collection Structure

The portfolio already uses Firebase Admin for Firestore. NutriTrack adds these collections:

```
firestore/
├── users/
│   └── {uid}/
│       ├── profile/
│       │   └── main                    ← UserProfile document
│       │
│       ├── foodLog/
│       │   ├── {entryId}               ← FoodEntry document
│       │   └── ...
│       │
│       └── quickFoods/
│           ├── {foodId}                ← QuickFood document
│           └── ...
│
├── rateLimits/                         ← Rate limiting (API route writes here via admin SDK)
│   └── {uid}                           ← { count: number, windowStart: number }
```

### 2.2 Indexing Strategy

```json
// firestore.indexes.json — merge with existing if portfolio has one
{
  "indexes": [
    {
      "collectionGroup": "foodLog",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "dateKey", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "foodLog",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "loggedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "quickFoods",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "usageCount", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### 2.3 Security Rules

```javascript
// firestore.rules — merge with existing portfolio rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isValidProfile(data) {
      return data.weightKg is number && data.weightKg >= 30 && data.weightKg <= 300
          && data.heightCm is number && data.heightCm >= 100 && data.heightCm <= 250
          && data.age is number && data.age >= 13 && data.age <= 120
          && data.gender in ['male', 'female']
          && data.goal in ['fat_loss', 'muscle_gain', 'maintenance']
          && data.goalRateKgPerWeek is number
          && data.goalRateKgPerWeek >= 0.1
          && data.goalRateKgPerWeek <= 1.0;
    }

    function isValidFoodEntry(data) {
      return data.name is string && data.name.size() > 0 && data.name.size() <= 200
          && data.nutrition.calories is number && data.nutrition.calories >= 0
          && data.nutrition.proteinG is number && data.nutrition.proteinG >= 0
          && data.nutrition.carbsG is number && data.nutrition.carbsG >= 0
          && data.nutrition.fatG is number && data.nutrition.fatG >= 0
          && data.dateKey is string && data.dateKey.matches('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')
          && data.mealType in ['breakfast', 'lunch', 'dinner', 'snack']
          && data.source in ['manual', 'quick_add', 'ai_text', 'ai_image', 'ai_text_image'];
    }

    // ─── NutriTrack: User profile ───
    match /users/{userId}/profile/{docId} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId) && isValidProfile(request.resource.data);
      allow update: if isOwner(userId) && isValidProfile(request.resource.data);
      allow delete: if isOwner(userId);
    }

    // ─── NutriTrack: Food log ───
    match /users/{userId}/foodLog/{entryId} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId)
                    && request.resource.data.userId == userId
                    && isValidFoodEntry(request.resource.data);
      allow update: if isOwner(userId) && resource.data.userId == userId;
      allow delete: if isOwner(userId);
    }

    // ─── NutriTrack: Quick foods ───
    match /users/{userId}/quickFoods/{foodId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
    }

    // ─── NutriTrack: Rate limits (server-only, no client access) ───
    match /rateLimits/{uid} {
      allow read, write: if false;  // Only admin SDK can access
    }

    // ─── Keep existing portfolio rules below ───
    // ...
  }
}
```

---

## 3. Data Flow: AI Chat → Food Log

```
1. User types "chicken tikka masala with naan" in ChatInput
2. ChatView creates a ChatMessage { role: 'user', text: '...' }
3. useChat.analyzeFood() is called:
   a. Client sends POST to /api/nutritrack/analyze with { text: '...' }
      — includes Firebase ID token in Authorization header
   b. API route verifies ID token using firebase-admin auth().verifyIdToken()
   c. API route checks rate limit (Firestore counter via admin SDK)
   d. API route calls Claude API with system prompt + user content
   e. Claude returns JSON: { message: '...', foods: [...] }
   f. API route validates JSON matches AIFoodResponse schema
   g. API route returns validated response to client
4. ChatView creates a ChatMessage { role: 'assistant', foods: [...] }
5. User taps "+ Log" on a FoodCard
6. FoodCard calls handleFoodLogFromChat(food: AIFoodItem)
7. This converts AIFoodItem → FoodEntry (see converters.ts)
8. useFoodLog.addFoodEntry() writes to Firestore via client SDK
9. Zustand store updates todayEntries (optimistic)
10. Confirmation message appears in chat
```

---

## 4. Validation Rules Summary

| Field | Type | Min | Max | Required | Notes |
|-------|------|-----|-----|----------|-------|
| `name` | string | 1 char | 200 chars | Yes | Trimmed, no empty |
| `calories` | number | 0 | 5000 | Yes | Integer preferred |
| `proteinG` | number | 0 | 500 | Yes | 1 decimal max |
| `carbsG` | number | 0 | 500 | Yes | 1 decimal max |
| `fatG` | number | 0 | 500 | Yes | 1 decimal max |
| `weightKg` | number | 30 | 300 | Yes | 1 decimal max |
| `heightCm` | number | 100 | 250 | Yes | Integer |
| `age` | number | 13 | 120 | Yes | Integer |
| `goalRateKgPerWeek` | number | 0.1 | 1.0 | Yes | Step 0.05 |
| `dateKey` | string | — | — | Yes | Format: YYYY-MM-DD |
| `imageBase64` | string | — | 5MB | No | JPEG/PNG/WebP only |

---

## 5. Converter Functions

```typescript
// lib/nutritrack/utils/converters.ts

import type { AIFoodItem, FoodEntry, NutritionData, MealType } from '../models';
import { getDateKey } from './dates';

export function aiItemToNutrition(item: AIFoodItem): NutritionData {
  return {
    calories: Math.round(item.cal),
    proteinG: Math.round(item.protein * 10) / 10,
    carbsG: Math.round(item.carbs * 10) / 10,
    fatG: Math.round(item.fat * 10) / 10,
    micros: {
      fiberG: item.fiber ?? undefined,
      sugarG: item.sugar ?? undefined,
      sodiumMg: item.sodium ?? undefined,
      vitaminAPct: item.vitaminA ?? undefined,
      vitaminCPct: item.vitaminC ?? undefined,
      calciumPct: item.calcium ?? undefined,
      ironPct: item.iron ?? undefined,
    },
  };
}

export function inferMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 18) return 'snack';
  return 'dinner';
}

export function aiItemToFoodEntry(
  item: AIFoodItem,
  userId: string,
  source: 'ai_text' | 'ai_image' | 'ai_text_image',
): Omit<FoodEntry, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    userId,
    name: item.name,
    nutrition: aiItemToNutrition(item),
    mealType: inferMealType(),
    source,
    dateKey: getDateKey(),
    loggedAt: new Date(),
  };
}
```
