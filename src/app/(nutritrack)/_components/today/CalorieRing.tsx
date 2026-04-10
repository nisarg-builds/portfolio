'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CalorieRingProps {
  consumed: number;
  target: number;
}

const SIZE = 180;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CalorieRing({ consumed, target }: CalorieRingProps) {
  const percentage = target > 0 ? Math.min(consumed / target, 1.5) : 0;
  const remaining = target - consumed;
  const isOver = consumed > target;
  const strokeColor = isOver ? 'var(--color-nt-danger)' : 'var(--color-nt-accent)';

  return (
    <div className="flex flex-col items-center gap-1 py-4">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90" aria-hidden="true">
          {/* Background track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--color-nt-border)"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{
              strokeDashoffset: CIRCUMFERENCE * (1 - Math.min(percentage, 1)),
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-nt-text">
            {Math.round(consumed).toLocaleString()}
          </span>
          <span className="text-xs text-nt-text-soft">
            / {Math.round(target).toLocaleString()} kcal
          </span>
        </div>
      </div>
      <p className={cn('text-sm font-medium', isOver ? 'text-nt-danger' : 'text-nt-accent')}>
        {isOver
          ? `${Math.round(consumed - target)} kcal over`
          : `${Math.round(remaining)} kcal remaining`}
      </p>
    </div>
  );
}
