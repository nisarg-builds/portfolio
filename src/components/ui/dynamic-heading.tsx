'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings } from '@/lib/easings'

interface DynamicHeadingProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span'
  className?: string
  animate?: boolean
  staggerDelay?: number
  triggerOnScroll?: boolean
}

const tagMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  span: 'span',
} as const

/* Hovered characters flash through the toy hues by index */
const HOVER_HUES = ['#4b48e8', '#2fbe5b', '#f421be', '#ff7a1f']

export function DynamicHeading({
  text,
  as = 'h2',
  className,
  animate = true,
  staggerDelay = 30,
  triggerOnScroll = false,
}: DynamicHeadingProps) {
  const Tag = tagMap[as]
  const characters = text.split('')

  /* Toybox pop-in: characters drop in like toys, with spring overshoot */
  const getVariants = {
    hidden: {
      opacity: 0,
      y: 14,
      scale: 0.4,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * (staggerDelay / 1000),
        ...easings.springPop,
      },
    }),
  }

  const scrollProps = triggerOnScroll
    ? { whileInView: 'visible' as const, viewport: { once: true, amount: 0.5 } }
    : { animate: 'visible' as const }

  return (
    <Tag className={cn('flex flex-wrap', className)}>
      {characters.map((char, i) => {
        if (char === ' ') {
          return (
            <span
              key={`${i}-space`}
              className="inline-block"
              style={{ width: '0.3em' }}
            />
          )
        }

        return animate ? (
          <motion.span
            key={`${i}-${char}`}
            custom={i}
            variants={getVariants}
            initial="hidden"
            {...scrollProps}
            whileHover={{
              scale: 1.15,
              color: HOVER_HUES[i % HOVER_HUES.length],
              transition: easings.springPop,
            }}
            className="inline-block cursor-default"
          >
            {char}
          </motion.span>
        ) : (
          <span key={`${i}-${char}`} className="inline-block">
            {char}
          </span>
        )
      })}
    </Tag>
  )
}
