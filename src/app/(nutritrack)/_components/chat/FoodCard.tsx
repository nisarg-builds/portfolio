'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AIFoodItem } from '@/lib/nutritrack/models/chat';
import { aiItemToFoodEntry } from '@/lib/nutritrack/utils/converters';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { MicroBadge } from './MicroBadge';

interface FoodCardProps {
  food: AIFoodItem;
}

export function FoodCard({ food }: FoodCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [logged, setLogged] = useState(false);
  const user = useNutriStore((s) => s.user);
  const addFoodEntry = useNutriStore((s) => s.addFoodEntry);
  const addChatMessage = useNutriStore((s) => s.addChatMessage);

  const hasMicros =
    food.fiber != null ||
    food.sugar != null ||
    food.sodium != null ||
    food.vitaminA != null ||
    food.vitaminC != null ||
    food.calcium != null ||
    food.iron != null;

  async function handleLog() {
    if (!user || logged) return;

    const source = 'ai_text' as const;
    const entry = aiItemToFoodEntry(food, user.uid, source);
    await addFoodEntry(entry);
    setLogged(true);

    addChatMessage({
      id: `msg-${Date.now()}-confirm`,
      role: 'assistant',
      text: `Logged "${food.name}" (${food.cal} kcal)`,
      timestamp: new Date(),
    });
  }

  return (
    <div className="rounded-xl border border-nt-border bg-nt-card p-3">
      {/* Header: name + log button */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-nt-text">{food.name}</p>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLog}
          disabled={logged}
          className="shrink-0 rounded-lg bg-nt-accent px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50"
          aria-label={`Log ${food.name}`}
          data-cursor="interactive"
        >
          {logged ? 'Logged' : '+ Log'}
        </motion.button>
      </div>

      {/* Macro badges */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <MicroBadge
          label="Cal"
          value={food.cal}
          unit=""
          color="bg-gray-100 text-nt-text"
        />
        <MicroBadge
          label="P"
          value={food.protein}
          unit="g"
          color="bg-nt-accent-light text-nt-protein"
        />
        <MicroBadge
          label="C"
          value={food.carbs}
          unit="g"
          color="bg-amber-50 text-nt-carbs"
        />
        <MicroBadge
          label="F"
          value={food.fat}
          unit="g"
          color="bg-orange-50 text-nt-fat"
        />
      </div>

      {/* Expandable micros */}
      {hasMicros && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-xs font-medium text-nt-accent"
            data-cursor="interactive"
          >
            {expanded ? 'Hide micronutrients' : 'Show micronutrients ›'}
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {food.fiber != null && (
                    <MicroBadge label="Fiber" value={food.fiber} unit="g" />
                  )}
                  {food.sugar != null && (
                    <MicroBadge label="Sugar" value={food.sugar} unit="g" />
                  )}
                  {food.sodium != null && (
                    <MicroBadge label="Na" value={food.sodium} unit="mg" />
                  )}
                  {food.vitaminA != null && (
                    <MicroBadge label="Vit A" value={food.vitaminA} unit="%" />
                  )}
                  {food.vitaminC != null && (
                    <MicroBadge label="Vit C" value={food.vitaminC} unit="%" />
                  )}
                  {food.calcium != null && (
                    <MicroBadge label="Ca" value={food.calcium} unit="%" />
                  )}
                  {food.iron != null && (
                    <MicroBadge label="Fe" value={food.iron} unit="%" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
