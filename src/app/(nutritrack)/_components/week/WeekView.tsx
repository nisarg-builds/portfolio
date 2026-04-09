'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { computeWeeklyStats } from '@/lib/nutritrack/hooks/useInsights';
import { formatDateKey } from '@/lib/nutritrack/utils/dates';
import { Card } from '../shared/Card';
import { WeeklyBarChart } from './WeeklyBarChart';

export function WeekView() {
  const weekEntries = useNutriStore((s) => s.weekEntries);
  const targets = useNutriStore((s) => s.targets);

  const dailyTarget = targets?.dailyCalorieTarget ?? 2000;
  const tdee = targets?.tdee ?? 2000;

  const stats = useMemo(
    () => computeWeeklyStats(weekEntries, dailyTarget, tdee),
    [weekEntries, dailyTarget, tdee],
  );

  const chartData = useMemo(
    () =>
      stats.days.map((d) => ({
        label: formatDateKey(d.dateKey).split(',')[0],
        calories: d.totalCalories,
      })),
    [stats.days],
  );

  return (
    <motion.div
      className="flex flex-col gap-4 pt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <WeeklyBarChart data={chartData} />

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-4xl font-bold tracking-tight text-nt-text">
            {stats.avgCalories.toLocaleString()}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-nt-text-soft">
            Avg kcal / day
          </p>
        </Card>
        <Card>
          <p className="text-4xl font-bold tracking-tight text-nt-text">
            {stats.daysOnTarget}
            <span className="text-lg font-normal text-nt-text-soft">/7</span>
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-nt-text-soft">
            Days on target
          </p>
        </Card>
      </div>
    </motion.div>
  );
}
