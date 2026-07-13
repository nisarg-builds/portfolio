'use client'

import { motion } from 'framer-motion'
import { scrollFadeUp, staggerContainer } from '@/lib/easings'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Pinwheel, Star4 } from '@/components/shapes'

/* The one dark moment on the site: a full-bleed ink band that fuses with
   the footer below it. Shapes spill over the top corners like stickers. */
export function ContactSection() {
  return (
    <section id="contact" className="mt-20 lg:mt-32">
      <div className="on-ink relative rounded-t-2xl bg-ink px-5 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28">
        {/* Corner stickers */}
        <div
          className="pointer-events-none absolute -top-8 left-[7%] w-16 text-grape lg:w-20"
          aria-hidden="true"
        >
          <Pinwheel spin className="w-full" />
        </div>
        <Star4
          className="pointer-events-none absolute -top-4 right-[10%] w-9 text-punch"
        />

        <motion.div
          className="mx-auto w-full max-w-[1120px] text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={scrollFadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-lime px-3.5 py-1.5 font-mono text-xs font-semibold tracking-[0.14em] text-lime uppercase">
              Get in Touch
            </span>
          </motion.div>

          <motion.h2
            variants={scrollFadeUp}
            className="mx-auto mt-7 max-w-[16ch] font-display text-4xl font-bold uppercase leading-[1.02] text-canvas sm:text-5xl lg:text-6xl"
          >
            Let&apos;s make something
          </motion.h2>

          <motion.p
            variants={scrollFadeUp}
            className="mx-auto mt-6 max-w-md text-lg text-canvas/75"
          >
            Have a project in mind? Feel free to connect — the inbox is
            always open.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={scrollFadeUp}
            className="mt-10 flex flex-wrap items-center justify-center gap-3.5"
          >
            <MagneticButton
              href="mailto:chaudharynisarg555@gmail.com"
              className="inline-flex min-h-[48px] items-center rounded-full border-2 border-lime bg-lime px-8 py-3.5 font-display text-lg font-bold text-ink transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift-punch"
            >
              Say Hello
            </MagneticButton>
            <MagneticButton
              href="/resume.pdf"
              className="inline-flex min-h-[48px] items-center rounded-full border-2 border-canvas px-8 py-3.5 font-display text-lg font-bold text-canvas transition-[transform,box-shadow,background-color,color] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-canvas hover:text-ink hover:shadow-lift-punch"
            >
              Resume
            </MagneticButton>
          </motion.div>

          {/* Location — socials live in the footer strip just below */}
          <motion.p
            variants={scrollFadeUp}
            className="mt-10 font-mono text-xs text-canvas/60"
          >
            Based in Saskatchewan, Canada
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
