'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePrefersReducedMotion } from '@/lib/hooks'

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

const variantStyles = {
  primary:
    'bg-accent text-bg font-medium hover:bg-accent-hover hover:shadow-glow',
  outline:
    'border border-accent text-accent hover:bg-accent hover:text-bg',
  ghost:
    'text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px]',
  md: 'px-4 py-2 text-base min-h-[40px]',
  lg: 'px-6 py-3 text-lg min-h-[48px]',
}

const springTransition = { type: 'spring', stiffness: 400, damping: 25 } as const

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
  const prefersReduced = usePrefersReducedMotion()

  const classes = cn(
    'inline-flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
    variantStyles[variant],
    sizeStyles[size],
    className,
  )

  const motionProps = prefersReduced
    ? {}
    : {
        whileHover: { y: -2 },
        whileTap: { scale: 0.97 },
        transition: springTransition,
      }

  if (href) {
    if (external) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          data-cursor="interactive"
          {...motionProps}
        >
          {children}
        </motion.a>
      )
    }

    return (
      <motion.div
        className="inline-block"
        {...motionProps}
      >
        <Link href={href} className={classes} data-cursor="interactive">
          {children}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      className={classes}
      data-cursor="interactive"
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
      {...motionProps}
    >
      {children}
    </motion.button>
  )
}
