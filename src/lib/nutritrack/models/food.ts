/**
 * Macronutrient data. All values in grams except calories (kcal).
 * These fields are REQUIRED on every food entry.
 */
export interface Macronutrients {
  /** Energy in kilocalories. Range: 0-5000. */
  calories: number;
  /** Protein in grams. Range: 0-500. */
  proteinG: number;
  /** Carbohydrates in grams. Range: 0-500. */
  carbsG: number;
  /** Fat in grams. Range: 0-500. */
  fatG: number;
}

/**
 * Micronutrient data. All optional — populated by AI analysis.
 * Vitamins/minerals are % of daily value (0-100+).
 * Fiber/sugar/sodium are absolute values.
 */
export interface Micronutrients {
  /** Dietary fiber in grams. */
  fiberG?: number;
  /** Sugar in grams. */
  sugarG?: number;
  /** Sodium in milligrams. */
  sodiumMg?: number;
  /** Vitamin A as % of daily value. */
  vitaminAPct?: number;
  /** Vitamin C as % of daily value. */
  vitaminCPct?: number;
  /** Calcium as % of daily value. */
  calciumPct?: number;
  /** Iron as % of daily value. */
  ironPct?: number;
  /** Potassium in milligrams. */
  potassiumMg?: number;
  /** Cholesterol in milligrams. */
  cholesterolMg?: number;
}

/**
 * Full nutrition data combining macros and micros.
 */
export interface NutritionData extends Macronutrients {
  /** Optional micronutrient breakdown. */
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
  /** Firestore document ID. */
  id: string;
  /** Firebase Auth UID of the owner. */
  userId: string;

  /** Display name of the food item. */
  name: string;
  /** Full nutrition data (macros + optional micros). */
  nutrition: NutritionData;
  /** Which meal this entry belongs to. */
  mealType: MealType;

  /** How this entry was created. */
  source: FoodEntrySource;
  /** Date key in 'YYYY-MM-DD' format. */
  dateKey: string;
  /** Timestamp when the user logged this entry. */
  loggedAt: Date;

  /** AI confidence score (0-1), if AI-sourced. */
  aiConfidence?: number;
  /** Raw AI response text, for debugging. */
  aiRawResponse?: string;
  /** URL of the uploaded food image, if any. */
  imageUrl?: string;

  /** Firestore Timestamp — when the entry was created. */
  createdAt: Date;
  /** Firestore Timestamp — when the entry was last updated. */
  updatedAt: Date;
}

/**
 * A preset/favorite food for quick logging.
 * Stored in Firestore at /users/{uid}/quickFoods/{foodId}.
 */
export interface QuickFood {
  /** Firestore document ID. */
  id: string;
  /** Display name of the food. */
  name: string;
  /** Nutrition data for this preset food. */
  nutrition: NutritionData;
  /** Number of times this food has been logged. */
  usageCount: number;
  /** Timestamp of the last time this food was logged. */
  lastUsedAt?: Date;
  /** Whether this is a built-in preset (vs user-created). */
  isBuiltIn: boolean;
  /** Firestore Timestamp — when this preset was created. */
  createdAt: Date;
}
