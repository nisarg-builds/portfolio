'use client'

import { cn } from '@/lib/utils'
import { FloatingElement } from '@/components/decorative/floating-element'

export interface ShapeFieldItem {
  shape: React.ReactNode
  /** Absolute positioning + sizing classes, e.g. 'left-[6%] top-[4%] w-[44%]' */
  position: string
  drift?: number
  duration?: number
  rotate?: number
  delay?: number
}

interface ShapeFieldProps {
  items: ShapeFieldItem[]
  className?: string
}

/**
 * A cluster of drifting decorative shapes. The container is positioned by
 * the caller; each item is placed absolutely within it and floats via
 * FloatingElement (which goes static under reduced motion).
 */
export function ShapeField({ items, className }: ShapeFieldProps) {
  return (
    <div
      className={cn('pointer-events-none relative', className)}
      aria-hidden="true"
    >
      {items.map((item, i) => (
        <div key={i} className={cn('absolute', item.position)}>
          <FloatingElement
            drift={item.drift ?? 10}
            duration={item.duration ?? 7}
            rotate={item.rotate ?? 4}
            delay={item.delay ?? 0}
          >
            {item.shape}
          </FloatingElement>
        </div>
      ))}
    </div>
  )
}
