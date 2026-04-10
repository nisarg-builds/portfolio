import type {
  FoodEntry,
  WeeklyStats,
  DaySummary,
  Insight,
  ComputedTargets,
  FitnessGoal,
} from '@/lib/nutritrack/models';
import { getLastNDays } from '@/lib/nutritrack/utils/dates';

/**
 * Compute weekly stats from the last 7 days of food entries.
 */
export function computeWeeklyStats(
  weekEntries: Record<string, FoodEntry[]>,
  dailyTarget: number,
  tdee: number,
  offset = 0,
): WeeklyStats {
  const dateKeys = getLastNDays(7, offset);

  const days: DaySummary[] = dateKeys.map((dateKey) => {
    const entries = weekEntries[dateKey] || [];
    const totalCalories = entries.reduce((s, e) => s + e.nutrition.calories, 0);
    const totalProteinG = entries.reduce((s, e) => s + e.nutrition.proteinG, 0);
    const totalCarbsG = entries.reduce((s, e) => s + e.nutrition.carbsG, 0);
    const totalFatG = entries.reduce((s, e) => s + e.nutrition.fatG, 0);

    return {
      dateKey,
      totalCalories,
      totalProteinG,
      totalCarbsG,
      totalFatG,
      entryCount: entries.length,
      isOnTarget:
        entries.length > 0 && Math.abs(totalCalories - dailyTarget) <= 100,
    };
  });

  const daysLogged = days.filter((d) => d.entryCount > 0).length;
  const daysOnTarget = days.filter((d) => d.isOnTarget).length;
  const divisor = Math.max(daysLogged, 1);
  const avgCalories = Math.round(
    days.reduce((s, d) => s + d.totalCalories, 0) / divisor,
  );
  const weeklyDeficit = days.reduce((s, d) => s + (tdee - d.totalCalories), 0);

  return {
    days,
    avgCalories,
    avgProteinG: Math.round(
      days.reduce((s, d) => s + d.totalProteinG, 0) / divisor,
    ),
    avgCarbsG: Math.round(days.reduce((s, d) => s + d.totalCarbsG, 0) / divisor),
    avgFatG: Math.round(days.reduce((s, d) => s + d.totalFatG, 0) / divisor),
    daysOnTarget,
    daysLogged,
    weeklyDeficit,
    projectedWeightChangeKg: Math.round((weeklyDeficit / 7700) * 100) / 100,
  };
}

/**
 * Generate personalized insights based on today's intake and weekly trends.
 */
export function generateInsights(
  todayCalories: number,
  todayProteinG: number,
  targets: ComputedTargets,
  weeklyStats: WeeklyStats,
  goal: FitnessGoal,
): Insight[] {
  const insights: Insight[] = [];
  const remaining = targets.dailyCalorieTarget - todayCalories;

  // Empty state
  if (todayCalories === 0) {
    insights.push({
      id: 'no-data',
      type: 'info',
      title: 'Get started',
      message: 'Start logging your meals to get personalized insights.',
    });
    return insights;
  }

  // Daily calorie status
  if (remaining > 0) {
    insights.push({
      id: 'on-track',
      type: 'good',
      title: 'On track',
      message: `You have ${remaining} kcal remaining today. You're on track.`,
      metric: remaining,
      unit: 'kcal',
    });
  } else {
    insights.push({
      id: 'over-target',
      type: 'warning',
      title: 'Over target',
      message: `You're ${Math.abs(remaining)} kcal over your target today.`,
      metric: Math.abs(remaining),
      unit: 'kcal',
    });
  }

  // Protein analysis
  const proteinTarget = targets.proteinTargetG;
  if (todayProteinG < proteinTarget * 0.7) {
    insights.push({
      id: 'low-protein',
      type: 'warning',
      title: 'Low protein',
      message: `Protein is low (${Math.round(todayProteinG)}g). Aim for ~${Math.round(proteinTarget)}g to preserve muscle${goal === 'fat_loss' ? ' during fat loss' : ''}.`,
      metric: todayProteinG,
      unit: 'g',
    });
  } else if (todayProteinG >= proteinTarget) {
    insights.push({
      id: 'good-protein',
      type: 'good',
      title: 'Great protein',
      message: `Great protein intake (${Math.round(todayProteinG)}g). This helps preserve muscle mass.`,
      metric: todayProteinG,
      unit: 'g',
    });
  }

  // Weekly projection
  if (weeklyStats.avgCalories > 0 && weeklyStats.weeklyDeficit > 0) {
    insights.push({
      id: 'weekly-projection',
      type: 'info',
      title: 'Weekly pace',
      message: `Based on this week, you're on pace to lose ~${weeklyStats.projectedWeightChangeKg} kg/week.`,
      metric: weeklyStats.projectedWeightChangeKg,
      unit: 'kg/week',
    });
  }

  // Consistency tracking
  if (weeklyStats.daysOnTarget >= 5) {
    insights.push({
      id: 'strong-consistency',
      type: 'good',
      title: 'Consistent',
      message: `Strong consistency — ${weeklyStats.daysOnTarget}/7 days on target this week.`,
      metric: weeklyStats.daysOnTarget,
      unit: 'days',
    });
  } else if (weeklyStats.daysOnTarget >= 3) {
    insights.push({
      id: 'moderate-consistency',
      type: 'info',
      title: 'Building habits',
      message: `${weeklyStats.daysOnTarget}/7 days on target. Consistency is key for ${goal === 'fat_loss' ? 'fat loss' : 'your goals'}.`,
      metric: weeklyStats.daysOnTarget,
      unit: 'days',
    });
  }

  return insights;
}
