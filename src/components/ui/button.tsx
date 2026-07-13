'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
}

/* Sticker recipe (docs/07 Appendix B): pill, 2px ink border, flat at rest,
   lifts onto a hard shadow on hover, physically clicks down on press. */
const variantStyles = {
  primary: cn(
    'border-2 border-ink bg-ink text-canvas',
    'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift-blurple',
    'active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_0_var(--color-blurple)]',
  ),
  outline: cn(
    'border-2 border-ink bg-transparent text-ink',
    'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime hover:shadow-lift',
    'active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_0_var(--color-ink)]',
  ),
  ghost: 'border-2 border-transparent text-ink hover:text-blurple',
}

const sizeStyles = {
  sm: 'px-4 py-1.5 text-sm min-h-[32px] gap-1.5',
  md: 'px-6 py-2 text-base min-h-[40px] gap-2',
  lg: 'px-7 py-3 text-lg min-h-[48px] gap-2.5',
}

export function Button({
  variant = 'outline',
  size = 'md',
  href,
  external,
  children,
  className,
  onClick,
  disabled,
  type,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = cn(
    'group inline-flex cursor-pointer items-center justify-center rounded-full font-display font-bold transition-[transform,box-shadow,background-color,color] duration-200',
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'pointer-events-none opacity-50',
    className,
  )

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          data-cursor="interactive"
          aria-label={ariaLabel}
        >
          {children}
        </a>
      )
    }

    return (
      <Link
        href={href}
        className={classes}
        data-cursor="interactive"
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      data-cursor="interactive"
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
