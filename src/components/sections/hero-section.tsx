import Link from 'next/link'
import { PROFILE } from '@/lib/site-data'
import { EMAIL_ADDRESS, RESUME_URL, SOCIAL_LINKS } from '@/lib/constants'
import { LocalTime } from '@/components/ui/local-time'

/** The four things he actually does, set as a colophon strip under the fold. */
const DISCIPLINES = ['Backend', 'Interface', 'Design', 'Drawing']

function StatusDot() {
  return (
    <span className="relative inline-flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
      <span
        className="absolute inset-0 rounded-full bg-accent"
        style={{ animation: 'blink 2.4s ease-in-out infinite' }}
      />
    </span>
  )
}

function ArrowDown() {
  return (
    <svg width="10" height="26" viewBox="0 0 10 26" fill="none" aria-hidden="true">
      <path
        d="M5 0v24m0 0L1 20m4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The masthead. The name is the graphic — everything else on this screen is
 * a caption to it. Rendered on the server; only the clock hydrates.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="gutter relative mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-[1440px] flex-col justify-center gap-8 pt-6 pb-10 sm:justify-between sm:gap-0 lg:min-h-[calc(100svh-4.5rem)] lg:pt-8 lg:pb-8"
    >
      {/* Meta row — where he is, what time it is there, what he studies. */}
      <div className="rule flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-3">
        <p className="meta flex items-center gap-2 text-text-secondary">
          <StatusDot />
          {PROFILE.location}
          <span className="text-text-tertiary opacity-50" aria-hidden="true">
            /
          </span>
          <LocalTime />
        </p>
        <p className="meta text-text-tertiary">{PROFILE.study}</p>
      </div>

      {/* Name */}
      <h1 className="masthead set-type sm:my-10 lg:my-0" aria-label={PROFILE.name}>
        {PROFILE.nameLines.map((line, i) => (
          <span
            key={line}
            style={{ animationDelay: `${0.1 + i * 0.12}s` }}
            aria-hidden="true"
          >
            {line}
          </span>
        ))}
      </h1>

      {/* Statement + actions, with the scroll affordance held to the right. */}
      <div className="rule grid gap-8 pt-6 lg:grid-cols-12 lg:gap-10">
        <div className="rise lg:col-span-7" style={{ animationDelay: '0.45s' }}>
          <p className="font-(family-name:--font-display) text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-text-primary">
            I build the systems, and{' '}
            <span className="emph">draw the rest by hand.</span>
          </p>
          <p className="mt-5 max-w-[52ch] text-base text-text-secondary">
            {PROFILE.lead}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="meta group inline-flex items-center gap-2 border border-(--color-line) px-4 py-2.5 text-text-primary transition-colors duration-200 hover:border-accent hover:text-accent"
              data-cursor="interactive"
            >
              Résumé
              <span
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                &#8599;
              </span>
            </a>
            <a
              href={SOCIAL_LINKS.email}
              className="meta link-underline text-text-secondary transition-colors duration-200 hover:text-accent"
              data-cursor="interactive"
            >
              {EMAIL_ADDRESS}
            </a>
          </div>
        </div>

        {/* Scroll affordance — a struck circle, the way a stamp sits on a page. */}
        <div className="rise hidden lg:col-span-5 lg:flex lg:items-end lg:justify-end" style={{ animationDelay: '0.6s' }}>
          <Link
            href="#projects"
            className="group flex h-[124px] w-[124px] flex-col items-center justify-center gap-2 rounded-full border border-(--color-line) text-text-tertiary transition-colors duration-300 hover:border-accent hover:text-accent"
            data-cursor="interactive"
          >
            <span className="meta text-center leading-relaxed">
              Selected
              <br />
              Work
            </span>
            <span className="transition-transform duration-500 group-hover:translate-y-1">
              <ArrowDown />
            </span>
          </Link>
        </div>
      </div>

      {/* Discipline strip — the site's own footer rule for this screen. */}
      <ul className="rule mt-8 hidden justify-between pt-3 sm:flex">
        {DISCIPLINES.map((discipline) => (
          <li key={discipline} className="meta text-text-tertiary">
            {discipline}
          </li>
        ))}
      </ul>
    </section>
  )
}
