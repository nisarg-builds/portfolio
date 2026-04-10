'use client';

import { motion } from 'framer-motion';
import type { Insight } from '@/lib/fitglass/models';
import { cn } from '@/lib/utils';

interface InsightBadgeProps {
  insight: Insight;
  index: number;
}

const typeStyles: Record<Insight['type'], string> = {
  good: 'bg-fg-accent-light text-fg-accent',
  warning: 'bg-fg-danger-light text-fg-danger',
  info: 'bg-fg-surface text-fg-text',
};

export function InsightBadge({ insight, index }: InsightBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn('rounded-lg px-3.5 py-2.5', typeStyles[insight.type])}
    >
      <p className="text-sm font-semibold">{insight.title}</p>
      <p className="mt-0.5 text-xs leading-relaxed opacity-80">
        {insight.message}
      </p>
    </motion.div>
  );
}
