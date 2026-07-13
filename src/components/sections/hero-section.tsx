'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/hooks'
import { easings } from '@/lib/easings'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { ShapeField } from '@/components/decorative/shape-field'
import { Arch, ArrowBolt, Bloom, Loops, Pinwheel, Star4 } from '@/components/shapes'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
}

const containerVariantsReduced = {
  hidden: {},
  visible: {
    transition: {
      duration: 0,
    },
  },
}

const fadeUp = (delay: number) => ({
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.5,
      ease: easings.easeOut,
    },
  },
})

const fadeUpInstant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
    },
  },
}

/* Words drop in like toys — scale overshoot instead of the old blur-in */
const wordVariants = {
  hidden: { opacity: 0, scale: 0.4, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.25 + i * 0.18,
      ...easings.springPop,
    },
  }),
}

const wordVariantsReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0,
    },
  },
}

/* Per-char hover flashes through the toy hues by index */
const HOVER_HUES = ['#4b48e8', '#2fbe5b', '#f421be', '#ff7a1f']

function LiveClock() {
  const [time, setTime] = useState<string>('')
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    function update() {
      const now = new Date()
      setDate(now.toLocaleDateString('en-GB'))
      setTime(
        now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!time) return null

  return (
    <span className="font-mono text-xs tracking-wider text-ink-faint [font-variant-numeric:tabular-nums]">
      {date} {time}
    </span>
  )
}

function AnimatedName({ reducedMotion }: { reducedMotion: boolean }) {
  const words: { text: string; accentFrom?: number }[] = [
    { text: 'Nisarg' },
    { text: 'Chaudhary', accentFrom: 5 }, // "hary" lands in blurple
  ]
  const variants = reducedMotion ? wordVariantsReduced : wordVariants

  return (
    <motion.h1
      className="font-display text-[clamp(2.6rem,7vw,6rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] text-ink"
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={word.text}
          custom={wordIndex}
          variants={variants}
          className="block w-fit whitespace-nowrap"
        >
          {word.text.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className={
                word.accentFrom != null && charIndex >= word.accentFrom
                  ? 'inline-block text-blurple'
                  : 'inline-block'
              }
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      scale: 1.15,
                      color: HOVER_HUES[charIndex % HOVER_HUES.length],
                      transition: easings.springPop,
                    }
              }
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.h1>
  )
}

function StatusBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1">
      <motion.span
        className="inline-block h-2 w-2 rounded-full bg-grass"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <span className="font-mono text-xs font-semibold text-ink">
        Available for opportunities
      </span>
    </div>
  )
}

/* The reference-image cluster: arch anchor, bloom overlap, pinwheel on an
   ink tile, loops, one free-floating star */
function HeroShapeCluster() {
  return (
    <ShapeField
      className="h-full w-full"
      items={[
        {
          shape: <Arch className="w-full text-blurple" />,
          position: 'left-[2%] top-[6%] w-[46%]',
          drift: 8,
          duration: 9,
          rotate: 2,
        },
        {
          shape: <Bloom className="w-full text-lilac" />,
          position: 'right-[8%] top-0 w-[34%]',
          drift: 10,
          duration: 7,
          rotate: 5,
          delay: 0.4,
        },
        {
          shape: (
            <div className="rounded-[24%] bg-ink p-[9%]">
              <Pinwheel spin className="block w-full text-grape" />
            </div>
          ),
          position: 'right-[2%] bottom-[8%] w-[38%]',
          drift: 7,
          duration: 10,
          rotate: 2,
          delay: 0.2,
        },
        {
          shape: <Loops className="w-full text-punch [--loops-inner:var(--color-tangerine)]" />,
          position: 'left-[6%] bottom-0 w-[30%]',
          drift: 9,
          duration: 8,
          rotate: 4,
          delay: 0.6,
        },
        {
          shape: <Star4 className="w-full text-grass" />,
          position: 'left-[44%] bottom-[16%] w-[13%]',
          drift: 12,
          duration: 6,
          rotate: 10,
          delay: 0.8,
        },
      ]}
    />
  )
}

export function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrollIndicatorVisible(latest < 100)
  })

  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden px-5 sm:px-6 lg:px-8"
    >
      {/* Mobile corner shapes */}
      <div className="pointer-events-none absolute inset-0 lg:hidden" aria-hidden="true">
        <Bloom className="absolute -right-6 top-[10%] w-24 text-lilac" />
        <Star4 className="absolute left-[4%] bottom-[14%] w-8 text-tangerine" />
      </div>

      <div className="mx-auto grid w-full max-w-[1120px] items-center gap-12 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-0">
        <motion.div
          variants={prefersReducedMotion ? containerVariantsReduced : containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status badge + clock row */}
          <motion.div
            variants={prefersReducedMotion ? fadeUpInstant : fadeUp(0.15)}
            className="mb-6 flex flex-wrap items-center gap-3"
          >
            <StatusBadge />
            <LiveClock />
          </motion.div>

          <AnimatedName reducedMotion={prefersReducedMotion} />

          <motion.p
            variants={prefersReducedMotion ? fadeUpInstant : fadeUp(0.7)}
            className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-display text-2xl font-bold text-ink"
          >
            Developer
            <Star4 className="h-3.5 w-3.5 shrink-0 text-grass" />
            Designer
            <Star4 className="h-3.5 w-3.5 shrink-0 text-punch" />
            Artist
            <Star4 className="h-3.5 w-3.5 shrink-0 text-tangerine" />
          </motion.p>

          <motion.p
            variants={prefersReducedMotion ? fadeUpInstant : fadeUp(0.85)}
            className="mt-3 max-w-[46ch] text-base text-ink-soft"
          >
            CS Honours + Studio Arts — currently building things that matter.
          </motion.p>

          <motion.div
            variants={prefersReducedMotion ? fadeUpInstant : fadeUp(1.0)}
            className="mt-9 flex flex-wrap gap-3.5"
          >
            <MagneticButton
              href="#projects"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-ink bg-ink px-7 py-3 font-display text-base font-bold text-canvas transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift-blurple"
            >
              View Projects
              <ArrowBolt className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="inline-flex min-h-[48px] items-center rounded-full border-2 border-ink px-7 py-3 font-display text-base font-bold text-ink transition-[transform,box-shadow,background-color] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime hover:shadow-lift"
            >
              Get in Touch
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Shape cluster — desktop only */}
        <motion.div
          className="relative hidden h-[420px] lg:block"
          initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.85 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, ...easings.springPlace }}
          aria-hidden="true"
        >
          <HeroShapeCluster />
        </motion.div>
      </div>

      {/* Scroll indicator — fades out after 100px scroll */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollIndicatorVisible ? 1 : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { delay: scrollIndicatorVisible ? 1.5 : 0, duration: 0.4 }}
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={prefersReducedMotion ? undefined : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5"
        >
          <span className="font-mono text-xs font-semibold tracking-widest text-ink-soft uppercase">
            scroll
          </span>
          <ArrowBolt direction="down" className="h-4 w-4 text-ink" />
        </motion.div>
      </motion.div>
    </section>
  )
}
