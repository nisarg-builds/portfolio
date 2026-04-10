'use client';

import { useNutriStore, type ActiveView } from '@/lib/nutritrack/hooks/useNutriStore';
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
  const setActiveView = useNutriStore((s) => s.setActiveView);

  return (
    <nav
      aria-label="NutriTrack desktop navigation"
      className="block"
    >
      <div className="flex items-center gap-1 px-4 py-3">
        <span className="mr-4 text-sm font-semibold text-nt-accent">NutriTrack</span>
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
                  ? 'bg-nt-accent/10 font-medium text-nt-accent'
                  : 'text-nt-text-soft hover:text-nt-text',
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
