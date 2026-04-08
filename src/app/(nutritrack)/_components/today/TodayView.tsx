'use client';

import { useState } from 'react';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { CalorieSummaryCard } from './CalorieSummaryCard';
import { MacroDonut } from './MacroDonut';
import { FoodLogList } from './FoodLogList';

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

      {/* AddFoodModal will be wired here in the next prompt */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-nt-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-sm text-nt-text-soft">
              Add Food modal — coming next
            </p>
            <button
              className="mt-3 w-full rounded-lg bg-nt-border py-2 text-sm text-nt-text"
              onClick={() => setAddModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
