'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setDoc } from 'firebase/firestore';
import { getUserProfileRef } from '@/lib/fitglass/services/firebase-client';
import { useFitGlassStore } from '@/lib/fitglass/hooks/useFitGlassStore';
import { useAuth } from '@/lib/fitglass/hooks/useAuth';
import { ACTIVITY_LEVELS } from '@/lib/fitglass/constants/activityLevels';
import { cn } from '@/lib/utils';
import { StepIndicator } from './StepIndicator';
import type { FitnessGoal, Gender, UserProfile } from '@/lib/fitglass/models';

// ─── Constants ───

const GOAL_OPTIONS: { id: FitnessGoal; label: string }[] = [
  { id: 'fat_loss', label: 'Fat loss' },
  { id: 'maintenance', label: 'Maintain' },
  { id: 'muscle_gain', label: 'Muscle gain' },
];

const GOAL_RATES = [0.25, 0.5, 0.75, 1.0];

// ─── Shared UI ───

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
        active ? 'bg-fg-accent text-white' : 'border border-fg-border bg-transparent text-fg-text',
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
  const [draft, setDraft] = useState(String(value));

  // Sync draft when value changes externally
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setDraft(String(value));
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-fg-text-soft">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            const n = parseFloat(draft);
            if (!isNaN(n)) {
              const clamped = Math.min(max, Math.max(min, n));
              onChange(clamped);
              setDraft(String(clamped));
            } else {
              setDraft(String(value));
            }
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

// ─── Step data ───

interface OnboardingData {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: Gender;
  activityLevelId: string;
  goal: FitnessGoal;
  goalRateKgPerWeek: number;
}

const INITIAL_DATA: OnboardingData = {
  weightKg: 70,
  heightCm: 170,
  age: 25,
  gender: 'male',
  activityLevelId: 'moderate',
  goal: 'maintenance',
  goalRateKgPerWeek: 0.5,
};

// ─── Step Components ───

interface StepProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
}

function StepBody({ data, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <NumberField label="Weight" value={data.weightKg} onChange={(v) => onChange({ weightKg: v })} min={30} max={300} step={0.5} unit="kg" />
      <NumberField label="Height" value={data.heightCm} onChange={(v) => onChange({ heightCm: v })} min={100} max={250} unit="cm" />
      <NumberField label="Age" value={data.age} onChange={(v) => onChange({ age: v })} min={13} max={120} unit="yrs" />
    </div>
  );
}

function StepGender({ data, onChange }: StepProps) {
  return (
    <div className="flex gap-3">
      <ToggleButton active={data.gender === 'male'} onClick={() => onChange({ gender: 'male' })} className="flex-1 py-3">
        Male
      </ToggleButton>
      <ToggleButton active={data.gender === 'female'} onClick={() => onChange({ gender: 'female' })} className="flex-1 py-3">
        Female
      </ToggleButton>
    </div>
  );
}

function StepActivity({ data, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-2">
      {ACTIVITY_LEVELS.map((level) => (
        <ToggleButton
          key={level.id}
          active={data.activityLevelId === level.id}
          onClick={() => onChange({ activityLevelId: level.id })}
          className="w-full py-3 text-left"
        >
          {level.label}
        </ToggleButton>
      ))}
    </div>
  );
}

function StepGoal({ data, onChange }: StepProps) {
  const showRate = data.goal === 'fat_loss' || data.goal === 'muscle_gain';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        {GOAL_OPTIONS.map((opt) => (
          <ToggleButton
            key={opt.id}
            active={data.goal === opt.id}
            onClick={() => onChange({ goal: opt.id })}
            className="flex-1 py-3"
          >
            {opt.label}
          </ToggleButton>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {showRate && (
          <motion.div
            key="rate"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-fg-text-soft">
              Rate (kg/week)
            </label>
            <div className="flex gap-2">
              {GOAL_RATES.map((rate) => (
                <ToggleButton
                  key={rate}
                  active={data.goalRateKgPerWeek === rate}
                  onClick={() => onChange({ goalRateKgPerWeek: rate })}
                  className="flex-1 py-2"
                >
                  {rate}
                </ToggleButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Step definitions ───

interface StepDef {
  title: string;
  subtitle: string;
  component: React.ComponentType<StepProps>;
}

const STEPS: StepDef[] = [
  { title: 'Your body', subtitle: 'We need a few basics to calculate your targets.', component: StepBody },
  { title: 'Gender', subtitle: 'Used for metabolic rate calculation.', component: StepGender },
  { title: 'Activity level', subtitle: 'How active are you on a typical day?', component: StepActivity },
  { title: 'Your goal', subtitle: 'What are you working toward?', component: StepGoal },
];

// ─── Animation variants ───

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

// ─── Main Component ───

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user } = useAuth();
  const setStoreProfile = useFitGlassStore((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const isLastStep = step === STEPS.length - 1;

  const goNext = useCallback(async () => {
    if (!isLastStep) {
      setDirection(1);
      setStep((s) => s + 1);
      return;
    }

    // Final step — save to Firestore directly
    if (!user) return;
    setIsSaving(true);

    try {
      const now = new Date();
      const profile: UserProfile = {
        ...data,
        userId: user.uid,
        displayName: user.displayName ?? '',
        email: user.email ?? '',
        preferredUnits: 'metric',
        createdAt: now,
        updatedAt: now,
      };

      // Direct setDoc — NOT the debounced path
      const ref = getUserProfileRef(user.uid);
      await setDoc(ref, profile);

      // Update Zustand store (triggers target computation, no extra Firestore write needed
      // but the debounced write in setProfile is harmless since doc already exists)
      setStoreProfile(profile);

      setIsSaving(false);
      onComplete();
    } catch (error) {
      console.error('Failed to save onboarding profile:', error);
      setIsSaving(false);
    }
  }, [isLastStep, user, data, setStoreProfile, onComplete]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const CurrentStep = STEPS[step].component;

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-fg-bg px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-fg-text">FitGlass</h1>
          <p className="mt-1 text-sm text-fg-text-soft">Let&apos;s set up your profile</p>
        </div>

        {/* Step indicator */}
        <div className="mb-6">
          <StepIndicator totalSteps={STEPS.length} currentStep={step} />
        </div>

        {/* Step title */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-fg-text">{STEPS[step].title}</h2>
          <p className="mt-0.5 text-sm text-fg-text-soft">{STEPS[step].subtitle}</p>
        </div>

        {/* Step content */}
        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <CurrentStep data={data} onChange={handleChange} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={goBack}
              className="rounded-xl border border-fg-border px-6 py-3 text-sm font-medium text-fg-text transition-colors hover:bg-fg-surface"
              data-cursor="interactive"
            >
              Back
            </motion.button>
          )}

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={goNext}
            disabled={isSaving}
            className={cn(
              'flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-colors',
              isSaving ? 'cursor-not-allowed bg-fg-accent/50' : 'bg-fg-accent hover:bg-fg-accent/90',
            )}
            data-cursor="interactive"
          >
            {isSaving ? 'Saving...' : isLastStep ? 'Get Started' : 'Next'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
