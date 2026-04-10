'use client';

import { motion } from 'framer-motion';
import { useNutriStore, type ActiveView } from '@/lib/nutritrack/hooks/useNutriStore';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChatBubbleIcon, ChartIcon, UserIcon } from './nav-icons';

const tabs: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
  { id: 'today', label: 'Today', icon: <CalendarIcon /> },
  { id: 'chat', label: 'Chat', icon: <ChatBubbleIcon /> },
  { id: 'week', label: 'Week', icon: <ChartIcon /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon /> },
];

export function BottomNav() {
  const activeView = useNutriStore((s) => s.activeView);
  const setActiveView = useNutriStore((s) => s.setActiveView);

  return (
    <nav
      aria-label="NutriTrack navigation"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-nt-border bg-nt-bg/80 backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex max-w-md" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => setActiveView(tab.id)}
              data-cursor="interactive"
              className={cn(
                'relative flex flex-1 flex-col items-center gap-0.5 py-3 transition-colors',
                isActive ? 'text-nt-accent' : 'text-nt-text-soft',
              )}
            >
              {tab.icon}
              {isActive && (
                <motion.div
                  layoutId="nt-active-tab"
                  className="absolute bottom-1 h-1 w-1 rounded-full bg-nt-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
