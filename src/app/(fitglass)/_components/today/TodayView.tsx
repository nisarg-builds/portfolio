'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFitGlassStore } from '@/lib/fitglass/hooks/useFitGlassStore';
import { useTodayMacros } from '@/lib/fitglass/hooks/useTodayMacros';
import { CalorieRing } from './CalorieRing';
import { MacroProgressBars } from './MacroProgressBars';
import { FoodLogList } from './FoodLogList';
import { FloatingActionButton } from '../shared/FloatingActionButton';
import { AddFoodModal } from '../shared/AddFoodModal';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

// ─── Skeleton ───

function TodayViewSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      {/* CalorieRing skeleton */}
      <div className="flex flex-col items-center gap-1 py-4">
        <div className="h-[180px] w-[180px] animate-pulse rounded-full bg-fg-border" />
      </div>

      {/* MacroProgressBars skeleton */}
      <div className="rounded-xl border border-fg-border bg-fg-card p-4 backdrop-blur-sm">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="h-3 w-14 rounded bg-fg-border" />
                <div className="h-3 w-20 rounded bg-fg-border" />
              </div>
              <div className="h-2 w-full rounded-full bg-fg-border" />
            </div>
          ))}
        </div>
      </div>

      {/* FoodLogList skeleton */}
      <Card className="p-0">
        <div className="animate-pulse">
          <div className="flex items-center justify-between border-b border-fg-border px-5 py-3">
            <div className="h-3 w-16 rounded bg-fg-border" />
          </div>
          <div className="space-y-4 px-5 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded bg-fg-border" />
                  <div className="h-3 w-36 rounded bg-fg-border" />
                </div>
                <div className="h-4 w-14 rounded bg-fg-border" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Empty State ───

function TodayEmptyState({ onOpenAddModal }: { onOpenAddModal: () => void }) {
  return (
    <motion.div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fg-accent-light">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-fg-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-fg-text">No meals logged today</p>
        <p className="mt-1 text-xs text-fg-text-soft">
          Track your first meal to see your daily progress
        </p>
      </div>
      <Button size="sm" onClick={onOpenAddModal}>
        Quick Add
      </Button>
    </motion.div>
  );
}

// ─── Main View ───

export function TodayView() {
  const todayEntries = useFitGlassStore((s) => s.todayEntries);
  const targets = useFitGlassStore((s) => s.targets);
  const isLoadingToday = useFitGlassStore((s) => s.isLoadingToday);
  const removeFoodEntry = useFitGlassStore((s) => s.removeFoodEntry);
  const { consumed, proteinG, carbsG, fatG } = useTodayMacros();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const closeModal = useCallback(() => setAddModalOpen(false), []);

  // Loading skeleton
  if (isLoadingToday && todayEntries.length === 0) {
    return <TodayViewSkeleton />;
  }

  // Empty state
  if (!isLoadingToday && todayEntries.length === 0) {
    return (
      <>
        <TodayEmptyState onOpenAddModal={() => setAddModalOpen(true)} />
        <FloatingActionButton onClick={() => setAddModalOpen(true)} />
        <AnimatePresence>
          {addModalOpen && <AddFoodModal onClose={closeModal} />}
        </AnimatePresence>
      </>
    );
  }

  const target = targets?.dailyCalorieTarget ?? 2000;

  return (
    <>
      <div className="flex flex-col gap-4 pt-4">
        <CalorieRing consumed={consumed} target={target} />

        {/* carbsRemainingG = daily carb allocation (remaining kcal after protein+fat, /4);
            fatMinG = minimum daily fat intake. Both used as progress bar targets. */}
        <MacroProgressBars
          proteinG={proteinG}
          carbsG={carbsG}
          fatG={fatG}
          proteinTarget={targets?.proteinTargetG}
          carbsTarget={targets?.carbsRemainingG}
          fatTarget={targets?.fatMinG}
        />

        <FoodLogList
          entries={todayEntries}
          onDelete={removeFoodEntry}
          onAddFood={() => setAddModalOpen(true)}
        />
      </div>

      <FloatingActionButton onClick={() => setAddModalOpen(true)} />

      <AnimatePresence>
        {addModalOpen && <AddFoodModal onClose={closeModal} />}
      </AnimatePresence>
    </>
  );
}
