'use client';

import { useEffect, useCallback } from 'react';
import { onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { getFoodLogCollection } from '../services/firebase-client';
import { useNutriStore } from './useNutriStore';
import { useAuth } from './useAuth';
import { validateFoodEntry } from '../utils/validators';
import { getDateKey } from '../utils/dates';
import type { FoodEntry } from '../models';

export function useFoodLog() {
  const { user } = useAuth();
  const todayEntries = useNutriStore((s) => s.todayEntries);
  const weekEntries = useNutriStore((s) => s.weekEntries);
  const isLoading = useNutriStore((s) => s.isLoadingEntries);
  const addFoodEntry = useNutriStore((s) => s.addFoodEntry);
  const removeFoodEntry = useNutriStore((s) => s.removeFoodEntry);
  const loadTodayEntries = useNutriStore((s) => s.loadTodayEntries);
  const loadWeekEntries = useNutriStore((s) => s.loadWeekEntries);

  // Initial load + realtime listener for today's entries
  useEffect(() => {
    if (!user) return;

    // Initial batch load
    loadTodayEntries();
    loadWeekEntries();

    // Realtime listener for today's food log
    const q = query(
      getFoodLogCollection(user.uid),
      where('dateKey', '==', getDateKey()),
      orderBy('loggedAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entries: FoodEntry[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            loggedAt: data.loggedAt?.toDate?.() ?? new Date(data.loggedAt),
            createdAt: data.createdAt?.toDate?.() ?? new Date(data.createdAt),
            updatedAt: data.updatedAt?.toDate?.() ?? new Date(data.updatedAt),
          } as FoodEntry;
        });
        useNutriStore.setState({ todayEntries: entries });
      },
      (error) => {
        console.error('Food log listener error:', error);
      },
    );

    return unsubscribe;
  }, [user, loadTodayEntries, loadWeekEntries]);

  const addFood = useCallback(
    async (entry: Omit<FoodEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
      const result = validateFoodEntry({
        name: entry.name,
        calories: entry.nutrition.calories,
        proteinG: entry.nutrition.proteinG,
        carbsG: entry.nutrition.carbsG,
        fatG: entry.nutrition.fatG,
      });
      if (!result.valid) return result;

      await addFoodEntry(entry);
      return result;
    },
    [addFoodEntry],
  );

  const removeFood = useCallback(
    async (entryId: string) => {
      await removeFoodEntry(entryId);
    },
    [removeFoodEntry],
  );

  return { todayEntries, weekEntries, addFood, removeFood, isLoading };
}
