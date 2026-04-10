'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFitGlassStore, type ActiveView } from '@/lib/fitglass/hooks/useFitGlassStore';
import { useMediaQuery } from '@/lib/fitglass/hooks/useMediaQuery';
import { BottomNav } from './BottomNav';
import { DesktopNav } from './DesktopNav';
import { AsyncLoadingBar } from '../shared/AsyncLoadingBar';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { TodayView } from '../today/TodayView';
import { ChatView } from '../chat/ChatView';
import { WeekView } from '../week/WeekView';
import { ProfileView } from '../profile/ProfileView';

function ViewSwitch({ view }: { view: ActiveView }) {
  switch (view) {
    case 'today':
      return <TodayView />;
    case 'chat':
      return <ChatView />;
    case 'week':
      return <WeekView />;
    case 'profile':
      return <ProfileView />;
    default: {
      const _exhaustive: never = view;
      return _exhaustive;
    }
  }
}

export function AppShell() {
  const activeView = useFitGlassStore((s) => s.activeView);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // On desktop, chat is always visible in right panel — show TodayView when chat is active
  const mainView = isDesktop && activeView === 'chat' ? 'today' : activeView;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-fg-bg">
      <AsyncLoadingBar />

      {/* Outer container — constrains both nav and content to same max-width */}
      <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col lg:max-w-6xl">
        {/* Desktop: top nav (inside container so it aligns with content) */}
        {isDesktop && <DesktopNav effectiveView={mainView} />}

        {/* Desktop: two-panel layout */}
        <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[1fr_400px] lg:gap-4">
          {/* Main content panel — on mobile chat, ChatView renders outside the scroll container */}
          {!isDesktop && mainView === 'chat' ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <ErrorBoundary>
                <ChatView />
              </ErrorBoundary>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 pb-20 pt-2 lg:pb-6">
              <ErrorBoundary>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mainView}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    <ViewSwitch view={mainView} />
                  </motion.div>
                </AnimatePresence>
              </ErrorBoundary>
            </div>
          )}

          {/* Desktop: persistent chat panel with rounded border */}
          {isDesktop && (
            <div className="my-3 flex flex-col overflow-hidden rounded-xl border border-fg-border bg-fg-card backdrop-blur-sm">
              <ErrorBoundary>
                <ChatView />
              </ErrorBoundary>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: bottom nav */}
      {!isDesktop && <BottomNav />}
    </div>
  );
}
