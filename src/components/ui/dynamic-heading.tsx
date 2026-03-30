'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

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

  const getVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        delay: i * (staggerDelay / 1000),
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
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
              color: 'var(--color-accent)',
              transition: {
                type: 'spring',
                stiffness: 400,
                damping: 17,
              },
            }}
            className="inline-block cursor-default"
            style={{ perspective: '600px' }}
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
