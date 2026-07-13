'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants'
import { Bloom, Star4 } from '@/components/shapes'
import { SocialIcon } from '@/components/ui/social-icon'

interface NavigationProps {
  className?: string
}

const menuVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const },
  },
  open: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const linkVariants = {
  closed: { opacity: 0, y: 20 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 + i * 0.05,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
}

export function Navigation({ className }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Track scroll for the solid paper bar
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close menu on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Close menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setIsOpen(false)
  }

  const menuRef = useRef<HTMLDivElement>(null)

  // Focus trap: cycle focus within mobile menu when open
  useEffect(() => {
    if (!isOpen || !menuRef.current) return
    const menu = menuRef.current
    const focusables = menu.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length === 0) return

    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    first.focus()

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    menu.addEventListener('keydown', handleTab)
    return () => menu.removeEventListener('keydown', handleTab)
  }, [isOpen])

  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/'
      return pathname.startsWith(href.replace('/#', '/'))
    },
    [pathname]
  )

  const allNavLinks = [...NAV_LINKS, { label: 'Contact', href: '/#contact' }]

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled && 'border-b-2 border-ink bg-paper',
          className
        )}
      >
        {/* Desktop Nav */}
        <div className="mx-auto hidden h-16 max-w-7xl items-center justify-between px-6 lg:flex">
          <Link
            href="/"
            className="inline-flex items-baseline gap-1.5 font-display text-xl font-bold text-ink transition-colors duration-300 hover:text-blurple"
            data-cursor="interactive"
          >
            Nisarg
            <Star4 className="h-2.5 w-2.5 shrink-0 self-center text-tangerine" />
          </Link>

          <LayoutGroup>
            <div className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'nav-link relative text-sm font-medium text-ink-soft transition-colors duration-200 hover:text-ink',
                    isActive(link.href) && 'text-ink'
                  )}
                  data-cursor="interactive"
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 left-1/2 block -translate-x-1/2"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    >
                      <Star4 className="h-2 w-2 text-blurple" />
                    </motion.span>
                  )}
                </Link>
              ))}
              <Link
                href="/#contact"
                className="rounded-full border-2 border-ink bg-ink px-4 py-1.5 font-display text-sm font-bold text-canvas transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift-blurple active:translate-x-0 active:translate-y-0"
                data-cursor="interactive"
              >
                Contact
              </Link>
            </div>
          </LayoutGroup>
        </div>

        {/* Mobile Nav */}
        <div className="flex h-14 items-center justify-between px-4 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-baseline gap-1.5 font-display text-lg font-bold text-ink transition-colors duration-300 hover:text-blurple"
            data-cursor="interactive"
          >
            Nisarg
            <Star4 className="h-2 w-2 shrink-0 self-center text-tangerine" />
          </Link>

          <div className="flex items-center gap-1">
            <button
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 flex h-12 w-12 flex-col items-center justify-center gap-1.5"
              data-cursor="interactive"
            >
              <span
                className={cn(
                  'block h-0.5 w-6 bg-ink transition-all duration-300 ease-in-out',
                  isOpen && 'translate-y-2 rotate-45'
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-6 bg-ink transition-all duration-200 ease-in-out',
                  isOpen && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-6 bg-ink transition-all duration-300 ease-in-out',
                  isOpen && '-translate-y-2 -rotate-45'
                )}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-canvas lg:hidden"
          >
            {/* Corner shapes */}
            <Bloom className="absolute -left-8 top-16 w-28 text-lilac" />
            <Star4 className="absolute right-8 top-24 w-8 text-tangerine" />
            <Star4 className="absolute bottom-24 left-10 w-5 text-grass" />

            <div className="flex flex-col items-center gap-7">
              {allNavLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  variants={linkVariants}
                  initial="closed"
                  animate="open"
                  custom={i}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'font-display text-3xl font-bold text-ink transition-colors duration-200 hover:text-blurple',
                      isActive(link.href) && 'text-blurple'
                    )}
                    data-cursor="interactive"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Social stickers */}
            <motion.div
              variants={linkVariants}
              initial="closed"
              animate="open"
              custom={allNavLinks.length}
              className="mt-12 flex items-center gap-4"
            >
              <SocialIcon platform="github" href={SOCIAL_LINKS.github} />
              <SocialIcon platform="linkedin" href={SOCIAL_LINKS.linkedin} />
              <SocialIcon platform="instagram" href={SOCIAL_LINKS.instagram} />
              <SocialIcon platform="email" href={SOCIAL_LINKS.email} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
