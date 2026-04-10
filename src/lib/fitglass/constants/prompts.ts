import type { UserContext } from '../models/chat';

/**
 * System prompt for Claude food analysis.
 * The actual prompt used at runtime is in the API route (app/api/fitglass/analyze/route.ts).
 * This copy is for reference and local testing.
 */
export const FOOD_ANALYSIS_SYSTEM_PROMPT = `You are a nutrition analysis assistant. Your job is to identify foods and estimate their nutritional content accurately.

When the user describes food or shows you an image of food:
1. Identify each distinct food item
2. Estimate reasonable portion sizes based on typical servings
3. Provide nutritional breakdown per item

You MUST respond ONLY with valid JSON. No markdown, no backticks, no preamble, no explanation outside the JSON.

Use this exact schema:
{
  "message": "A brief friendly comment about the food (1-2 sentences max)",
  "foods": [
    {
      "name": "Food item name with estimated portion size",
      "cal": 250,
      "protein": 20,
      "carbs": 10,
      "fat": 12,
      "fiber": 3,
      "sugar": 2,
      "sodium": 400,
      "vitaminA": 10,
      "vitaminC": 15,
      "calcium": 8,
      "iron": 12
    }
  ]
}

Field rules:
- "cal" = kilocalories (integer)
- "protein", "carbs", "fat", "fiber", "sugar" = grams (1 decimal max)
- "sodium" = milligrams (integer)
- "vitaminA", "vitaminC", "calcium", "iron" = percentage of daily value, 0-100 (integer)
- All numeric fields must be numbers, never strings
- If you cannot identify a food, return { "message": "explanation", "foods": [] }
- If multiple items visible, list each separately
- ONLY output the JSON object. Nothing else.`;

/**
 * Build the full system prompt, optionally augmented with the user's
 * nutritional profile and today's progress so Lens can give personalised advice.
 *
 * No PII (userId, email, displayName) is ever included.
 */
export function buildAugmentedPrompt(userContext?: UserContext): string {
  if (!userContext) return FOOD_ANALYSIS_SYSTEM_PROMPT;

  const lines: string[] = ['USER CONTEXT:'];

  // Goal
  if (userContext.goal) {
    lines.push(`- Goal: ${userContext.goal}`);
  }

  // Body stats
  if (userContext.weightKg != null) lines.push(`- Weight: ${userContext.weightKg} kg`);
  if (userContext.heightCm != null) lines.push(`- Height: ${userContext.heightCm} cm`);
  if (userContext.age != null) lines.push(`- Age: ${userContext.age}`);
  if (userContext.gender) lines.push(`- Gender: ${userContext.gender}`);

  // Daily targets
  const hasTargets =
    userContext.dailyCalorieTarget != null ||
    userContext.proteinTargetG != null ||
    userContext.fatMinG != null ||
    userContext.carbsRemainingG != null;

  if (hasTargets) {
    lines.push('- Daily targets:');
    if (userContext.dailyCalorieTarget != null)
      lines.push(`    Calories: ${userContext.dailyCalorieTarget} kcal`);
    if (userContext.proteinTargetG != null)
      lines.push(`    Protein: ${userContext.proteinTargetG} g`);
    if (userContext.fatMinG != null)
      lines.push(`    Fat (min): ${userContext.fatMinG} g`);
    if (userContext.carbsRemainingG != null)
      lines.push(`    Carbs: ${userContext.carbsRemainingG} g`);
  }

  // Consumed today
  const hasConsumed =
    userContext.consumedCalories != null ||
    userContext.consumedProteinG != null ||
    userContext.consumedCarbsG != null ||
    userContext.consumedFatG != null;

  if (hasConsumed) {
    lines.push('- Consumed today:');
    if (userContext.consumedCalories != null)
      lines.push(`    Calories: ${userContext.consumedCalories} kcal`);
    if (userContext.consumedProteinG != null)
      lines.push(`    Protein: ${userContext.consumedProteinG} g`);
    if (userContext.consumedCarbsG != null)
      lines.push(`    Carbs: ${userContext.consumedCarbsG} g`);
    if (userContext.consumedFatG != null)
      lines.push(`    Fat: ${userContext.consumedFatG} g`);
  }

  // Remaining budget
  if (
    userContext.dailyCalorieTarget != null &&
    userContext.consumedCalories != null
  ) {
    const remainingCal =
      userContext.dailyCalorieTarget - userContext.consumedCalories;
    const remainingProtein =
      userContext.proteinTargetG != null && userContext.consumedProteinG != null
        ? userContext.proteinTargetG - userContext.consumedProteinG
        : null;
    const remainingFat =
      userContext.fatMinG != null && userContext.consumedFatG != null
        ? userContext.fatMinG - userContext.consumedFatG
        : null;

    lines.push('- Remaining budget:');
    lines.push(`    Calories: ${remainingCal} kcal`);
    if (remainingProtein != null) lines.push(`    Protein: ${remainingProtein} g`);
    if (remainingFat != null) lines.push(`    Fat: ${remainingFat} g`);
  }

  lines.push(
    '',
    'Reference the user\'s targets and progress in your response when relevant. Be specific with numbers.',
  );

  const userContextSection = lines.join('\n');
  return FOOD_ANALYSIS_SYSTEM_PROMPT + '\n\n' + userContextSection;
}
