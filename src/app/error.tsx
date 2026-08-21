'use client'

import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <main className="gutter mx-auto flex min-h-svh max-w-[1440px] flex-col justify-center py-20">
      <div className="rule pt-3">
        <p className="meta text-text-tertiary">Error</p>
      </div>

      <h1 className="mt-10 max-w-[20ch] font-(family-name:--font-display) text-3xl font-bold leading-[0.98] tracking-[-0.04em]">
        Something broke on <span className="emph">this end.</span>
      </h1>

      <p className="mt-5 max-w-[46ch] text-lg text-text-secondary">
        Not your fault. Try again — and if it keeps happening, the fastest way to
        get it fixed is to tell me.
      </p>

      {error.digest && (
        <p className="meta numeral mt-4 text-text-tertiary">
          Reference {error.digest}
        </p>
      )}

      <div className="rule mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 pt-6">
        <button
          type="button"
          onClick={reset}
          className="meta border border-(--color-line) px-4 py-2.5 text-text-primary transition-colors duration-200 hover:border-accent hover:text-accent"
          data-cursor="interactive"
        >
          Try again
        </button>
        <Link
          href="/"
          className="meta link-underline text-text-secondary transition-colors duration-200 hover:text-accent"
          data-cursor="interactive"
        >
          Home
        </Link>
      </div>
    </main>
  )
}
