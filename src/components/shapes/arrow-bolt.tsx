import { cn } from '@/lib/utils'

interface ArrowBoltProps {
  className?: string
  direction?: 'right' | 'left' | 'up' | 'down'
}

const ROTATION: Record<NonNullable<ArrowBoltProps['direction']>, string> = {
  right: '',
  down: 'rotate-90',
  left: 'rotate-180',
  up: '-rotate-90',
}

export function ArrowBolt({ className, direction = 'right' }: ArrowBoltProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(ROTATION[direction], className)}
      aria-hidden="true"
    >
      <path fill="currentColor" d="M4 38 H56 V18 L96 50 L56 82 V62 H4 Z" />
    </svg>
  )
}
