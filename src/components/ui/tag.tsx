import { cn } from '@/lib/utils'

interface TagProps {
  children: React.ReactNode
  className?: string
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-block bg-bg-elevated text-text-secondary text-sm px-3 py-1 rounded-sm border border-border font-mono',
        className,
      )}
    >
      {children}
    </span>
  )
}
