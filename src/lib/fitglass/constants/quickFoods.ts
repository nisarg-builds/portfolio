import type { QuickFood } from '../models';

/** Built-in preset foods for quick logging. */
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
