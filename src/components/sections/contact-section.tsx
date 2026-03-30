'use client'

import { motion } from 'framer-motion'
import { scrollFadeUp, staggerContainer } from '@/lib/easings'
import { SOCIAL_LINKS } from '@/lib/constants'

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
      className="text-text-secondary transition-colors duration-250 hover:text-accent"
      data-cursor="interactive"
    >
      {children}
    </a>
  )
}

function WavyLine() {
  return (
    <svg
      width="100%"
      height="12"
      viewBox="0 0 287 15"
      fill="none"
      preserveAspectRatio="none"
      className="mt-2 max-w-[180px]"
    >
      <path
        d="M2 6.5C2 6.5 4.6 13 11.8 13C19 13 25.5 2 33.3 2C41 2 46.9 13 55.9 13C65 13 67.6 2 76.8 2C86 2 90.2 13 100.1 13C110 13 111.8 2 120.9 2C130 2 134.9 13 144.2 13C153.5 13 156.6 2 165.1 2C173.5 2 177.2 13 188.3 13C199.5 13 199.9 2 209.2 2C218.5 2 223 13 232.5 13C242 13 244 2 253.3 2C262.6 2 269 13 274.5 13C280 13 285 8.5 285 7.5"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="flex min-h-[50vh] items-center px-5 py-16 sm:px-6 lg:min-h-[60vh] lg:px-8 lg:py-24"
    >
      <motion.div
        className="mx-auto w-full max-w-[1120px] text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={scrollFadeUp}>
          <h2 className="font-(family-name:--font-display) text-3xl font-bold text-text-primary">
            Get in Touch
          </h2>
          <div className="flex justify-center">
            <WavyLine />
          </div>
        </motion.div>

        <motion.p
          variants={scrollFadeUp}
          className="mx-auto mt-8 max-w-md text-xl text-text-secondary"
        >
          Feel <span className="text-accent">free</span> to connect with me!
        </motion.p>

        <motion.div
          variants={scrollFadeUp}
          className="mt-8 flex items-center justify-center gap-6"
        >
          <SocialLink href={SOCIAL_LINKS.github} label="Visit GitHub profile">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </SocialLink>

          <SocialLink href={SOCIAL_LINKS.linkedin} label="Visit LinkedIn profile">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </SocialLink>

          <SocialLink href={SOCIAL_LINKS.instagram} label="Visit Instagram profile">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </SocialLink>

          <SocialLink href={SOCIAL_LINKS.email} label="Send email">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7L13.03 12.7a1.94 1.94 0 01-2.06 0L2 7" />
            </svg>
          </SocialLink>
        </motion.div>

        {/* Divider */}
        <motion.div variants={scrollFadeUp} className="mt-8 flex justify-center">
          <svg width="127" height="2" viewBox="0 0 227 2" fill="none">
            <line
              x1="0.996"
              y1="1"
              x2="226"
              y2="1"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        <motion.div variants={scrollFadeUp} className="mt-8">
          <a
            href="mailto:chaudharynisarg555@gmail.com"
            className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-base font-medium text-bg transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-glow"
            data-cursor="interactive"
          >
            Say Hello
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
