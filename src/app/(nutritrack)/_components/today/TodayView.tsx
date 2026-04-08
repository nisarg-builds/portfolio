'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { CalorieSummaryCard } from './CalorieSummaryCard';
import { MacroDonut } from './MacroDonut';
import { FoodLogList } from './FoodLogList';
import { AddFoodModal } from '../shared/AddFoodModal';

export function TodayView() {
  const todayEntries = useNutriStore((s) => s.todayEntries);
  const targets = useNutriStore((s) => s.targets);
  const removeFoodEntry = useNutriStore((s) => s.removeFoodEntry);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const consumed = todayEntries.reduce((sum, e) => sum + e.nutrition.calories, 0);
  const proteinG = todayEntries.reduce((sum, e) => sum + e.nutrition.proteinG, 0);
  const carbsG = todayEntries.reduce((sum, e) => sum + e.nutrition.carbsG, 0);
  const fatG = todayEntries.reduce((sum, e) => sum + e.nutrition.fatG, 0);

  const target = targets?.dailyCalorieTarget ?? 2000;
  const tdee = targets?.tdee ?? 2000;

  const closeModal = useCallback(() => setAddModalOpen(false), []);

  return (
    <div className="flex flex-col gap-4 pt-4">
      <CalorieSummaryCard consumed={consumed} target={target} tdee={tdee} />

      {todayEntries.length > 0 && (
        <MacroDonut proteinG={proteinG} carbsG={carbsG} fatG={fatG} />
      )}

      <FoodLogList
        entries={todayEntries}
        onDelete={removeFoodEntry}
        onOpenAddModal={() => setAddModalOpen(true)}
      />

      <AnimatePresence>
        {addModalOpen && <AddFoodModal onClose={closeModal} />}
      </AnimatePresence>
    </div>
  );
}
