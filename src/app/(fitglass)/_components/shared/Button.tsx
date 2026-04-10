'use client';

import { type HTMLMotionProps, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-fg-accent text-white',
  ghost: 'border border-fg-border bg-transparent text-fg-text',
  danger: 'bg-fg-danger text-white',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        'rounded-lg font-medium disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      data-cursor="interactive"
      {...props}
    >
      {children}
    </motion.button>
  );
}
