'use client'

export function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        })
      }
      className="meta group inline-flex items-center gap-2 text-text-tertiary transition-colors duration-200 hover:text-accent"
      data-cursor="interactive"
    >
      Back to top
      <span
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
        aria-hidden="true"
      >
        &#8593;
      </span>
    </button>
  )
}
