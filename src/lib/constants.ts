export const SITE_CONFIG = {
  name: 'Nisarg Chaudhary',
  title: 'Nisarg Chaudhary — Software Engineer & Designer',
  description:
    'Nisarg Chaudhary builds AI automation and data infrastructure at Vendasta. CS Honours with a Studio Arts minor at the University of Saskatchewan.',
  url: 'https://nisargchaudhary.com',
} as const

export const GITHUB_HANDLE = 'nisarg-11-here'

export const SOCIAL_LINKS = {
  github: `https://github.com/${GITHUB_HANDLE}`,
  linkedin: 'https://www.linkedin.com/in/nisargchaudhary/',
  instagram: 'https://www.instagram.com/nisarg.11/',
  email: 'mailto:chaudharynisarg555@gmail.com',
} as const

/** Rendered in the monogram and footer. Kept static so prerendered
 * markup and client hydration can never disagree. */
export const SITE_YEAR = 2026

export const EMAIL_ADDRESS = 'chaudharynisarg555@gmail.com'
export const RESUME_URL = '/resume.pdf'

export type SocialPlatform = keyof typeof SOCIAL_LINKS

/**
 * Ordered list used everywhere social links appear, so the footer, the mobile
 * menu and the contact section can never drift apart.
 */
export const SOCIAL_PROFILES: {
  platform: SocialPlatform
  label: string
  handle: string
  href: string
}[] = [
  { platform: 'github', label: 'GitHub', handle: GITHUB_HANDLE, href: SOCIAL_LINKS.github },
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    handle: 'nisargchaudhary',
    href: SOCIAL_LINKS.linkedin,
  },
  { platform: 'instagram', label: 'Instagram', handle: 'nisarg.11', href: SOCIAL_LINKS.instagram },
  { platform: 'email', label: 'Email', handle: EMAIL_ADDRESS, href: SOCIAL_LINKS.email },
]

export const NAV_LINKS = [
  { label: 'Work', href: '/#projects' },
  { label: 'Experience', href: '/experience' },
  { label: 'Playground', href: '/playground' },
  { label: 'Blog', href: '/blog' },
] as const
