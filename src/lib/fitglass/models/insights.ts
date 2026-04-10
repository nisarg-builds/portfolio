/**
 * Category of insight — determines visual styling.
 */
export type InsightType = 'good' | 'warning' | 'info';

/**
 * A single computed insight shown to the user.
 */
export interface Insight {
  /** Unique insight identifier. */
  id: string;
  /** Category determining badge color/style. */
  type: InsightType;
  /** Short title for the insight. */
  title: string;
  /** Descriptive message with context. */
  message: string;
  /** Optional numeric value associated with the insight. */
  metric?: number;
  /** Unit for the metric value (e.g. 'kcal', 'g', 'kg/week'). */
  unit?: string;
}

/**
 * Aggregated stats for the past 7 days.
 */
export interface WeeklyStats {
  /** Per-day summaries for the last 7 days. */
  days: DaySummary[];
  /** Average daily calories across the week. */
  avgCalories: number;
  /** Average daily protein in grams. */
  avgProteinG: number;
  /** Average daily carbs in grams. */
  avgCarbsG: number;
  /** Average daily fat in grams. */
  avgFatG: number;
  /** Number of days within target range. */
  daysOnTarget: number;
  /** Number of days with at least one logged entry. */
  daysLogged: number;
  /** Total calorie deficit across the week (kcal). */
  weeklyDeficit: number;
  /** Projected weight change based on weekly deficit (kg). */
  projectedWeightChangeKg: number;
}

/**
 * Summary of a single day's food log.
 */
export interface DaySummary {
  /** Date in 'YYYY-MM-DD' format. */
  dateKey: string;
  /** Total calories consumed. */
  totalCalories: number;
  /** Total protein consumed in grams. */
  totalProteinG: number;
  /** Total carbs consumed in grams. */
  totalCarbsG: number;
  /** Total fat consumed in grams. */
  totalFatG: number;
  /** Number of food entries logged. */
  entryCount: number;
  /** Whether the day's intake was within target range (+-100 kcal). */
  isOnTarget: boolean;
}
