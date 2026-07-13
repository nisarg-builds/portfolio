import { cn } from '@/lib/utils'
import { Arch, ArrowBolt, Bloom, Loops, Ring, Star4 } from '@/components/shapes'

interface ProjectMascotProps {
  /** Project order — picks the mascot per docs/07 §3.3 */
  index: number
  className?: string
}

/* One recognizable shape per project, shared by the treemap cells and the
   detail-page hue band. */
export function ProjectMascot({ index, className }: ProjectMascotProps) {
  switch (index % 6) {
    case 0:
      return <Loops className={cn('text-lime [--loops-inner:var(--color-sky)]', className)} />
    case 1:
      return <Bloom className={cn('text-grape', className)} />
    case 2:
      return <Arch className={cn('text-ink', className)} />
    case 3:
      return <ArrowBolt className={cn('text-ink', className)} />
    case 4:
      return <Star4 className={cn('text-grape', className)} />
    default:
      return <Ring className={cn('text-ink', className)} />
  }
}
