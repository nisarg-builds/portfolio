'use client';

import { motion } from 'framer-motion';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { FoodLogItem } from './FoodLogItem';
import type { FoodEntry } from '@/lib/nutritrack/models';

interface FoodLogListProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
}

export function FoodLogList({ entries, onDelete, onOpenAddModal }: FoodLogListProps) {
  const setActiveView = useNutriStore((s) => s.setActiveView);

  return (
    <Card className="p-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-nt-border px-5 py-3">
        <span className="text-xs font-medium uppercase tracking-widest text-nt-text-soft">
          Food Log
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setActiveView('chat')}>
            AI Chat
          </Button>
          <Button size="sm" onClick={onOpenAddModal}>
            + Add
          </Button>
        </div>
      </div>

      {/* List or empty state */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-5 py-10">
          <p className="text-sm text-nt-text-soft">No food logged yet</p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setActiveView('chat')}>
              AI Chat
            </Button>
            <Button size="sm" onClick={onOpenAddModal}>
              Quick Add
            </Button>
          </div>
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
