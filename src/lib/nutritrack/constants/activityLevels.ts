import type { ActivityLevel } from '../models';

/** Predefined activity levels with BMR multipliers (Harris-Benedict revised). */
export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { id: 'sedentary', label: 'Sedentary', multiplier: 1.2 },
  { id: 'light', label: 'Light activity', multiplier: 1.375 },
  { id: 'moderate', label: 'Moderate', multiplier: 1.55 },
  { id: 'very_active', label: 'Very active', multiplier: 1.725 },
];

/** Look up an activity level by id. Falls back to sedentary. */
export function getActivityLevel(id: string): ActivityLevel {
  return ACTIVITY_LEVELS.find((a) => a.id === id) ?? ACTIVITY_LEVELS[0];
}
