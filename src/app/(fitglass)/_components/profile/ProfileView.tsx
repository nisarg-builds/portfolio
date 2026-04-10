'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useFitGlassStore } from '@/lib/fitglass/hooks/useFitGlassStore';
import { ACTIVITY_LEVELS } from '@/lib/fitglass/constants/activityLevels';
import type { UserProfile, Gender, FitnessGoal } from '@/lib/fitglass/models';
import { cn } from '@/lib/utils';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { TargetCard } from './TargetCard';

const GOAL_OPTIONS: { id: FitnessGoal; label: string }[] = [
  { id: 'fat_loss', label: 'Fat loss' },
  { id: 'maintenance', label: 'Maintain' },
  { id: 'muscle_gain', label: 'Muscle gain' },
];

const GOAL_RATES = [0.25, 0.5, 0.75, 1.0];

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

function ToggleButton({ active, onClick, children, className }: ToggleButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-fg-accent text-white'
          : 'border border-fg-border bg-transparent text-fg-text',
        className,
      )}
      data-cursor="interactive"
    >
      {children}
    </motion.button>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
}

function NumberField({ label, value, onChange, min, max, step = 1, unit }: NumberFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-fg-text-soft">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            if (!isNaN(n) && n >= min && n <= max) onChange(n);
          }}
          min={min}
          max={max}
          step={step}
          className="w-full rounded-lg border border-fg-border bg-fg-surface px-3 py-2 text-sm text-fg-text outline-none focus:border-fg-accent"
        />
        <span className="shrink-0 text-xs text-fg-text-soft">{unit}</span>
      </div>
    </div>
  );
}

export function ProfileView() {
  const profile = useFitGlassStore((s) => s.profile);
  const targets = useFitGlassStore((s) => s.targets);
  const setProfile = useFitGlassStore((s) => s.setProfile);
  const resetAllData = useFitGlassStore((s) => s.resetAllData);
  const user = useFitGlassStore((s) => s.user);

  const update = useCallback(
    (patch: Partial<UserProfile>) => {
      if (!profile) return;
      setProfile({ ...profile, ...patch });
    },
    [profile, setProfile],
  );

  if (!profile || !targets) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-fg-text-soft">Loading profile…</p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-4 pt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* User info */}
      <Card>
        <p className="text-lg font-semibold text-fg-text">
          {user?.displayName ?? profile.displayName}
        </p>
        <p className="text-xs text-fg-text-soft">{user?.email ?? profile.email}</p>
      </Card>

      {/* Body measurements */}
      <Card>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
          Body Measurements
        </p>
        <div className="grid grid-cols-3 gap-3">
          <NumberField
            label="Weight"
            value={profile.weightKg}
            onChange={(v) => update({ weightKg: v })}
            min={30}
            max={300}
            step={0.5}
            unit="kg"
          />
          <NumberField
            label="Height"
            value={profile.heightCm}
            onChange={(v) => update({ heightCm: v })}
            min={100}
            max={250}
            unit="cm"
          />
          <NumberField
            label="Age"
            value={profile.age}
            onChange={(v) => update({ age: v })}
            min={13}
            max={120}
            unit="yrs"
          />
        </div>
      </Card>

      {/* Gender */}
      <Card>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
          Gender
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(['male', 'female'] as Gender[]).map((g) => (
            <ToggleButton
              key={g}
              active={profile.gender === g}
              onClick={() => update({ gender: g })}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </ToggleButton>
          ))}
        </div>
      </Card>

      {/* Activity Level */}
      <Card>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
          Activity Level
        </p>
        <div className="grid grid-cols-2 gap-3">
          {ACTIVITY_LEVELS.map((level) => (
            <ToggleButton
              key={level.id}
              active={profile.activityLevelId === level.id}
              onClick={() => update({ activityLevelId: level.id })}
            >
              {level.label}
            </ToggleButton>
          ))}
        </div>
      </Card>

      {/* Goal */}
      <Card>
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
          Goal
        </p>
        <div className="grid grid-cols-3 gap-3">
          {GOAL_OPTIONS.map((opt) => (
            <ToggleButton
              key={opt.id}
              active={profile.goal === opt.id}
              onClick={() => update({ goal: opt.id })}
            >
              {opt.label}
            </ToggleButton>
          ))}
        </div>
      </Card>

      {/* Goal Rate */}
      {profile.goal !== 'maintenance' && (
        <Card>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fg-text-soft">
            Rate (kg/week)
          </p>
          <div className="flex gap-3">
            {GOAL_RATES.map((rate) => (
              <ToggleButton
                key={rate}
                active={profile.goalRateKgPerWeek === rate}
                onClick={() => update({ goalRateKgPerWeek: rate })}
                className="flex-1"
              >
                {rate}
              </ToggleButton>
            ))}
          </div>
        </Card>
      )}

      {/* Computed Targets */}
      <TargetCard targets={targets} />

      {/* Reset */}
      <Button
        variant="danger"
        className="w-full"
        onClick={() => {
          if (window.confirm('Reset all data? This will delete your food log and reset your profile to defaults.')) {
            resetAllData();
          }
        }}
      >
        Reset All Data
      </Button>
    </motion.div>
  );
}
