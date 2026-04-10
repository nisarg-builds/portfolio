# FitGlass — Utilities, Calculations & Constants

> All business logic, formulas, preset data, and helper functions.
> Files live in `lib/fitglass/utils/` and `lib/fitglass/constants/`.
> These are pure functions with no framework dependencies — usable from both client and server.

---

## 1. Nutrition Calculations

### 1.1 BMR — Mifflin-St Jeor Equation

```typescript
// lib/fitglass/utils/calculations.ts

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation.
 *
 * Male:   BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 * Female: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

/**
 * Calculate Total Daily Energy Expenditure.
 * TDEE = BMR × activity multiplier.
 */
export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityMultiplier: number,
): number {
  return Math.round(calculateBMR(weightKg, heightCm, age, gender) * activityMultiplier);
}

/**
 * Calculate daily calorie target based on goal.
 *
 * Fat loss:     TDEE - (goalRate × 7700 / 7)  — floor 1200 kcal
 * Muscle gain:  TDEE + (goalRate × 7700 / 7 × 0.5)  — cap surplus at 500
 * Maintenance:  TDEE
 */
export function calculateDailyTarget(
  tdee: number,
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance',
  goalRateKgPerWeek: number,
): number {
  switch (goal) {
    case 'fat_loss': {
      const deficit = Math.round((goalRateKgPerWeek * 7700) / 7);
      return Math.max(1200, tdee - deficit);
    }
    case 'muscle_gain': {
      const surplus = Math.round((goalRateKgPerWeek * 7700) / 7 * 0.5);
      return tdee + Math.min(surplus, 500);
    }
    case 'maintenance':
      return tdee;
  }
}

/**
 * Calculate recommended macro targets.
 *
 * Protein: 1.8g/kg (high for muscle preservation)
 * Fat:     0.8g/kg (minimum for hormonal health)
 * Carbs:   remaining calories
 */
export function calculateMacroTargets(
  dailyCalorieTarget: number,
  weightKg: number,
): { proteinG: number; fatG: number; carbsG: number } {
  const proteinG = Math.round(weightKg * 1.8);
  const fatG = Math.round(weightKg * 0.8);
  const proteinCals = proteinG * 4;
  const fatCals = fatG * 9;
  const carbsCals = Math.max(0, dailyCalorieTarget - proteinCals - fatCals);
  const carbsG = Math.round(carbsCals / 4);

  return { proteinG, fatG, carbsG };
}

/**
 * Compute all targets from a profile. Single entry point for the UI.
 */
export function computeAllTargets(profile: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
  activityMultiplier: number;
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance';
  goalRateKgPerWeek: number;
}) {
  const bmr = calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.gender);
  const tdee = Math.round(bmr * profile.activityMultiplier);
  const dailyCalorieTarget = calculateDailyTarget(tdee, profile.goal, profile.goalRateKgPerWeek);
  const dailyDeficit = tdee - dailyCalorieTarget;
  const macros = calculateMacroTargets(dailyCalorieTarget, profile.weightKg);

  return {
    bmr,
    tdee,
    dailyCalorieTarget,
    dailyDeficit,
    proteinTargetG: macros.proteinG,
    fatMinG: macros.fatG,
    carbsRemainingG: macros.carbsG,
  };
}
```

### 1.2 Unit Tests

```typescript
// lib/fitglass/utils/__tests__/calculations.test.ts

import { calculateBMR, calculateTDEE, calculateDailyTarget } from '../calculations';

describe('calculateBMR', () => {
  it('calculates correctly for a 80kg, 175cm, 25yo male', () => {
    expect(calculateBMR(80, 175, 25, 'male')).toBe(1774);
  });

  it('calculates correctly for a 60kg, 165cm, 30yo female', () => {
    expect(calculateBMR(60, 165, 30, 'female')).toBe(1320);
  });
});

describe('calculateDailyTarget', () => {
  it('applies correct deficit for fat loss', () => {
    expect(calculateDailyTarget(2500, 'fat_loss', 0.5)).toBe(1950);
  });

  it('enforces 1200 kcal floor', () => {
    expect(calculateDailyTarget(1400, 'fat_loss', 1.0)).toBe(1200);
  });

  it('returns TDEE for maintenance', () => {
    expect(calculateDailyTarget(2200, 'maintenance', 0)).toBe(2200);
  });

  it('applies halved surplus for muscle gain', () => {
    expect(calculateDailyTarget(2500, 'muscle_gain', 0.5)).toBe(2775);
  });

  it('caps muscle gain surplus at 500', () => {
    expect(calculateDailyTarget(2500, 'muscle_gain', 1.0)).toBe(3000);
  });
});
```

