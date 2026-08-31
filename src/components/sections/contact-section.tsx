import { PROFILE } from "@/lib/site-data";
import { RESUME_URL, SOCIAL_PROFILES } from "@/lib/constants";
import { SectionMarker } from "@/components/ui/section-marker";
import { Reveal } from "@/components/ui/reveal";
import { EmailLink } from "@/components/ui/email-link";
import { SignatureMark } from "@/components/ui/signature-mark";
import { LocalTime } from "@/components/ui/local-time";

/** Socials listed the way a masthead lists contributors: label, handle, link. */
const DIRECTORY = [
  ...SOCIAL_PROFILES.filter((profile) => profile.platform !== "email"),
  {
    platform: "resume" as const,
    label: "Résumé",
    handle: "PDF",
    href: RESUME_URL,
  },
];

/**
 * The page ends on the signal ground: the accent stops being a highlight and
 * becomes the whole field. It is the last thing a visitor sees and the only
 * thing on the site asking them to act, so it is the one section that gets to
 * shout. Identical in both themes.
 */
export function ContactSection() {
  return (
    <section id="contact" className="ground-signal py-20 lg:py-28">
      <div className="gutter mx-auto max-w-[1440px]">
        <SectionMarker
          number="03"
          label="Contact"
          annotation="Usually replies within a day"
        />

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <h2 className="font-(family-name:--font-display) text-3xl font-bold leading-[0.98] tracking-[-0.04em]">
              Say <span className="emph">hello.</span>
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg text-text-secondary">
              {PROFILE.availability} If you are building something at the seam
              between the two, I would like to hear about it.
            </p>

            <div className="mt-10">
              <p className="meta mb-4 text-text-tertiary">Write to me</p>
              <EmailLink />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="meta rule pt-2.5 text-text-tertiary">Elsewhere</p>
            <ul className="mt-1">
              {DIRECTORY.map((entry) => (
                <li key={entry.platform} className="rule">
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-4 transition-colors duration-200"
                    data-cursor="interactive"
                  >
                    <span className="meta text-text-primary transition-colors duration-200 group-hover:text-accent">
                      {entry.label}
                    </span>
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="truncate text-sm text-text-tertiary">
                        {entry.handle}
                      </span>
                      <span
                        className="shrink-0 text-text-tertiary transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      >
                        &#8599;
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Sign-off. The mark draws itself once, and the page stops. */}
        <Reveal
          delay={0.15}
          className="rule mt-14 flex items-end justify-between gap-6 pt-6 lg:mt-20"
        >
          <p className="max-w-[24ch] font-(family-name:--font-display) text-xl font-medium tracking-[-0.025em] text-text-primary">
            Thanks for scrolling <span className="emph">this far.</span>
          </p>
          <div className="flex items-end gap-6">
            <p className="meta hidden text-text-tertiary sm:block">
              {PROFILE.location}
              <span className="px-2 opacity-40" aria-hidden="true">
                /
              </span>
              <LocalTime />
            </p>
            <SignatureMark className="h-16 w-auto shrink-0 text-accent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
