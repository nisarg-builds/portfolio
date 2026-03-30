'use client'

import { motion } from 'framer-motion'
import { FloatingElement } from '@/components/decorative/floating-element'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { useEffect, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { usePrefersReducedMotion } from '@/lib/hooks'

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
      ease: [0.16, 1, 0.3, 1] as const,
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

const wordVariants = {
  hidden: { opacity: 0, filter: 'blur(12px)', y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
}

const wordVariantsReduced = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 0,
    },
  },
}

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
    <span className="font-(family-name:--font-mono) text-xs text-text-tertiary tracking-wider">
      {date} {time}
    </span>
  )
}

function AnimatedName({ text, reducedMotion }: { text: string; reducedMotion: boolean }) {
  const words = text.split(' ')
  const variants = reducedMotion ? wordVariantsReduced : wordVariants

  return (
    <motion.h1
      className="font-(family-name:--font-display) text-display font-bold text-text-primary leading-[1] tracking-[-0.02em]"
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex}>
          <motion.span
            custom={wordIndex}
            variants={variants}
            className="inline-block"
          >
            {word.split('').map((char, charIndex) => (
              <motion.span
                key={charIndex}
                className="inline-block"
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                        scale: 1.15,
                        color: 'var(--color-accent)',
                        transition: { type: 'spring', stiffness: 400, damping: 17 },
                      }
                }
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
          {wordIndex < words.length - 1 && (
            <span className="inline-block" style={{ width: '0.3em' }}>
              {'\u00A0'}
            </span>
          )}
        </span>
      ))}
    </motion.h1>
  )
}

function StatusBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-bg-surface px-3 py-1">
      <motion.span
        className="inline-block h-2 w-2 rounded-full bg-green-500"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <span className="text-xs text-text-secondary">
        Available for opportunities
      </span>
    </div>
  )
}

const botanicalDropShadow = { filter: 'drop-shadow(0 0 20px rgba(206, 121, 107, 0.1))' }

export function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrollIndicatorVisible(latest < 100)
  })

  const floatingFadeIn = prefersReducedMotion
    ? undefined
    : { delay: 1.3, duration: 0.6 }

  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden px-5 sm:px-6 lg:px-8"
    >
      {/* Decorative dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--color-text-tertiary) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient radial glow behind name */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          width: '800px',
          height: '600px',
          background:
            'radial-gradient(ellipse at center, rgba(206, 121, 107, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Decorative floating elements — hidden on mobile */}
      <motion.div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
        transition={floatingFadeIn}
      >
        <FloatingElement
          className="absolute right-[12%] top-[15%] opacity-20"
          drift={15}
          duration={7}
          rotate={3}
        >
          <img
            src="/images/decorative/flower.svg"
            alt=""
            width="80"
            height="80"
            style={botanicalDropShadow}
          />
        </FloatingElement>
        <FloatingElement
          className="absolute bottom-[25%] left-[8%] opacity-15"
          drift={10}
          duration={11}
          rotate={2}
        >
          <img
            src="/images/decorative/leaves.svg"
            alt=""
            width="70"
            height="70"
            style={botanicalDropShadow}
          />
        </FloatingElement>
        <FloatingElement
          className="absolute bottom-[20%] right-[18%] opacity-[0.18]"
          drift={12}
          duration={8.5}
          rotate={4}
        >
          <img
            src="/images/decorative/cactus.svg"
            alt=""
            width="55"
            height="55"
            style={botanicalDropShadow}
          />
        </FloatingElement>
      </motion.div>

      {/* Mobile floating element — just one subtle one */}
      <motion.div
        className="pointer-events-none absolute inset-0 lg:hidden"
        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1 }}
        transition={floatingFadeIn}
      >
        <FloatingElement
          className="absolute right-[5%] top-[12%] opacity-[0.12]"
          drift={8}
          duration={7}
        >
          <img
            src="/images/decorative/flower.svg"
            alt=""
            width="50"
            height="50"
            style={botanicalDropShadow}
          />
        </FloatingElement>
      </motion.div>

      <motion.div
        className="mx-auto w-full max-w-[800px] py-20 lg:py-0"
        variants={prefersReducedMotion ? containerVariantsReduced : containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge + clock row */}
        <motion.div
          variants={prefersReducedMotion ? fadeUpInstant : fadeUp(0.15)}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          <StatusBadge />
          <LiveClock />
        </motion.div>

        {/* Accent line above name */}
        <motion.div
          variants={prefersReducedMotion ? fadeUpInstant : fadeUp(0.2)}
          className="mb-5"
          aria-hidden="true"
        >
          <div
            className="h-px w-[200px]"
            style={{
              background:
                'linear-gradient(to right, transparent, var(--color-accent), transparent)',
            }}
          />
        </motion.div>

        <motion.div variants={prefersReducedMotion ? fadeUpInstant : fadeUp(0.3)}>
          <AnimatedName text="Nisarg Chaudhary" reducedMotion={prefersReducedMotion} />
        </motion.div>

        <motion.p
          variants={prefersReducedMotion ? fadeUpInstant : fadeUp(0.7)}
          className="mt-4 font-(family-name:--font-display) text-2xl text-text-secondary"
        >
          Developer<span className="text-accent">.</span>{' '}
          Designer<span className="text-accent">.</span>{' '}
          Artist<span className="text-accent">.</span>
        </motion.p>

        <motion.p
          variants={prefersReducedMotion ? fadeUpInstant : fadeUp(0.9)}
          className="mt-2 text-base text-text-tertiary"
        >
          CS Honours + Studio Arts — currently building things that matter.
        </motion.p>

        <motion.div
          variants={prefersReducedMotion ? fadeUpInstant : fadeUp(1.1)}
          className="mt-8 flex gap-3"
        >
          <MagneticButton
            href="#projects"
            className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-base font-medium text-bg transition-all duration-200 hover:bg-accent-hover hover:shadow-glow-lg"
          >
            View Projects
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-base text-accent transition-all duration-200 hover:border-accent hover:bg-accent/10"
          >
            Get in Touch
          </MagneticButton>
        </motion.div>

        {/* Scroll indicator — fades out after 100px scroll */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollIndicatorVisible ? 1 : 0 }}
          transition={prefersReducedMotion ? { duration: 0 } : { delay: scrollIndicatorVisible ? 1.5 : 0, duration: 0.4 }}
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
            transition={prefersReducedMotion ? undefined : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <span className="font-(family-name:--font-mono) text-xs text-accent/70">
              scroll
            </span>
            <div
              className="mb-1 h-4 w-px bg-accent/40"
              aria-hidden="true"
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-accent"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
