'use client';

import { Card } from '../shared/Card';
import { ProgressBar } from '../shared/ProgressBar';

interface CalorieSummaryCardProps {
  consumed: number;
  target: number;
  tdee: number;
}

export function CalorieSummaryCard({ consumed, target, tdee }: CalorieSummaryCardProps) {
  const remaining = target - consumed;
  const isOver = remaining < 0;

  return (
    <Card>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-fg-text">{consumed}</span>
        <span className="text-sm text-fg-text-soft">/ {target} kcal</span>
      </div>

      <ProgressBar value={consumed} max={target} className="mb-3" />

      <div className="flex items-center justify-between text-xs">
        <span className={isOver ? 'font-medium text-fg-danger' : 'text-fg-text-soft'}>
          {isOver ? `${Math.abs(remaining)} kcal over` : `${remaining} kcal remaining`}
        </span>
        <span className="text-fg-text-soft">TDEE {tdee}</span>
      </div>
    </Card>
  );
}
