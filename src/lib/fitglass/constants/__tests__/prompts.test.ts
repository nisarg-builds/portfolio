import { describe, it, expect } from 'vitest';
import {
  FOOD_ANALYSIS_SYSTEM_PROMPT,
  buildAugmentedPrompt,
} from '../prompts';
import type { UserContext } from '../../models/chat';

function makeFullContext(
  overrides?: Partial<UserContext>,
): UserContext {
  return {
    dailyCalorieTarget: 2200,
    proteinTargetG: 150,
    fatMinG: 60,
    carbsRemainingG: 180,
    consumedCalories: 800,
    consumedProteinG: 55,
    consumedCarbsG: 90,
    consumedFatG: 30,
    goal: 'fat loss',
    weightKg: 75,
    heightCm: 178,
    age: 23,
    gender: 'male',
    ...overrides,
  };
}

describe('buildAugmentedPrompt', () => {
  it('returns the base prompt when no userContext is provided', () => {
    const result = buildAugmentedPrompt();
    expect(result).toBe(FOOD_ANALYSIS_SYSTEM_PROMPT);
  });

  it('returns the base prompt when userContext is undefined', () => {
    const result = buildAugmentedPrompt(undefined);
    expect(result).toBe(FOOD_ANALYSIS_SYSTEM_PROMPT);
  });

  it('returns an augmented prompt that starts with the base prompt', () => {
    const result = buildAugmentedPrompt(makeFullContext());
    expect(result.startsWith(FOOD_ANALYSIS_SYSTEM_PROMPT)).toBe(true);
    expect(result.length).toBeGreaterThan(FOOD_ANALYSIS_SYSTEM_PROMPT.length);
  });

  it('includes USER CONTEXT header', () => {
    const result = buildAugmentedPrompt(makeFullContext());
    expect(result).toContain('USER CONTEXT:');
  });

  it('includes the user goal', () => {
    const result = buildAugmentedPrompt(makeFullContext({ goal: 'muscle gain' }));
    expect(result).toContain('Goal: muscle gain');
  });

  it('includes specific daily target numbers', () => {
    const ctx = makeFullContext({
      dailyCalorieTarget: 2500,
      proteinTargetG: 180,
      fatMinG: 70,
    });
    const result = buildAugmentedPrompt(ctx);
    expect(result).toContain('Calories: 2500 kcal');
    expect(result).toContain('Protein: 180 g');
    expect(result).toContain('Fat (min): 70 g');
  });

  it('includes consumed today values', () => {
    const ctx = makeFullContext({
      consumedCalories: 1200,
      consumedProteinG: 80,
      consumedCarbsG: 100,
      consumedFatG: 40,
    });
    const result = buildAugmentedPrompt(ctx);
    expect(result).toContain('Consumed today:');
    expect(result).toContain('Calories: 1200 kcal');
    expect(result).toContain('Protein: 80 g');
    expect(result).toContain('Carbs: 100 g');
    expect(result).toContain('Fat: 40 g');
  });

  it('calculates remaining budget correctly', () => {
    const ctx = makeFullContext({
      dailyCalorieTarget: 2200,
      consumedCalories: 800,
      proteinTargetG: 150,
      consumedProteinG: 55,
      fatMinG: 60,
      consumedFatG: 30,
    });
    const result = buildAugmentedPrompt(ctx);
    expect(result).toContain('Remaining budget:');
    expect(result).toContain('Calories: 1400 kcal');
    expect(result).toContain('Protein: 95 g');
    expect(result).toContain('Fat: 30 g');
  });

  it('includes body stats', () => {
    const ctx = makeFullContext({
      weightKg: 75,
      heightCm: 178,
      age: 23,
      gender: 'male',
    });
    const result = buildAugmentedPrompt(ctx);
    expect(result).toContain('Weight: 75 kg');
    expect(result).toContain('Height: 178 cm');
    expect(result).toContain('Age: 23');
    expect(result).toContain('Gender: male');
  });

  it('includes the personalisation instruction', () => {
    const result = buildAugmentedPrompt(makeFullContext());
    expect(result).toContain(
      "Reference the user's targets and progress in your response when relevant. Be specific with numbers.",
    );
  });

  it('handles partial userContext — only provided fields appear', () => {
    // Only goal, weight, and calorie target
    const partial = {
      goal: 'maintenance',
      weightKg: 80,
      dailyCalorieTarget: 2000,
    } as UserContext;

    const result = buildAugmentedPrompt(partial);

    expect(result).toContain('Goal: maintenance');
    expect(result).toContain('Weight: 80 kg');
    expect(result).toContain('Calories: 2000 kcal');

    // Fields not provided (falsy 0 / undefined) should not produce "Consumed today:" section
    expect(result).not.toContain('Consumed today:');
    // No height provided
    expect(result).not.toContain('Height:');
  });

  it('does not include any PII fields', () => {
    const result = buildAugmentedPrompt(makeFullContext());
    expect(result).not.toContain('userId');
    expect(result).not.toContain('email');
    expect(result).not.toContain('displayName');
  });
});
