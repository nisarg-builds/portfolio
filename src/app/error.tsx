'use client'

import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <span className="text-5xl" aria-hidden="true">
        ⚡
      </span>

      <h1 className="mt-6 font-(family-name:--font-display) text-4xl font-bold text-accent">
        Something went wrong
      </h1>

      <p className="mt-2 text-lg text-text-secondary">
        An unexpected error occurred.
      </p>

      {error.digest && (
        <p className="mt-1 font-(family-name:--font-mono) text-sm text-text-tertiary">
          Error ID: {error.digest}
        </p>
      )}

      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-base font-medium text-bg transition-all duration-200 hover:bg-accent-hover hover:shadow-glow"
          data-cursor="interactive"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-base font-medium text-text-primary transition-all duration-200 hover:border-accent/40"
          data-cursor="interactive"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
