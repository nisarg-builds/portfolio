import { cn } from '@/lib/utils'

interface Star4Props {
  className?: string
  spin?: boolean
}

export function Star4({ className, spin = false }: Star4Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(spin && 'origin-center animate-spin-slow', className)}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M50 4 C54 28 62 40 96 50 C62 60 54 72 50 96 C46 72 38 60 4 50 C38 40 46 28 50 4 Z"
      />
    </svg>
  )
}
