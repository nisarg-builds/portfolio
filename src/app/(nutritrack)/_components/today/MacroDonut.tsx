'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../shared/Card';

interface MacroDonutProps {
  proteinG: number;
  carbsG: number;
  fatG: number;
}

const COLORS = {
  protein: 'var(--color-nt-protein)',
  carbs: 'var(--color-nt-carbs)',
  fat: 'var(--color-nt-fat)',
};

export function MacroDonut({ proteinG, carbsG, fatG }: MacroDonutProps) {
  const total = proteinG + carbsG + fatG;
  if (total === 0) return null;

  const data = [
    { name: 'Protein', value: proteinG },
    { name: 'Carbs', value: carbsG },
    { name: 'Fat', value: fatG },
  ];

  const colorValues = [COLORS.protein, COLORS.carbs, COLORS.fat];

  return (
    <Card className="flex items-center gap-4" aria-label={`Macro breakdown: ${Math.round(proteinG)}g protein, ${Math.round(carbsG)}g carbs, ${Math.round(fatG)}g fat`}>
      <div className="h-20 w-20 shrink-0" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={22}
              outerRadius={38}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={colorValues[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-1 gap-4">
        <MacroColumn label="Protein" value={proteinG} color="bg-nt-protein" />
        <MacroColumn label="Carbs" value={carbsG} color="bg-nt-carbs" />
        <MacroColumn label="Fat" value={fatG} color="bg-nt-fat" />
      </div>
    </Card>
  );
}

function MacroColumn({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />
      <span className="text-sm font-semibold text-nt-text">{Math.round(value)}g</span>
      <span className="text-xs text-nt-text-soft">{label}</span>
    </div>
  );
}
