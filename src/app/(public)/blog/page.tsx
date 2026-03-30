import type { Metadata } from 'next'
import { DynamicHeading } from '@/components/ui/dynamic-heading'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on software development, design, and creative coding.',
}

export default function BlogPage() {
  return (
    <main className="min-h-dvh px-5 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-[960px]">
        <DynamicHeading
          text="Blog"
          as="h1"
          className="font-(family-name:--font-display) text-3xl font-bold text-text-primary"
        />
        <svg
          width="100%"
          height="12"
          viewBox="0 0 287 15"
          fill="none"
          preserveAspectRatio="none"
          className="mt-2 max-w-[80px]"
        >
          <path
            d="M2 6.5C2 6.5 4.6 13 11.8 13C19 13 25.5 2 33.3 2C41 2 46.9 13 55.9 13C65 13 67.6 2 76.8 2C86 2 90.2 13 100.1 13C110 13 111.8 2 120.9 2C130 2 134.9 13 144.2 13C153.5 13 156.6 2 165.1 2C173.5 2 177.2 13 188.3 13C199.5 13 199.9 2 209.2 2C218.5 2 223 13 232.5 13C242 13 244 2 253.3 2C262.6 2 269 13 274.5 13C280 13 285 8.5 285 7.5"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        <div className="mt-16 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg text-text-secondary">Coming soon...</p>
          <p className="mt-2 text-sm text-text-tertiary">
            I&apos;m working on some posts about software development, design,
            and creative coding. Stay tuned!
          </p>
        </div>
      </div>
    </main>
  )
}