---

## 2. Date Utilities

```typescript
// lib/fitglass/utils/dates.ts

/** Get a date key string in YYYY-MM-DD format (local timezone). */
export function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Format a date key for display. '2026-04-08' → 'Wed, Apr 8' */
export function formatDateKey(dateKey: string): string {
  const date = new Date(dateKey + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Get date keys for the last N days (including today). Oldest first. */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(getDateKey(d));
  }
  return days;
}

/** Check if a date key is today. */
export function isToday(dateKey: string): boolean {
  return dateKey === getDateKey();
}
```

---

## 3. Input Validators

```typescript
// lib/fitglass/utils/validators.ts

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateProfile(profile: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: string;
  goalRateKgPerWeek: number;
}): ValidationResult {
  const errors: string[] = [];

  if (!profile.weightKg || profile.weightKg < 30 || profile.weightKg > 300)
    errors.push('Weight must be between 30 and 300 kg');
  if (!profile.heightCm || profile.heightCm < 100 || profile.heightCm > 250)
    errors.push('Height must be between 100 and 250 cm');
  if (!profile.age || profile.age < 13 || profile.age > 120)
    errors.push('Age must be between 13 and 120');
  if (!['male', 'female'].includes(profile.gender))
    errors.push('Gender must be male or female');
  if (!profile.goalRateKgPerWeek || profile.goalRateKgPerWeek < 0.1 || profile.goalRateKgPerWeek > 1.0)
    errors.push('Goal rate must be between 0.1 and 1.0 kg/week');

  return { valid: errors.length === 0, errors };
}

export function validateFoodEntry(entry: {
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}): ValidationResult {
  const errors: string[] = [];

  if (!entry.name || entry.name.trim().length === 0) errors.push('Food name is required');
  if (entry.name && entry.name.length > 200) errors.push('Food name must be under 200 characters');
  if (entry.calories < 0 || entry.calories > 5000) errors.push('Calories must be between 0 and 5000');
  if (entry.proteinG < 0 || entry.proteinG > 500) errors.push('Protein must be between 0 and 500g');
  if (entry.carbsG < 0 || entry.carbsG > 500) errors.push('Carbs must be between 0 and 500g');
  if (entry.fatG < 0 || entry.fatG > 500) errors.push('Fat must be between 0 and 500g');

  return { valid: errors.length === 0, errors };
}
```

---

## 4. Constants

### 4.1 Activity Levels

```typescript
// lib/fitglass/constants/activityLevels.ts

import type { ActivityLevel } from '../models/user';

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { id: 'sedentary', label: 'Sedentary', multiplier: 1.2 },
  { id: 'light', label: 'Light activity', multiplier: 1.375 },
  { id: 'moderate', label: 'Moderate', multiplier: 1.55 },
  { id: 'very_active', label: 'Very active', multiplier: 1.725 },
];

export function getActivityLevel(id: string): ActivityLevel {
  return ACTIVITY_LEVELS.find((a) => a.id === id) ?? ACTIVITY_LEVELS[0];
}
```

### 4.2 Preset Quick Foods

