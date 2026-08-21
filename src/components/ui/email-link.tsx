'use client'

import { useEffect, useRef, useState } from 'react'
import { EMAIL_ADDRESS, SOCIAL_LINKS } from '@/lib/constants'

/**
 * The address, set large enough to be the point of the section, with a copy
 * control beside it — because most people want the string, not a mail client.
 */
export function EmailLink() {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDRESS)
      setCopied(true)
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (insecure context, denied permission). The address
      // is right there as a selectable link, so there is nothing to recover.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        href={SOCIAL_LINKS.email}
        className="link-underline font-(family-name:--font-display) text-[clamp(1.15rem,5vw,2.5rem)] font-medium tracking-[-0.035em] text-text-primary transition-colors duration-200 hover:text-accent"
        data-cursor="interactive"
      >
        {EMAIL_ADDRESS}
      </a>
      <button
        type="button"
        onClick={copy}
        className="meta shrink-0 border border-(--color-line) px-3 py-1.5 text-text-tertiary transition-colors duration-200 hover:border-accent hover:text-accent"
        data-cursor="interactive"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
    </div>
  )
}
