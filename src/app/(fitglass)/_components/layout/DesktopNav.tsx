'use client';

import { useFitGlassStore, type ActiveView } from '@/lib/fitglass/hooks/useFitGlassStore';
import { cn } from '@/lib/utils';
import { CalendarIcon, ChartIcon, UserIcon } from './nav-icons';

type DesktopViewId = Exclude<ActiveView, 'chat'>;

interface NavItem {
  id: DesktopViewId;
  label: string;
  icon: React.ReactNode;
}

const items: NavItem[] = [
  { id: 'today', label: 'Today', icon: <CalendarIcon size={18} /> },
  { id: 'week', label: 'Week', icon: <ChartIcon size={18} /> },
  { id: 'profile', label: 'Profile', icon: <UserIcon size={18} /> },
];

interface DesktopNavProps {
  effectiveView: ActiveView;
}

export function DesktopNav({ effectiveView }: DesktopNavProps) {
  const setActiveView = useFitGlassStore((s) => s.setActiveView);

  return (
    <nav
      aria-label="FitGlass desktop navigation"
      className="block"
    >
      <div className="flex items-center gap-1 px-4 py-3">
        <span className="mr-4 text-sm font-semibold text-fg-accent">FitGlass</span>
        {items.map((item) => {
          const isActive = effectiveView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              data-cursor="interactive"
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors',
                isActive
                  ? 'bg-fg-accent/10 font-medium text-fg-accent'
                  : 'text-fg-text-soft hover:text-fg-text',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
