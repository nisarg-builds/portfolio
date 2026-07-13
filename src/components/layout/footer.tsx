import { SOCIAL_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { BackToTopButton } from '@/components/layout/back-to-top-button'
import { SocialIcon } from '@/components/ui/social-icon'

interface FooterProps {
  className?: string
}

/* Slim ink strip. Square-topped so it fuses with the Contact ink band on
   the home page; stands alone as a baseboard on sub-pages. */
export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('on-ink bg-ink', className)}>
      <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-6 px-6 py-10 lg:flex-row lg:justify-between lg:py-8">
        <p className="font-mono text-xs text-canvas/60">
          &copy; 2026 &middot; Designed &amp; built by{' '}
          <span className="text-lime">Nisarg Chaudhary</span>
        </p>

        <div className="flex items-center gap-3">
          <SocialIcon platform="github" href={SOCIAL_LINKS.github} />
          <SocialIcon platform="linkedin" href={SOCIAL_LINKS.linkedin} />
          <SocialIcon platform="instagram" href={SOCIAL_LINKS.instagram} />
          <SocialIcon platform="email" href={SOCIAL_LINKS.email} />
          <span className="mx-1 h-6 w-px bg-canvas/20" aria-hidden="true" />
          <BackToTopButton />
        </div>
      </div>
    </footer>
  )
}
