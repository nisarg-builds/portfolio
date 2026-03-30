import { cn } from '@/lib/utils'

interface WavyDividerProps {
  className?: string
  width?: string
}

export function WavyDivider({ className, width = '100%' }: WavyDividerProps) {
  return (
    <svg
      viewBox="0 0 600 20"
      preserveAspectRatio="none"
      className={cn('block h-3', className)}
      style={{ width }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 10 C50 0, 100 20, 150 10 S250 0, 300 10 S400 20, 450 10 S550 0, 600 10"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