```typescript
// lib/fitglass/constants/quickFoods.ts

import type { QuickFood } from '../models/food';

export const PRESET_QUICK_FOODS: Omit<QuickFood, 'id' | 'createdAt' | 'lastUsedAt'>[] = [
  { name: 'Chicken breast (150g)', nutrition: { calories: 248, proteinG: 46, carbsG: 0, fatG: 5 }, usageCount: 0, isBuiltIn: true },
  { name: 'Rice (1 cup cooked)', nutrition: { calories: 206, proteinG: 4, carbsG: 45, fatG: 0.4 }, usageCount: 0, isBuiltIn: true },
  { name: 'Eggs (2 large)', nutrition: { calories: 156, proteinG: 12, carbsG: 1, fatG: 11 }, usageCount: 0, isBuiltIn: true },
  { name: 'Banana', nutrition: { calories: 105, proteinG: 1.3, carbsG: 27, fatG: 0.4 }, usageCount: 0, isBuiltIn: true },
  { name: 'Oatmeal (1 cup)', nutrition: { calories: 154, proteinG: 5, carbsG: 27, fatG: 2.6 }, usageCount: 0, isBuiltIn: true },
  { name: 'Greek yogurt (170g)', nutrition: { calories: 100, proteinG: 17, carbsG: 6, fatG: 0.7 }, usageCount: 0, isBuiltIn: true },
  { name: 'Almonds (28g)', nutrition: { calories: 164, proteinG: 6, carbsG: 6, fatG: 14 }, usageCount: 0, isBuiltIn: true },
  { name: 'Salmon (150g)', nutrition: { calories: 312, proteinG: 34, carbsG: 0, fatG: 18 }, usageCount: 0, isBuiltIn: true },
  { name: 'Avocado (half)', nutrition: { calories: 161, proteinG: 2, carbsG: 9, fatG: 15 }, usageCount: 0, isBuiltIn: true },
  { name: 'Sweet potato (medium)', nutrition: { calories: 103, proteinG: 2, carbsG: 24, fatG: 0.1 }, usageCount: 0, isBuiltIn: true },
  { name: 'Bread (2 slices)', nutrition: { calories: 160, proteinG: 6, carbsG: 30, fatG: 2 }, usageCount: 0, isBuiltIn: true },
  { name: 'Protein shake', nutrition: { calories: 130, proteinG: 25, carbsG: 3, fatG: 2 }, usageCount: 0, isBuiltIn: true },
  { name: 'Dal (1 cup)', nutrition: { calories: 230, proteinG: 14, carbsG: 34, fatG: 4 }, usageCount: 0, isBuiltIn: true },
  { name: 'Paneer (100g)', nutrition: { calories: 265, proteinG: 18, carbsG: 4, fatG: 20 }, usageCount: 0, isBuiltIn: true },
  { name: 'Roti (1 piece)', nutrition: { calories: 104, proteinG: 3, carbsG: 18, fatG: 3 }, usageCount: 0, isBuiltIn: true },
];
```

### 4.3 AI System Prompt

```typescript
// lib/fitglass/constants/prompts.ts

/**
 * System prompt for Claude food analysis.
 * The actual prompt used at runtime is in the API route (app/api/fitglass/analyze/route.ts).
 * This copy is for reference and local testing.
 */
export const FOOD_ANALYSIS_SYSTEM_PROMPT = `You are a nutrition analysis assistant. Your job is to identify foods and estimate their nutritional content accurately.

When the user describes food or shows you an image of food:
1. Identify each distinct food item
2. Estimate reasonable portion sizes based on typical servings
3. Provide nutritional breakdown per item

You MUST respond ONLY with valid JSON. No markdown, no backticks, no preamble, no explanation outside the JSON.

Use this exact schema:
{
  "message": "A brief friendly comment about the food (1-2 sentences max)",
  "foods": [
    {
      "name": "Food item name with estimated portion size",
      "cal": 250,
      "protein": 20,
      "carbs": 10,
      "fat": 12,
      "fiber": 3,
      "sugar": 2,
      "sodium": 400,
      "vitaminA": 10,
      "vitaminC": 15,
      "calcium": 8,
      "iron": 12
    }
  ]
}

Field rules:
- "cal" = kilocalories (integer)
- "protein", "carbs", "fat", "fiber", "sugar" = grams (1 decimal max)
- "sodium" = milligrams (integer)
- "vitaminA", "vitaminC", "calcium", "iron" = percentage of daily value, 0-100 (integer)
- All numeric fields must be numbers, never strings
- If you cannot identify a food, return { "message": "explanation", "foods": [] }
- If multiple items visible, list each separately
- ONLY output the JSON object. Nothing else.`;
```

---

## 5. Insight Generation Logic

