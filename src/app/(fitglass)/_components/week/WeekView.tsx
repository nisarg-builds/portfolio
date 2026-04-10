'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useFitGlassStore } from '@/lib/fitglass/hooks/useFitGlassStore';
import { useTodayMacros } from '@/lib/fitglass/hooks/useTodayMacros';
import {
  computeWeeklyStats,
  generateInsights,
} from '@/lib/fitglass/hooks/useInsights';
import { formatDateKey } from '@/lib/fitglass/utils/dates';
import { Card } from '../shared/Card';
import { WeekNavigator } from './WeekNavigator';
import { InsightBadge } from '../insights/InsightBadge';

const WeeklyBarChart = dynamic(
  () => import('./WeeklyBarChart').then((m) => ({ default: m.WeeklyBarChart })),
  { ssr: false },
);

const QUICK_TIPS = [
  'Protein at every meal helps you feel full longer and preserves muscle.',
  'Logging consistently matters more than hitting targets perfectly.',
  'Weigh yourself at the same time each day for accurate trends.',
  'A 500 kcal daily deficit \u2248 0.5 kg lost per week.',
];

// ─── Skeleton ───

function WeekViewSkeleton() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <Card>
        <div className="animate-pulse">
          <div className="mb-3 h-3 w-20 rounded bg-fg-border" />
          <div className="h-48 w-full rounded bg-fg-border" />
        </div>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2].map((i) => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="h-9 w-20 rounded bg-fg-border" />
              <div className="mt-2 h-3 w-24 rounded bg-fg-border" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main View ───

export function WeekView() {
  const weekEntries = useFitGlassStore((s) => s.weekEntries);
  const targets = useFitGlassStore((s) => s.targets);
  const { consumed: todayCalories, proteinG: todayProteinG } = useTodayMacros();
  const profile = useFitGlassStore((s) => s.profile);
  const isLoadingWeek = useFitGlassStore((s) => s.isLoadingWeek);
  const loadWeekEntries = useFitGlassStore((s) => s.loadWeekEntries);

  const [weekOffset, setWeekOffset] = useState(0);

  const dailyTarget = targets?.dailyCalorieTarget ?? 2000;
  const tdee = targets?.tdee ?? 2000;
  const goal = profile?.goal ?? 'fat_loss';

  // Reload week data when offset changes
  useEffect(() => {
    loadWeekEntries(weekOffset);
  }, [weekOffset, loadWeekEntries]);

  const stats = useMemo(
    () => computeWeeklyStats(weekEntries, dailyTarget, tdee, weekOffset),
    [weekEntries, dailyTarget, tdee, weekOffset],
  );

  const chartData = useMemo(
    () =>
      stats.days.map((d) => ({
        label: formatDateKey(d.dateKey).split(',')[0],
        calories: d.totalCalories,
      })),
    [stats.days],
  );

  // Insights (only for current week)
  const insights = useMemo(
    () =>
      weekOffset === 0 && targets
        ? generateInsights(todayCalories, todayProteinG, targets, stats, goal)
        : [],
    [weekOffset, todayCalories, todayProteinG, targets, stats, goal],
  );

  const handlePrev = useCallback(() => setWeekOffset((o) => o - 1), []);
  const handleNext = useCallback(
    () => setWeekOffset((o) => Math.min(o + 1, 0)),
    [],
  );

  if (isLoadingWeek && Object.keys(weekEntries).length === 0) {
    return <WeekViewSkeleton />;
  }

  return (
    <motion.div
      className="flex flex-col gap-4 pt-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <WeekNavigator
        weekOffset={weekOffset}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <WeeklyBarChart data={chartData} />

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-4xl font-bold tracking-tight text-fg-text">
            {stats.avgCalories.toLocaleString()}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
            Avg kcal / day
          </p>
        </Card>
        <Card>
          <p className="text-4xl font-bold tracking-tight text-fg-text">
            {stats.daysOnTarget}
            <span className="text-lg font-normal text-fg-text-soft">/7</span>
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
            Days on target
          </p>
        </Card>
      </div>

      {/* Insights (current week only) */}
      {insights.length > 0 && (
        <Card>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
            Today&apos;s Insights
          </p>
          <div className="flex flex-col gap-2">
            {insights.map((insight, i) => (
              <InsightBadge key={insight.id} insight={insight} index={i} />
            ))}
          </div>
        </Card>
      )}

      {/* Overview */}
      {weekOffset === 0 && targets && (
        <Card>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
            Overview
          </p>
          <div className="space-y-1.5 text-sm leading-relaxed text-fg-text">
            <p>
              Your TDEE is{' '}
              <span className="font-semibold">{tdee.toLocaleString()} kcal</span>,
              and your daily target is{' '}
              <span className="font-semibold text-fg-accent">
                {dailyTarget.toLocaleString()} kcal
              </span>
              .
            </p>
            <p>
              That&apos;s a planned deficit of{' '}
              <span className="font-semibold">
                {(targets.dailyDeficit ?? 0).toLocaleString()} kcal/day
              </span>
              , projecting{' '}
              <span className="font-semibold">
                ~{stats.projectedWeightChangeKg} kg/week
              </span>{' '}
              based on this week.
            </p>
            <p>
              Aim for{' '}
              <span className="font-semibold">
                ~{Math.round(targets.proteinTargetG ?? 0)}g protein
              </span>{' '}
              daily to preserve muscle mass.
            </p>
          </div>
        </Card>
      )}

      {/* Quick Tips */}
      <Card>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
          Quick Tips
        </p>
        <div className="flex flex-col gap-2.5">
          {QUICK_TIPS.map((tip) => (
            <div key={tip} className="flex gap-3">
              <div
                className="mt-0.5 h-full w-0.5 shrink-0 rounded-full bg-fg-accent"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-fg-text">{tip}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
