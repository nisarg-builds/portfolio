import { cn } from '@/lib/utils'

interface ArchProps {
  className?: string
}

export function Arch({ className }: ArchProps) {
  return (
    <svg viewBox="0 0 100 100" className={cn(className)} aria-hidden="true">
      <path
        fill="currentColor"
        d="M14 96 V54 C14 30 30 14 50 14 C70 14 86 30 86 54 V96 H62 V56 C62 48 57 42 50 42 C43 42 38 48 38 56 V96 Z"
      />
    </svg>
  )
}
