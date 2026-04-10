'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function Card({ children, className, 'aria-label': ariaLabel }: CardProps) {
  return (
    <div
      className={cn('rounded-xl border border-fg-border bg-fg-card backdrop-blur-sm p-5', className)}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
