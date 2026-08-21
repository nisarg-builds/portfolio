'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NAV_LINKS, SITE_YEAR, SOCIAL_PROFILES } from '@/lib/constants'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { SocialIconLink } from '@/components/ui/social-icon'
import { usePrefersReducedMotion } from '@/lib/hooks'

const EASE = [0.16, 1, 0.3, 1] as const

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock the page behind the mobile menu.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Escape closes, and focus returns to the control that opened the menu.
  useEffect(() => {
    if (!isOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Close on navigation.
  const [previousPath, setPreviousPath] = useState(pathname)
  if (pathname !== previousPath) {
    setPreviousPath(pathname)
    setIsOpen(false)
  }

  // Keep tab focus inside the open menu.
  useEffect(() => {
    if (!isOpen) return
    const menu = menuRef.current
    if (!menu) return

    // The close button renders in the fixed header rather than inside the
    // dialog, so it has to be spliced into the ring by hand — otherwise Tab
    // can never reach the only visible way to close the menu.
    const inMenu = Array.from(
      menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    )
    const focusables = toggleRef.current ? [toggleRef.current, ...inMenu] : inMenu
    if (focusables.length === 0) return

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    first.focus()

    function handleTab(event: KeyboardEvent) {
      if (event.key !== 'Tab') return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    menu.addEventListener('keydown', handleTab)
    return () => menu.removeEventListener('keydown', handleTab)
  }, [isOpen])

  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/'
      // "/#projects" should also read as active on a project detail page.
      const route = href.replace('/#', '/')
      return pathname.startsWith(route)
    },
    [pathname],
  )

  const menuLinks = [...NAV_LINKS, { label: 'Contact', href: '/#contact' }]

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
          isScrolled
            ? 'border-b border-(--color-line) bg-bg/85 backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        <nav
          aria-label="Main"
          className="gutter mx-auto flex h-14 max-w-[1440px] items-center justify-between lg:h-[4.5rem]"
        >
          {/* Monogram, with the year set as a colophon mark. */}
          <Link
            href="/"
            aria-label="Nisarg Chaudhary — home"
            className="group inline-flex items-start gap-[3px] text-text-primary"
            data-cursor="interactive"
          >
            <span className="font-(family-name:--font-display) text-lg font-bold leading-none tracking-[-0.05em] transition-colors duration-200 group-hover:text-accent">
              NC
            </span>
            <span
              className="numeral mt-[1px] text-[0.5rem] leading-none text-text-tertiary"
              aria-hidden="true"
            >
              &copy;{String(SITE_YEAR).slice(-2)}
            </span>
          </Link>

          {/* Desktop links, set in the caption layer. */}
          <div className="hidden items-center lg:flex">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'meta link-retract inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-text-primary',
                      isActive(link.href) ? 'text-accent' : 'text-text-tertiary',
                    )}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    data-cursor="interactive"
                  >
                    {isActive(link.href) && (
                      <span
                        className="inline-block h-[3px] w-[3px] bg-accent"
                        aria-hidden="true"
                      />
                    )}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <span className="mx-6 h-4 w-px bg-(--color-line)" aria-hidden="true" />

            <Link
              href="/#contact"
              className="meta group inline-flex items-center gap-2 border border-(--color-line) px-3.5 py-2 text-text-primary transition-colors duration-200 hover:border-accent hover:text-accent"
              data-cursor="interactive"
            >
              Contact
              <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                &#8594;
              </span>
            </Link>

            <ThemeToggle className="ml-2" />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsOpen((open) => !open)}
              className="relative z-50 -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
              data-cursor="interactive"
            >
              <span
                className={cn(
                  'block h-px w-6 bg-text-primary transition-transform duration-300',
                  isOpen && 'translate-y-[3px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'block h-px w-6 bg-text-primary transition-transform duration-300',
                  isOpen && '-translate-y-[3px] -rotate-45',
                )}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-bg lg:hidden"
          >
            {/* The fixed header sits above this overlay and already carries
                the monogram and the close control, so this row is spacing only. */}
            <div className="h-14 shrink-0" aria-hidden="true" />

            <ul className="gutter flex flex-1 flex-col justify-center">
              {menuLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: EASE }}
                  className="rule"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-baseline gap-4 py-4 font-(family-name:--font-display) text-2xl font-medium tracking-tight transition-colors duration-200',
                      isActive(link.href) ? 'text-accent' : 'text-text-primary',
                    )}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    data-cursor="interactive"
                  >
                    <span className="meta numeral text-text-tertiary" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4, ease: EASE }}
              className="gutter rule flex shrink-0 items-center justify-between py-6"
            >
              <span className="meta text-text-tertiary">Saskatoon, SK</span>
              <div className="flex items-center gap-5">
                {SOCIAL_PROFILES.map((profile) => (
                  <SocialIconLink
                    key={profile.platform}
                    platform={profile.platform}
                    href={profile.href}
                    label={profile.label}
                    size={18}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
