'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PRESET_QUICK_FOODS } from '@/lib/nutritrack/constants/quickFoods';
import { validateFoodEntry } from '@/lib/nutritrack/utils/validators';
import { inferMealType } from '@/lib/nutritrack/utils/converters';
import { getDateKey } from '@/lib/nutritrack/utils/dates';
import { useFoodLog } from '@/lib/nutritrack/hooks/useFoodLog';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import type { NutritionData } from '@/lib/nutritrack/models';

interface AddFoodModalProps {
  onClose: () => void;
}

export function AddFoodModal({ onClose }: AddFoodModalProps) {
  const { addFood } = useFoodLog();
  const user = useNutriStore((s) => s.user);

  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [error, setError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-focus search on mount
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Escape key to dismiss
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Basic focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const focusable = modal!.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  const filteredQuickFoods = search.trim()
    ? PRESET_QUICK_FOODS.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
    : PRESET_QUICK_FOODS;

  const logQuickFood = useCallback(
    async (nutrition: NutritionData, foodName: string) => {
      if (!user) return;
      await addFood({
        userId: user.uid,
        name: foodName,
        nutrition,
        mealType: inferMealType(),
        source: 'quick_add',
        dateKey: getDateKey(),
        loggedAt: new Date(),
      });
      onClose();
    },
    [user, addFood, onClose],
  );

  const handleAddCustom = useCallback(async () => {
    setError('');
    const cal = Number(calories) || 0;
    const p = Number(protein) || 0;
    const c = Number(carbs) || 0;
    const f = Number(fat) || 0;

    const result = validateFoodEntry({
      name: name.trim(),
      calories: cal,
      proteinG: p,
      carbsG: c,
      fatG: f,
    });

    if (!result.valid) {
      setError(result.errors[0]);
      return;
    }

    if (!user) return;

    await addFood({
      userId: user.uid,
      name: name.trim(),
      nutrition: { calories: cal, proteinG: p, carbsG: c, fatG: f },
      mealType: inferMealType(),
      source: 'manual',
      dateKey: getDateKey(),
      loggedAt: new Date(),
    });
    onClose();
  }, [name, calories, protein, carbs, fat, user, addFood, onClose]);

  const canAdd = name.trim().length > 0 && Number(calories) > 0;

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Add food"
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-2xl bg-nt-card"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="max-h-[85vh] overflow-y-auto p-5">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-nt-text">Add food</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-nt-text-soft transition-colors hover:text-nt-text"
              aria-label="Close"
              data-cursor="interactive"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M5 5l10 10M15 5l-10 10" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <input
            ref={searchRef}
            type="text"
            placeholder="Search quick foods..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3 w-full rounded-lg border border-nt-border bg-nt-bg px-3 py-2 text-sm text-nt-text placeholder:text-nt-text-soft focus:border-nt-accent focus:outline-none"
          />

          {/* Quick foods list */}
          <div className="mb-4 max-h-48 overflow-y-auto">
            {filteredQuickFoods.length === 0 ? (
              <p className="py-3 text-center text-xs text-nt-text-soft">No matches</p>
            ) : (
              filteredQuickFoods.map((food) => (
                <button
                  key={food.name}
                  onClick={() => logQuickFood(food.nutrition, food.name)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-nt-bg"
                  data-cursor="interactive"
                >
                  <span className="text-sm text-nt-text">{food.name}</span>
                  <span className="shrink-0 text-xs text-nt-text-soft">
                    {food.nutrition.calories} kcal
                  </span>
                </button>
              ))
            )}
          </div>

          {/* Divider */}
          <div className="mb-4 border-t border-nt-border" aria-hidden="true" />

          {/* Custom food */}
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-nt-text-soft">
            Custom food
          </p>

          <input
            type="text"
            placeholder="Food name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3 w-full rounded-lg border border-nt-border bg-nt-bg px-3 py-2 text-sm text-nt-text placeholder:text-nt-text-soft focus:border-nt-accent focus:outline-none"
          />

          <div className="mb-3 grid grid-cols-2 gap-2">
            <NumberInput label="Calories" value={calories} onChange={setCalories} />
            <NumberInput label="Protein (g)" value={protein} onChange={setProtein} />
            <NumberInput label="Carbs (g)" value={carbs} onChange={setCarbs} />
            <NumberInput label="Fat (g)" value={fat} onChange={setFat} />
          </div>

          {error && <p className="mb-2 text-xs text-nt-danger">{error}</p>}

          <button
            onClick={handleAddCustom}
            disabled={!canAdd}
            className="w-full rounded-lg bg-nt-accent py-2.5 text-sm font-medium text-white disabled:opacity-50"
            data-cursor="interactive"
          >
            Add custom food
          </button>
        </div>
      </motion.div>
    </>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-nt-text-soft">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-nt-border bg-nt-bg px-3 py-2 text-sm text-nt-text placeholder:text-nt-text-soft focus:border-nt-accent focus:outline-none"
      />
    </div>
  );
}
