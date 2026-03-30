import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <span className="text-5xl" aria-hidden="true">
        🌵
      </span>

      <h1 className="mt-6 font-(family-name:--font-display) text-display font-bold text-accent">
        404
      </h1>

      <p className="mt-2 text-xl text-text-secondary">Page not found.</p>

      <p className="mt-1 text-base text-text-tertiary">
        Looks like you wandered off the path.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-base font-medium text-bg transition-all duration-200 hover:bg-accent-hover hover:shadow-glow"
        data-cursor="interactive"
      >
        Go Home
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <span className="mt-12 text-3xl opacity-50" aria-hidden="true">
        🌿
      </span>
    </main>
  )
}
