'use client';

import { motion } from 'framer-motion';

interface MacroProgressBarsProps {
  proteinG: number;
  carbsG: number;
  fatG: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
}

interface BarProps {
  label: string;
  value: number;
  target?: number;
  colorClass: string;
}

function MacroBar({ label, value, target, colorClass }: BarProps) {
  const percentage = target ? Math.min(value / target, 1) : 0;
  const rounded = Math.round(value);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-fg-text">{label}</span>
        <span className="text-fg-text-soft">
          {rounded}g{target ? ` / ${Math.round(target)}g` : ''}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-fg-border">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function MacroProgressBars({
  proteinG,
  carbsG,
  fatG,
  proteinTarget,
  carbsTarget,
  fatTarget,
}: MacroProgressBarsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-fg-border bg-fg-card p-4 backdrop-blur-sm">
      <MacroBar
        label="Protein"
        value={proteinG}
        target={proteinTarget}
        colorClass="bg-fg-protein"
      />
      <MacroBar
        label="Carbs"
        value={carbsG}
        target={carbsTarget}
        colorClass="bg-fg-carbs"
      />
      <MacroBar
        label="Fat"
        value={fatG}
        target={fatTarget}
        colorClass="bg-fg-fat"
      />
    </div>
  );
}
