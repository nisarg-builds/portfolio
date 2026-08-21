import Image from 'next/image'
import { PROFILE, SKILL_GROUPS } from '@/lib/site-data'
import { SectionMarker } from '@/components/ui/section-marker'
import { Reveal } from '@/components/ui/reveal'

interface AboutSectionProps {
  portraitUrl: string
  portraitCrop?: { x: number; y: number; width: number; height: number } | null
}

export function AboutSection({ portraitUrl, portraitCrop }: AboutSectionProps) {
  // The admin panel stores a percentage crop; translate it into an
  // object-position plus scale so the same source image can be reframed
  // without re-uploading.
  const cropStyle = portraitCrop
    ? {
        objectPosition: `${portraitCrop.x}% ${portraitCrop.y}%`,
        transform: `scale(${100 / Math.min(portraitCrop.width, portraitCrop.height)})`,
        transformOrigin: `${portraitCrop.x}% ${portraitCrop.y}%`,
      }
    : undefined

  return (
    <section id="about" className="gutter mx-auto max-w-[1440px] py-20 lg:py-28">
      <SectionMarker as="h2" number="01" label="About" annotation="India → Canada" />

      <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
        {/* Portrait, presented as a plate: hairline frame, caption beneath. */}
        <Reveal className="lg:col-span-4">
          <figure className="max-w-[380px] lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden border border-(--color-line) bg-bg-surface">
              <Image
                src={portraitUrl}
                alt={`${PROFILE.name}, photographed in ${PROFILE.location}`}
                fill
                className="object-cover"
                style={cropStyle}
                sizes="(max-width: 1024px) 380px, 30vw"
              />
            </div>
            <figcaption className="meta rule mt-3 flex items-center justify-between pt-2.5 text-text-tertiary">
              <span>
                <span className="numeral text-accent">Fig. 01</span>
                <span className="px-2 opacity-40" aria-hidden="true">
                  /
                </span>
                {PROFILE.location}
              </span>
              <span aria-hidden="true">52.13&deg;N</span>
            </figcaption>
          </figure>
        </Reveal>

        {/* Bio. The first paragraph runs larger — a printed lead-in. */}
        <div className="lg:col-span-8 lg:pt-1">
          <div className="max-w-[64ch] space-y-6" data-cursor="text">
            {PROFILE.bio.map((paragraph, i) => (
              <Reveal
                key={i}
                index={i}
                as="p"
                className={
                  i === 0
                    ? 'text-lg leading-[1.6] text-text-primary'
                    : 'text-base text-text-secondary'
                }
              >
                {paragraph}
              </Reveal>
            ))}
          </div>

          {/* Skills as a set index, grouped and scannable. */}
          <Reveal delay={0.1} className="mt-14">
            <p className="meta rule pt-2.5 text-text-tertiary">Toolkit</p>
            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4">
              {SKILL_GROUPS.map((group, i) => (
                <Reveal key={group.label} index={i} distance={12}>
                  <h3 className="meta text-accent">{group.label}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="text-sm text-text-secondary">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
