import Image from 'next/image'

/**
 * A project's logo, set inline before its title and sized in em, so it scales
 * with the title and the line keeps the title's baseline. App icons ship
 * square and the platform rounds them; the 22% radius does the same.
 */
export function ProjectLogo({ src }: { src: string }) {
  return (
    <span
      className="relative mr-[0.4em] inline-block size-[1.2em] overflow-hidden rounded-[22%] align-[-0.25em]"
      aria-hidden="true"
    >
      <Image src={src} alt="" fill className="object-contain" sizes="96px" />
    </span>
  )
}
