'use client';

import type { ComputedTargets } from '@/lib/fitglass/models';
import { Card } from '../shared/Card';

interface TargetCardProps {
  targets: ComputedTargets;
}

interface StatProps {
  label: string;
  value: string;
  accent?: boolean;
}

function Stat({ label, value, accent }: StatProps) {
  return (
    <div>
      <p
        className={`text-2xl font-bold tracking-tight ${accent ? 'text-fg-accent' : 'text-fg-text'}`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
        {label}
      </p>
    </div>
  );
}

export function TargetCard({ targets }: TargetCardProps) {
  return (
    <Card>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
        Your Targets
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Stat label="TDEE" value={`${targets.tdee.toLocaleString()} kcal`} />
        <Stat
          label="Daily target"
          value={`${targets.dailyCalorieTarget.toLocaleString()} kcal`}
          accent
        />
        <Stat label="Deficit" value={`${targets.dailyDeficit.toLocaleString()} kcal`} />
        <Stat label="Protein" value={`${Math.round(targets.proteinTargetG)}g`} />
      </div>
    </Card>
  );
}
