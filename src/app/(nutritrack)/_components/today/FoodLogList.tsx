'use client';

import { motion } from 'framer-motion';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { FoodLogItem } from './FoodLogItem';
import type { FoodEntry } from '@/lib/nutritrack/models';

interface FoodLogListProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
  onAddFood?: () => void;
}

export function FoodLogList({ entries, onDelete, onAddFood }: FoodLogListProps) {
  return (
    <Card className="p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-nt-border px-5 py-3">
        <span className="text-xs font-medium uppercase tracking-widest text-nt-text-soft">
          Food Log
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-nt-text-soft">
            {entries.length} {entries.length === 1 ? 'item' : 'items'}
          </span>
          {/* Desktop-only add button */}
          {onAddFood && (
            <Button
              size="sm"
              onClick={onAddFood}
              className="hidden lg:inline-flex"
            >
              + Add Food
            </Button>
          )}
        </div>
      </div>

      {/* List or empty state */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 py-10">
          <p className="text-sm text-nt-text-soft">No food logged yet</p>
          {onAddFood && (
            <Button size="sm" onClick={onAddFood} className="hidden lg:inline-flex">
              + Add Food
            </Button>
          )}
        </div>
      ) : (
        <div className="px-5">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03, ease: 'easeOut' }}
            >
              <FoodLogItem entry={entry} onDelete={onDelete} />
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
