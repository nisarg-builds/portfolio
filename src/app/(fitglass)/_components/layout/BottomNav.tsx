'use client';

import { motion } from 'framer-motion';
import { useFitGlassStore, type ActiveView } from '@/lib/fitglass/hooks/useFitGlassStore';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChatBubbleIcon, ChartIcon, UserIcon } from './nav-icons';

const tabs: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
  { id: 'today', label: 'Today', icon: <CalendarIcon /> },
  { id: 'chat', label: 'Chat', icon: <ChatBubbleIcon /> },
  { id: 'week', label: 'Week', icon: <ChartIcon /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon /> },
];

export function BottomNav() {
  const activeView = useFitGlassStore((s) => s.activeView);
  const setActiveView = useFitGlassStore((s) => s.setActiveView);

  return (
    <nav
      aria-label="FitGlass navigation"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-fg-border bg-fg-bg/80 backdrop-blur-md lg:hidden"
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
                isActive ? 'text-fg-accent' : 'text-fg-text-soft',
              )}
            >
              {tab.icon}
              {isActive && (
                <motion.div
                  layoutId="fg-active-tab"
                  className="absolute bottom-1 h-1 w-1 rounded-full bg-fg-accent"
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
