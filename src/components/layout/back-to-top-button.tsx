'use client'

export function BackToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="glass flex h-10 w-10 items-center justify-center rounded-full text-text-tertiary transition-all duration-200 hover:text-accent hover:border-accent/30"
      data-cursor="interactive"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
