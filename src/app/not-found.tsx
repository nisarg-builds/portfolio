import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="gutter mx-auto flex min-h-svh max-w-[1440px] flex-col justify-center py-20">
      <div className="rule pt-3">
        <p className="meta text-text-tertiary">Error</p>
      </div>

      <p
        className="masthead mt-10 select-none text-accent"
        aria-hidden="true"
        style={{ fontSize: 'clamp(4rem, 22vw, 14rem)' }}
      >
        404
      </p>

      <h1 className="mt-6 max-w-[20ch] font-(family-name:--font-display) text-2xl font-bold leading-[1.05] tracking-[-0.035em]">
        This page isn&rsquo;t in the <span className="emph">index.</span>
      </h1>

      <p className="mt-4 max-w-[46ch] text-base text-text-secondary">
        The link may be old, or the page may have been renamed. Everything that
        does exist is one click away.
      </p>

      <div className="rule mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 pt-6">
        <Link
          href="/"
          className="meta group inline-flex items-center gap-2 border border-(--color-line) px-4 py-2.5 text-text-primary transition-colors duration-200 hover:border-accent hover:text-accent"
          data-cursor="interactive"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true">
            &#8592;
          </span>
          Home
        </Link>
        <Link
          href="/#projects"
          className="meta link-underline text-text-secondary transition-colors duration-200 hover:text-accent"
          data-cursor="interactive"
        >
          Selected work
        </Link>
        <Link
          href="/experience"
          className="meta link-underline text-text-secondary transition-colors duration-200 hover:text-accent"
          data-cursor="interactive"
        >
          Experience
        </Link>
      </div>
    </main>
  )
}
