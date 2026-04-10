'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../shared/Card';

interface WeeklyBarChartProps {
  data: { label: string; calories: number }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-fg-border bg-fg-card px-3 py-1.5 text-sm font-medium text-fg-text shadow-sm backdrop-blur-sm">
      {payload[0].value.toLocaleString()} kcal
    </div>
  );
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  return (
    <Card>
      <div className="h-48" role="img" aria-label="Bar chart showing daily calorie intake for the week">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: -12 }}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-fg-text-soft)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-fg-text-soft)', fontSize: 12 }}
              width={52}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'var(--color-fg-border)', opacity: 0.4 }}
            />
            <Bar
              dataKey="calories"
              fill="var(--color-fg-accent)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
