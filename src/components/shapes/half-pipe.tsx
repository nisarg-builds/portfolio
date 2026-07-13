import { cn } from '@/lib/utils'

interface HalfPipeProps {
  className?: string
}

export function HalfPipe({ className }: HalfPipeProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn(className)} aria-hidden="true">
      <path fill="currentColor" d="M6 72 A 44 44 0 0 1 94 72 Z" />
    </svg>
  )
}
