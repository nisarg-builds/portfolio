'use client'

import { motion } from 'framer-motion'
import { DynamicHeading } from '@/components/ui/dynamic-heading'
import { ZigzagDivider } from '@/components/ui/zigzag-divider'
import { scrollFadeUp, staggerContainer } from '@/lib/easings'
import { Bloom, Star4 } from '@/components/shapes'

export function BlogPageContent() {
  return (
    <main className="min-h-dvh px-5 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
      <motion.div
        className="mx-auto max-w-[960px]"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={scrollFadeUp}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3.5 py-1.5 font-mono text-xs font-semibold tracking-[0.14em] text-ink uppercase">
            <Star4 className="h-3 w-3 text-grape" />
            Writing
          </span>
          <DynamicHeading
            text="Blog"
            as="h1"
            className="font-display text-4xl font-bold text-ink"
          />
          <div className="mt-3">
            <ZigzagDivider width={100} className="text-grape" />
          </div>
        </motion.div>

        <motion.div
          variants={scrollFadeUp}
          className="mt-16 flex flex-col items-center justify-center py-16 text-center"
        >
          <Bloom className="w-24 text-lilac" />
          <p className="mt-8 font-display text-xl font-bold text-ink">
            Posts are sprouting
          </p>
          <p className="mt-2 max-w-[42ch] text-sm text-ink-soft">
            I&apos;m working on some posts about software development, design,
            and creative coding. Check back soon!
          </p>
        </motion.div>
      </motion.div>
    </main>
  )
}
