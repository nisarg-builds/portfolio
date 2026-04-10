'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface WeekNavigatorProps {
  weekOffset: number;
  onPrev: () => void;
  onNext: () => void;
}

export function getWeekLabel(offset: number): string {
  if (offset === 0) return 'This Week';
  if (offset === -1) return 'Last Week';
  const end = new Date();
  end.setDate(end.getDate() + offset * 7);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export function WeekNavigator({ weekOffset, onPrev, onNext }: WeekNavigatorProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <button
        onClick={onPrev}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-nt-text-soft transition-colors hover:text-nt-text"
        aria-label="Previous week"
        data-cursor="interactive"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <AnimatePresence mode="wait">
        <motion.span
          key={weekOffset}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-sm font-medium text-nt-text"
        >
          {getWeekLabel(weekOffset)}
        </motion.span>
      </AnimatePresence>

      <button
        onClick={onNext}
        disabled={weekOffset >= 0}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-nt-text-soft transition-colors hover:text-nt-text disabled:opacity-30"
        aria-label="Next week"
        data-cursor="interactive"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
