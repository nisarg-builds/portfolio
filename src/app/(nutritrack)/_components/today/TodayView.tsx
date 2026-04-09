'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { CalorieSummaryCard } from './CalorieSummaryCard';
import { MacroDonut } from './MacroDonut';
import { FoodLogList } from './FoodLogList';
import { AddFoodModal } from '../shared/AddFoodModal';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

// ─── Skeleton ───

function TodayViewSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      {/* CalorieSummaryCard skeleton */}
      <Card>
        <div className="animate-pulse">
          <div className="mb-3 flex items-baseline gap-2">
            <div className="h-8 w-24 rounded bg-nt-border" />
            <div className="h-4 w-20 rounded bg-nt-border" />
          </div>
          <div className="mb-3 h-3 w-full rounded-full bg-nt-border" />
          <div className="flex items-center justify-between">
            <div className="h-3 w-32 rounded bg-nt-border" />
            <div className="h-3 w-16 rounded bg-nt-border" />
          </div>
        </div>
      </Card>

      {/* MacroDonut skeleton */}
      <Card className="flex items-center gap-4">
        <div className="animate-pulse flex items-center gap-4 w-full">
          <div className="h-20 w-20 shrink-0 rounded-full bg-nt-border" />
          <div className="flex flex-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-nt-border" />
                <div className="h-4 w-8 rounded bg-nt-border" />
                <div className="h-3 w-10 rounded bg-nt-border" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* FoodLogList skeleton */}
      <Card className="p-0">
        <div className="animate-pulse">
          <div className="flex items-center justify-between border-b border-nt-border px-5 py-3">
            <div className="h-3 w-16 rounded bg-nt-border" />
            <div className="flex gap-2">
              <div className="h-7 w-16 rounded-lg bg-nt-border" />
              <div className="h-7 w-14 rounded-lg bg-nt-border" />
            </div>
          </div>
          <div className="space-y-4 px-5 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-28 rounded bg-nt-border" />
                  <div className="h-3 w-36 rounded bg-nt-border" />
                </div>
                <div className="h-4 w-14 rounded bg-nt-border" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Empty State ───

function TodayEmptyState({
  onOpenChat,
  onOpenAddModal,
}: {
  onOpenChat: () => void;
  onOpenAddModal: () => void;
}) {
  return (
    <motion.div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-nt-accent-light">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-nt-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 3h18v18H3z" opacity="0" />
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-nt-text">No meals logged today</p>
        <p className="mt-1 text-xs text-nt-text-soft">
          Track your first meal to see your daily progress
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onOpenChat}>
          AI Chat
        </Button>
        <Button size="sm" onClick={onOpenAddModal}>
          Quick Add
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main View ───

export function TodayView() {
  const todayEntries = useNutriStore((s) => s.todayEntries);
  const targets = useNutriStore((s) => s.targets);
  const isLoadingEntries = useNutriStore((s) => s.isLoadingEntries);
  const removeFoodEntry = useNutriStore((s) => s.removeFoodEntry);
  const setActiveView = useNutriStore((s) => s.setActiveView);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const closeModal = useCallback(() => setAddModalOpen(false), []);

  // Loading skeleton
  if (isLoadingEntries && todayEntries.length === 0) {
    return <TodayViewSkeleton />;
  }

  // Empty state
  if (!isLoadingEntries && todayEntries.length === 0) {
    return (
      <>
        <TodayEmptyState
          onOpenChat={() => setActiveView('chat')}
          onOpenAddModal={() => setAddModalOpen(true)}
        />
        <AnimatePresence>
          {addModalOpen && <AddFoodModal onClose={closeModal} />}
        </AnimatePresence>
      </>
    );
  }

  // Normal content
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

      <AnimatePresence>
        {addModalOpen && <AddFoodModal onClose={closeModal} />}
      </AnimatePresence>
    </div>
  );
}
