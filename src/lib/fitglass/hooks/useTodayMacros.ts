'use client';

import { useMemo } from 'react';
import { useFitGlassStore } from './useFitGlassStore';
import type { FoodEntry } from '../models';

/** Pure function to compute macro totals from food entries. */
export function computeMacroTotals(entries: Pick<FoodEntry, 'nutrition'>[]) {
  const consumed = Math.round(
    entries.reduce((sum, e) => sum + e.nutrition.calories, 0),
  );
  const proteinG = Math.round(
    entries.reduce((sum, e) => sum + e.nutrition.proteinG, 0),
  );
  const carbsG = Math.round(
    entries.reduce((sum, e) => sum + e.nutrition.carbsG, 0),
  );
  const fatG = Math.round(
    entries.reduce((sum, e) => sum + e.nutrition.fatG, 0),
  );

  return { consumed, proteinG, carbsG, fatG };
}

export function useTodayMacros() {
  const todayEntries = useFitGlassStore((s) => s.todayEntries);

  return useMemo(() => computeMacroTotals(todayEntries), [todayEntries]);
}
