'use client';

import { motion } from 'framer-motion';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { cn } from '@/lib/utils';

type ViewId = 'today' | 'chat' | 'week' | 'insights' | 'profile';

const tabs: { id: ViewId; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'chat', label: 'AI Chat' },
  { id: 'week', label: 'Week' },
  { id: 'insights', label: 'Insights' },
  { id: 'profile', label: 'Profile' },
];

export function BottomNav() {
  const activeView = useNutriStore((s) => s.activeView);
  const setActiveView = useNutriStore((s) => s.setActiveView);

  return (
    <nav aria-label="NutriTrack navigation" className="sticky top-0 z-10 border-b border-nt-border bg-nt-bg">
      <div className="flex" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => setActiveView(tab.id)}
              data-cursor="interactive"
              className={cn(
                'relative flex-1 py-3 text-xs transition-colors',
                isActive ? 'font-semibold text-nt-text' : 'font-normal text-nt-text-soft',
              )}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="nt-active-tab"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-nt-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
