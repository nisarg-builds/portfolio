import Link from 'next/link'
import { COLOPHON, PROFILE } from '@/lib/site-data'
import { NAV_LINKS, SITE_YEAR, SOCIAL_PROFILES } from '@/lib/constants'
import { SocialIconLink } from '@/components/ui/social-icon'
import { BackToTopButton } from '@/components/layout/back-to-top-button'

/**
 * A colophon, not a sitemap dump. A designed page should be willing to say
 * what it was made with and what it was set in.
 */
export function Footer() {
  return (
    <footer className="gutter mx-auto max-w-[1440px] pb-10 pt-14 lg:pb-12 lg:pt-20">
      <div className="rule grid gap-10 pt-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="font-(family-name:--font-display) text-lg font-medium tracking-tight text-text-primary">
            {PROFILE.name}
          </p>
          <p className="meta mt-2 text-text-tertiary">
            {PROFILE.location} &nbsp;/&nbsp; {PROFILE.role}, {PROFILE.company}
          </p>
          <div className="mt-6 flex items-center gap-5">
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
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <p className="meta text-text-tertiary">Index</p>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="link-underline text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
                  data-cursor="interactive"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/#contact"
                className="link-underline text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
                data-cursor="interactive"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <p className="meta text-text-tertiary">Colophon</p>
          <p className="mt-3 max-w-[38ch] text-sm text-text-secondary">
            Built with {COLOPHON.built.join(', ')}. Set in{' '}
            {COLOPHON.setIn.slice(0, -1).join(', ')} and{' '}
            {COLOPHON.setIn.at(-1)}.
          </p>
        </div>
      </div>

      <div className="rule mt-10 flex items-center justify-between gap-4 pt-5">
        <p className="meta text-text-tertiary">
          &copy; {SITE_YEAR} {PROFILE.name}
        </p>
        <BackToTopButton />
      </div>
    </footer>
  )
}
