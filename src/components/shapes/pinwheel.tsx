import { cn } from '@/lib/utils'

interface PinwheelProps {
  className?: string
  spin?: boolean
}

const BLADE = 'M50 50 C 52 30, 60 14, 78 8 C 76 28, 66 44, 50 50 Z'

export function Pinwheel({ className, spin = false }: PinwheelProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(spin && 'origin-center animate-spin-slow', className)}
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={i}
          d={BLADE}
          transform={`rotate(${i * 45} 50 50)`}
          fill="currentColor"
        />
      ))}
    </svg>
  )
}
