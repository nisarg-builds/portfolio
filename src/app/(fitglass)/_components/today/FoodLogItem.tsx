'use client';

import { motion } from 'framer-motion';
import type { FoodEntry } from '@/lib/fitglass/models';

interface FoodLogItemProps {
  entry: FoodEntry;
  onDelete: (id: string) => void;
}

export function FoodLogItem({ entry, onDelete }: FoodLogItemProps) {
  const { nutrition } = entry;

  return (
    <div className="flex items-center justify-between gap-3 border-b border-fg-border py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg-text">{entry.name}</p>
        <p className="text-xs text-fg-text-soft">
          P: {Math.round(nutrition.proteinG)}g · C: {Math.round(nutrition.carbsG)}g · F:{' '}
          {Math.round(nutrition.fatG)}g
        </p>
      </div>

      <span className="shrink-0 text-sm font-semibold text-fg-text">
        {nutrition.calories}
      </span>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(entry.id)}
        className="shrink-0 rounded-md p-1 text-fg-text-soft transition-colors hover:bg-fg-danger-light hover:text-fg-danger"
        aria-label={`Remove ${entry.name}`}
        data-cursor="interactive"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </motion.button>
    </div>
  );
}