```typescript
// lib/fitglass/hooks/useInsights.ts (logic portion)

import type { Insight, WeeklyStats, DaySummary } from '../models/insights';
import type { ComputedTargets } from '../models/user';
import type { FoodEntry } from '../models/food';
import { getLastNDays } from '../utils/dates';

export function computeWeeklyStats(
  weekEntries: Record<string, FoodEntry[]>,
  dailyTarget: number,
  tdee: number,
): WeeklyStats {
  const dateKeys = getLastNDays(7);

  const days: DaySummary[] = dateKeys.map((dateKey) => {
    const entries = weekEntries[dateKey] || [];
    const totalCalories = entries.reduce((s, e) => s + e.nutrition.calories, 0);
    const totalProteinG = entries.reduce((s, e) => s + e.nutrition.proteinG, 0);
    const totalCarbsG = entries.reduce((s, e) => s + e.nutrition.carbsG, 0);
    const totalFatG = entries.reduce((s, e) => s + e.nutrition.fatG, 0);

    return {
      dateKey,
      totalCalories,
      totalProteinG,
      totalCarbsG,
      totalFatG,
      entryCount: entries.length,
      isOnTarget: entries.length > 0 && Math.abs(totalCalories - dailyTarget) <= 100,
    };
  });

  const daysLogged = days.filter((d) => d.entryCount > 0).length;
  const daysOnTarget = days.filter((d) => d.isOnTarget).length;
  const avgCalories = Math.round(days.reduce((s, d) => s + d.totalCalories, 0) / 7);
  const weeklyDeficit = days.reduce((s, d) => s + (tdee - d.totalCalories), 0);

  return {
    days,
    avgCalories,
    avgProteinG: Math.round(days.reduce((s, d) => s + d.totalProteinG, 0) / 7),
    avgCarbsG: Math.round(days.reduce((s, d) => s + d.totalCarbsG, 0) / 7),
    avgFatG: Math.round(days.reduce((s, d) => s + d.totalFatG, 0) / 7),
    daysOnTarget,
    daysLogged,
    weeklyDeficit,
    projectedWeightChangeKg: Math.round((weeklyDeficit / 7700) * 100) / 100,
  };
}

export function generateInsights(
  todayCalories: number,
  todayProteinG: number,
  targets: ComputedTargets,
  weeklyStats: WeeklyStats,
  goal: 'fat_loss' | 'muscle_gain' | 'maintenance',
): Insight[] {
  const insights: Insight[] = [];
  const remaining = targets.dailyCalorieTarget - todayCalories;

  if (todayCalories === 0) {
    insights.push({ id: 'no-data', type: 'info', title: 'Get started', message: 'Start logging your meals to get personalized insights.' });
    return insights;
  }

  if (remaining > 0) {
    insights.push({ id: 'on-track', type: 'good', title: 'On track', message: `You have ${remaining} kcal remaining today. You're on track.`, metric: remaining, unit: 'kcal' });
  } else {
    insights.push({ id: 'over-target', type: 'warning', title: 'Over target', message: `You're ${Math.abs(remaining)} kcal over your target today.`, metric: Math.abs(remaining), unit: 'kcal' });
  }

  const proteinTarget = targets.proteinTargetG;
  if (todayProteinG < proteinTarget * 0.7) {
    insights.push({ id: 'low-protein', type: 'warning', title: 'Low protein', message: `Protein is low (${todayProteinG}g). Aim for ~${proteinTarget}g to preserve muscle${goal === 'fat_loss' ? ' during fat loss' : ''}.`, metric: todayProteinG, unit: 'g' });
  } else if (todayProteinG >= proteinTarget) {
    insights.push({ id: 'good-protein', type: 'good', title: 'Great protein', message: `Great protein intake (${todayProteinG}g). This helps preserve muscle mass.`, metric: todayProteinG, unit: 'g' });
  }

  if (weeklyStats.avgCalories > 0 && weeklyStats.weeklyDeficit > 0) {
    insights.push({ id: 'weekly-projection', type: 'info', title: 'Weekly pace', message: `Based on this week, you're on pace to lose ~${weeklyStats.projectedWeightChangeKg} kg/week.`, metric: weeklyStats.projectedWeightChangeKg, unit: 'kg/week' });
  }

  if (weeklyStats.daysOnTarget >= 5) {
    insights.push({ id: 'strong-consistency', type: 'good', title: 'Consistent', message: `Strong consistency — ${weeklyStats.daysOnTarget}/7 days on target this week.`, metric: weeklyStats.daysOnTarget, unit: 'days' });
  } else if (weeklyStats.daysOnTarget >= 3) {
    insights.push({ id: 'moderate-consistency', type: 'info', title: 'Building habits', message: `${weeklyStats.daysOnTarget}/7 days on target. Consistency is key for ${goal === 'fat_loss' ? 'fat loss' : 'your goals'}.`, metric: weeklyStats.daysOnTarget, unit: 'days' });
  }

  return insights;
}
```
