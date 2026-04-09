'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useNutriStore } from '@/lib/nutritrack/hooks/useNutriStore';
import { BottomNav } from './BottomNav';
import { TodayView } from '../today/TodayView';
import { ChatView } from '../chat/ChatView';
import { WeekView } from '../week/WeekView';
import { InsightsView } from '../insights/InsightsView';
import { ProfileView } from '../profile/ProfileView';

function PlaceholderView({ label }: { label: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-nt-text-soft">{label} view coming soon</p>
    </div>
  );
}

function ActiveView({ view }: { view: string }) {
  switch (view) {
    case 'today':
      return <TodayView />;
    case 'chat':
      return <ChatView />;
    case 'week':
      return <WeekView />;
    case 'insights':
      return <InsightsView />;
    case 'profile':
      return <ProfileView />;
    default:
      return <PlaceholderView label={view.charAt(0).toUpperCase() + view.slice(1)} />;
  }
}

export function AppShell() {
  const activeView = useNutriStore((s) => s.activeView);

  return (
    <div className="mx-auto min-h-screen max-w-md bg-nt-bg">
      <BottomNav />
      <div className="px-4 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ActiveView view={activeView} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
