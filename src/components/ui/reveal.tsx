'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/hooks'

type RevealElement =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'header'
  | 'footer'
  | 'figure'
  | 'ul'
  | 'ol'
  | 'li'
  | 'p'
  | 'span'

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'whileInView'> {
  /** Position in a sequence. Each step adds 60ms, producing the stagger. */
  index?: number
  /** Extra delay in seconds, added on top of the index offset. */
  delay?: number
  /** Distance travelled, in pixels. Larger elements read better with more. */
  distance?: number
  /** Play on mount instead of on scroll — for above-the-fold content. */
  immediate?: boolean
  as?: RevealElement
}

const EASE = [0.16, 1, 0.3, 1] as const
const STAGGER_STEP = 0.06

/**
 * The site's only entrance gesture: a short rise into place.
 *
 * Every element observes independently rather than inheriting from a parent
 * variant tree, so a section deep in the page still animates correctly no
 * matter how it was composed. Under `prefers-reduced-motion` the component
 * renders its final state directly and never animates.
 */
export function Reveal({
  index = 0,
  delay = 0,
  distance = 20,
  immediate = false,
  as = 'div',
  children,
  ...props
}: RevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion()
  // The element varies, but every prop this component forwards (className,
  // style, children) is shared across all of them, so a single prop shape is
  // both accurate enough and far simpler than a generic polymorphic signature.
  const Component = motion[as] as React.ComponentType<HTMLMotionProps<'div'>>

  if (prefersReducedMotion) {
    return <Component {...props}>{children}</Component>
  }

  const transition = {
    duration: 0.7,
    ease: EASE,
    delay: delay + index * STAGGER_STEP,
  }

  const animation = immediate
    ? { animate: { opacity: 1, y: 0, transition } }
    : {
        whileInView: { opacity: 1, y: 0, transition },
        viewport: { once: true, amount: 0.15, margin: '0px 0px -8% 0px' },
      }

  return (
    <Component initial={{ opacity: 0, y: distance }} {...animation} {...props}>
      {children}
    </Component>
  )
}
