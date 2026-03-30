'use client'

import { motion } from 'framer-motion'
import { easings } from '@/lib/easings'
import { FloatingElement } from '@/components/decorative/floating-element'
import { useEffect, useState } from 'react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeOut,
    },
  },
}

const charVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.035,
      duration: 0.4,
      ease: easings.easeOut,
    },
  }),
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

function AnimatedName({ text }: { text: string }) {
  return (
    <motion.h1
      className="font-(family-name:--font-display) text-display font-bold text-text-primary leading-[1] tracking-[-0.02em]"
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={charVariants}
          className="inline-block"
          style={char === ' ' ? { width: '0.3em' } : undefined}
          whileHover={{
            scale: 1.15,
            color: 'var(--color-accent)',
            transition: { type: 'spring', stiffness: 400, damping: 17 },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  )
}

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden px-5 sm:px-6 lg:px-8"
    >
      {/* Decorative floating elements — hidden on mobile */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <FloatingElement
          className="absolute right-[12%] top-[15%] opacity-40"
          drift={15}
          duration={7}
          rotate={3}
        >
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="var(--color-accent-secondary)" strokeWidth="1.5" opacity="0.5" />
            <circle cx="50" cy="50" r="20" stroke="var(--color-accent)" strokeWidth="1" opacity="0.3" />
          </svg>
        </FloatingElement>
        <FloatingElement
          className="absolute bottom-[25%] left-[8%] opacity-30"
          drift={12}
          duration={9}
          rotate={4}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path d="M30 5L35 25H55L39 35L44 55L30 43L16 55L21 35L5 25H25L30 5Z" stroke="var(--color-accent)" strokeWidth="1" opacity="0.4" />
          </svg>
        </FloatingElement>
        <FloatingElement
          className="absolute bottom-[20%] right-[18%] opacity-25"
          drift={18}
          duration={8}
          rotate={6}
        >
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            <rect x="10" y="10" width="30" height="30" rx="4" stroke="var(--color-accent-secondary)" strokeWidth="1" opacity="0.4" transform="rotate(15 25 25)" />
          </svg>
        </FloatingElement>
      </div>

      {/* Mobile floating element — just one subtle one */}
      <div className="pointer-events-none absolute inset-0 lg:hidden">
        <FloatingElement
          className="absolute right-[5%] top-[12%] opacity-25"
          drift={8}
          duration={7}
        >
          <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" stroke="var(--color-accent-secondary)" strokeWidth="1.5" opacity="0.4" />
          </svg>
        </FloatingElement>
      </div>

      <motion.div
        className="mx-auto w-full max-w-[800px] py-20 lg:py-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUpVariants} className="mb-4">
          <LiveClock />
        </motion.div>

        <motion.div variants={fadeUpVariants}>
          <AnimatedName text="Nisarg Chaudhary" />
        </motion.div>

        <motion.p
          variants={fadeUpVariants}
          className="mt-4 text-xl text-text-secondary"
        >
          Developer. Designer. Artist.
        </motion.p>

        <motion.p
          variants={fadeUpVariants}
          className="mt-2 text-base text-text-tertiary"
        >
          CS Honours + Studio Arts — currently building things that matter.
        </motion.p>

        <motion.div variants={fadeUpVariants} className="mt-8 flex gap-3">
          <a
            href="#projects"
            className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-base font-medium text-bg transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-glow"
            data-cursor="interactive"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-md border border-accent px-5 py-2.5 text-base text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-bg"
            data-cursor="interactive"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <span className="font-(family-name:--font-mono) text-xs text-text-tertiary">
              scroll
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-text-tertiary"
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
