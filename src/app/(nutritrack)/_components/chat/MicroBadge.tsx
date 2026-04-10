'use client';

import { cn } from '@/lib/utils';

interface MicroBadgeProps {
  label: string;
  value: number;
  unit: string;
  color?: string;
}

export function MicroBadge({ label, value, unit, color }: MicroBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        color ?? 'bg-nt-surface text-nt-text',
      )}
    >
      {label} {value}
      {unit}
    </span>
  );
}
