'use client'

import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

const ORDER = ['light', 'dark', 'system'] as const

const LABEL = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
} as const

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[next]}.`}
      title={`Theme: ${LABEL[theme]}`}
      className={cn(
        'flex h-9 w-9 items-center justify-center text-text-tertiary transition-colors duration-200 hover:text-accent',
        className,
      )}
      data-cursor="interactive"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {theme === 'light' && (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 1.8v2.4M12 19.8v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M1.8 12h2.4M19.8 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
          </>
        )}
        {theme === 'dark' && <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />}
        {theme === 'system' && (
          <>
            <rect x="2.5" y="3.5" width="19" height="13" rx="1.5" />
            <path d="M8.5 20.5h7M12 16.5v4" />
          </>
        )}
      </svg>
    </button>
  )
}
