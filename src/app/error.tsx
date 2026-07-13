'use client'

import Link from 'next/link'
import { ArrowBolt, Loops } from '@/components/shapes'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <Loops className="w-24 text-punch [--loops-inner:var(--color-tangerine)]" />

      <h1 className="mt-8 font-display text-4xl font-bold text-ink">
        Something went wrong
      </h1>

      <p className="mt-2 text-lg text-ink-soft">
        An unexpected error occurred.
      </p>

      {error.digest && (
        <p className="mt-3 inline-flex rounded-full border-[1.5px] border-ink bg-paper px-3 py-1 font-mono text-xs text-ink-soft">
          Error ID: {error.digest}
        </p>
      )}

      <div className="mt-9 flex flex-wrap justify-center gap-3.5">
        <button
          onClick={reset}
          className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full border-2 border-ink bg-ink px-7 py-3 font-display text-base font-bold text-canvas transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift-punch"
          data-cursor="interactive"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-ink px-7 py-3 font-display text-base font-bold text-ink transition-[transform,box-shadow,background-color] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime hover:shadow-lift"
          data-cursor="interactive"
        >
          Go Home
          <ArrowBolt className="h-4 w-4" />
        </Link>
      </div>
    </main>
  )
}
