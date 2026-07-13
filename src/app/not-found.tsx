import Link from 'next/link'
import { DynamicHeading } from '@/components/ui/dynamic-heading'
import { ArrowBolt, Pinwheel } from '@/components/shapes'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <Pinwheel spin className="w-24 text-grape sm:w-28" />

      <DynamicHeading
        text="404"
        as="h1"
        className="mt-8 justify-center font-display text-display font-bold text-ink"
      />

      <p className="mt-2 font-display text-xl font-bold text-ink">
        You&apos;ve wandered off the map.
      </p>

      <p className="mt-1 text-base text-ink-soft">
        This page doesn&apos;t exist — but the way home does.
      </p>

      <Link
        href="/"
        className="mt-9 inline-flex min-h-[48px] items-center gap-2 rounded-full border-2 border-ink bg-ink px-7 py-3 font-display text-base font-bold text-canvas transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-lift-blurple"
        data-cursor="interactive"
      >
        Go Home
        <ArrowBolt className="h-4 w-4" />
      </Link>
    </main>
  )
}
