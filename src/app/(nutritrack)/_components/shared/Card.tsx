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
      className={cn('rounded-xl border border-nt-border bg-nt-card p-5', className)}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
