import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  external?: boolean
  children: React.ReactNode
  className?: string
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

export function Button({
  variant = 'outline',
  size = 'md',
  href,
  external,
  children,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-md transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2',
    variantStyles[variant],
    sizeStyles[size],
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
        >
          {children}
        </a>
      )
    }

    return (
      <Link href={href} className={classes} data-cursor="interactive">
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} data-cursor="interactive" {...props}>
      {children}
    </button>
  )
}
