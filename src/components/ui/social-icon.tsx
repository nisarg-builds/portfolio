import { cn } from '@/lib/utils'
import type { SocialPlatform } from '@/lib/constants'

/**
 * One definition of each mark, used by the footer, the mobile menu and the
 * contact section. Drawn on a 24px grid with a consistent 1.6 stroke so the
 * set reads as one family rather than four borrowed logos.
 */
const PATHS: Record<SocialPlatform, React.ReactNode> = {
  github: (
    <path d="M9 19c-4.7 1.4-4.7-2.4-6.6-2.9m13.2 5.7v-3.6a3.2 3.2 0 0 0-.9-2.5c3-.3 6.1-1.5 6.1-6.6a5.1 5.1 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.6 12.6 0 0 0-6.6 0C6.4 1.6 5.3 1.9 5.3 1.9a4.8 4.8 0 0 0-.1 3.6 5.1 5.1 0 0 0-1.4 3.6c0 5.1 3.1 6.3 6.1 6.6a3.2 3.2 0 0 0-.9 2.5v3.6" />
  ),
  linkedin: (
    <>
      <path d="M16 8.5a5.5 5.5 0 0 1 5.5 5.5v6.5h-3.7V14a1.8 1.8 0 0 0-3.6 0v6.5h-3.7V8.9h3.7v1.4A4.4 4.4 0 0 1 16 8.5Z" />
      <path d="M3 8.9h3.7v11.6H3z" />
      <circle cx="4.85" cy="4.4" r="1.9" />
    </>
  ),
  instagram: (
    <>
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  email: (
    <>
      <rect x="2.6" y="4.6" width="18.8" height="14.8" rx="2" />
      <path d="m3.4 6.4 7.6 5.6a1.7 1.7 0 0 0 2 0l7.6-5.6" />
    </>
  ),
}

interface SocialIconProps {
  platform: SocialPlatform
  size?: number
  className?: string
}

export function SocialIcon({ platform, size = 20, className }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn('shrink-0', className)}
    >
      {PATHS[platform]}
    </svg>
  )
}

interface SocialLinkProps {
  platform: SocialPlatform
  href: string
  label: string
  size?: number
  className?: string
}

/** An icon wrapped in a correctly-labelled, correctly-targeted anchor. */
export function SocialIconLink({
  platform,
  href,
  label,
  size = 20,
  className,
}: SocialLinkProps) {
  const isEmail = platform === 'email'

  return (
    <a
      href={href}
      target={isEmail ? undefined : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
      aria-label={isEmail ? `Email ${label}` : `${label} (opens in a new tab)`}
      data-cursor="interactive"
      className={cn(
        'inline-flex items-center justify-center text-text-tertiary transition-colors duration-200 hover:text-accent',
        className,
      )}
    >
      <SocialIcon platform={platform} size={size} />
    </a>
  )
}
