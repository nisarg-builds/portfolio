'use client'

import { motion } from 'framer-motion'
import { scrollFadeUp, staggerContainer } from '@/lib/easings'
import { SOCIAL_LINKS } from '@/lib/constants'
import { MagneticButton } from '@/components/ui/magnetic-button'

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      aria-label={label}
      className="group/icon flex items-center justify-center"
      data-cursor="interactive"
    >
      <div className="glass flex h-12 w-12 items-center justify-center rounded-xl border border-transparent text-text-secondary transition-all duration-300 group-hover/icon:border-accent/30 group-hover/icon:scale-105 group-hover/icon:text-accent group-hover/icon:shadow-[0_0_20px_rgba(206,121,107,0.15)]">
        {children}
      </div>
    </a>
  )
}

function DecorativeDivider() {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/40 sm:w-24" />
      <span className="text-sm text-accent" aria-hidden="true">
        ✦
      </span>
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/40 sm:w-24" />
    </div>
  )
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="flex min-h-[60vh] items-center px-5 py-20 sm:px-6 lg:min-h-[70vh] lg:px-8 lg:py-32"
    >
      <motion.div
        className="mx-auto w-full max-w-[1120px] text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Heading with ambient glow */}
        <motion.div variants={scrollFadeUp} className="relative">
          <span
            className="pointer-events-none absolute top-[-0.15em] left-[-0.03em] select-none font-(family-name:--font-display) text-[15vw] font-bold leading-none text-text-primary opacity-[0.03] lg:text-[12vw]"
            aria-hidden="true"
          >
            03
          </span>
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                'radial-gradient(circle, rgba(206,121,107,0.06) 0%, transparent 70%)',
            }}
            aria-hidden="true"
          />
          <h2 className="font-(family-name:--font-display) relative text-4xl font-bold text-text-primary sm:text-5xl lg:text-display">
            Get in{' '}
            <span className="text-gradient-accent">Touch</span>
          </h2>
        </motion.div>

        {/* Message */}
        <motion.p
          variants={scrollFadeUp}
          className="mx-auto mt-8 max-w-md text-lg text-text-secondary sm:text-xl"
        >
          Have a project in mind?{' '}
          <span className="text-accent">Let&apos;s create</span> something
          beautiful together.
        </motion.p>

        {/* Social icons */}
        <motion.div
          variants={scrollFadeUp}
          className="mt-10 flex items-center justify-center gap-4 sm:gap-5"
        >
          <SocialLink href={SOCIAL_LINKS.github} label="Visit GitHub profile">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </SocialLink>

          <SocialLink href={SOCIAL_LINKS.linkedin} label="Visit LinkedIn profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </SocialLink>

          <SocialLink href={SOCIAL_LINKS.instagram} label="Visit Instagram profile">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </SocialLink>

          <SocialLink href={SOCIAL_LINKS.email} label="Send email">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7L13.03 12.7a1.94 1.94 0 01-2.06 0L2 7" />
            </svg>
          </SocialLink>
        </motion.div>

        {/* Location */}
        <motion.p
          variants={scrollFadeUp}
          className="mt-4 font-(family-name:--font-mono) text-xs text-text-tertiary"
        >
          Based in Saskatchewan, Canada
        </motion.p>

        {/* Decorative divider */}
        <motion.div variants={scrollFadeUp} className="mt-10">
          <DecorativeDivider />
        </motion.div>

        {/* CTA button with pulsing glow */}
        <motion.div variants={scrollFadeUp} className="relative mt-10 inline-block">
          <div
            className="absolute inset-0 animate-pulse rounded-md bg-gradient-to-r from-accent to-accent-secondary opacity-50 blur-xl"
            aria-hidden="true"
          />
          <MagneticButton
            href="mailto:chaudharynisarg555@gmail.com"
            className="relative inline-flex items-center rounded-md bg-gradient-to-r from-accent to-accent-secondary px-8 py-4 text-lg font-medium text-bg transition-all duration-200 hover:shadow-glow-lg"
          >
            Say Hello
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  )
}
