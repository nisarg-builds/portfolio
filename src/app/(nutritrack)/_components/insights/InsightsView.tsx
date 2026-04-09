'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import {
  computeWeeklyStats,
  generateInsights,
} from '@/lib/nutritrack/hooks/useInsights';
import { Card } from '../shared/Card';
import { InsightBadge } from './InsightBadge';

const QUICK_TIPS = [
  'Protein at every meal helps you feel full longer and preserves muscle.',
  'Logging consistently matters more than hitting targets perfectly.',
  'Weigh yourself at the same time each day for accurate trends.',
  'A 500 kcal daily deficit ≈ 0.5 kg lost per week.',
];

export function InsightsView() {
  const todayEntries = useNutriStore((s) => s.todayEntries);
  const weekEntries = useNutriStore((s) => s.weekEntries);
  const targets = useNutriStore((s) => s.targets);
  const profile = useNutriStore((s) => s.profile);

  const dailyTarget = targets?.dailyCalorieTarget ?? 2000;
  const tdee = targets?.tdee ?? 2000;
  const goal = profile?.goal ?? 'fat_loss';

  const todayCalories = useMemo(
    () => todayEntries.reduce((s, e) => s + e.nutrition.calories, 0),
    [todayEntries],
  );
  const todayProteinG = useMemo(
    () => todayEntries.reduce((s, e) => s + e.nutrition.proteinG, 0),
    [todayEntries],
  );

  const weeklyStats = useMemo(
    () => computeWeeklyStats(weekEntries, dailyTarget, tdee),
    [weekEntries, dailyTarget, tdee],
  );

  const insights = useMemo(
    () =>
      targets
        ? generateInsights(
            todayCalories,
            todayProteinG,
            targets,
            weeklyStats,
            goal,
          )
        : [],
    [todayCalories, todayProteinG, targets, weeklyStats, goal],
  );

  return (
    <motion.div
      className="flex flex-col gap-4 pt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Dynamic Insights */}
      <Card>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-nt-text-soft">
          Today&apos;s Insights
        </p>
        <div className="flex flex-col gap-2">
          {insights.map((insight, i) => (
            <InsightBadge key={insight.id} insight={insight} index={i} />
          ))}
        </div>
      </Card>

      {/* Fat Loss Overview */}
      <Card>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-nt-text-soft">
          Overview
        </p>
        <div className="space-y-1.5 text-sm leading-relaxed text-nt-text">
          <p>
            Your TDEE is{' '}
            <span className="font-semibold">{tdee.toLocaleString()} kcal</span>,
            and your daily target is{' '}
            <span className="font-semibold text-nt-accent">
              {dailyTarget.toLocaleString()} kcal
            </span>
            .
          </p>
          <p>
            That&apos;s a planned deficit of{' '}
            <span className="font-semibold">
              {(targets?.dailyDeficit ?? 0).toLocaleString()} kcal/day
            </span>
            , projecting{' '}
            <span className="font-semibold">
              ~{weeklyStats.projectedWeightChangeKg} kg/week
            </span>{' '}
            based on this week.
          </p>
          <p>
            Aim for{' '}
            <span className="font-semibold">
              ~{Math.round(targets?.proteinTargetG ?? 0)}g protein
            </span>{' '}
            daily to preserve muscle mass.
          </p>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-nt-text-soft">
          Quick Tips
        </p>
        <div className="flex flex-col gap-2.5">
          {QUICK_TIPS.map((tip) => (
            <div key={tip} className="flex gap-3">
              <div
                className="mt-0.5 h-full w-0.5 shrink-0 rounded-full bg-nt-accent"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-nt-text">{tip}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
