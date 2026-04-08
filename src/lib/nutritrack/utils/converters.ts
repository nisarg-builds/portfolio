import type { AIFoodItem, FoodEntry, NutritionData, MealType } from '../models';
import { getDateKey } from './dates';

/** Convert an AI food item to NutritionData with optional micros. */
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

/** Infer meal type from the current hour of the day. */
export function inferMealType(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 15) return 'lunch';
  if (hour < 18) return 'snack';
  return 'dinner';
}

/** Convert an AI food item to a FoodEntry (without id/createdAt/updatedAt). */
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
