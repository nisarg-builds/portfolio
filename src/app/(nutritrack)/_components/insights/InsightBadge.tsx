'use client';

import { motion } from 'framer-motion';
import type { Insight } from '@/lib/nutritrack/models';
import { cn } from '@/lib/utils';

interface InsightBadgeProps {
  insight: Insight;
  index: number;
}

const typeStyles: Record<Insight['type'], string> = {
  good: 'bg-nt-accent-light text-nt-accent',
  warning: 'bg-nt-danger-light text-nt-danger',
  info: 'bg-gray-100 text-nt-text',
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
