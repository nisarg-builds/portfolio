import { cn } from '@/lib/utils'

interface RingProps {
  className?: string
}

export function Ring({ className }: RingProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn(className)} aria-hidden="true">
      <circle
        cx="50"
        cy="50"
        r="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="16"
      />
    </svg>
  )
}
