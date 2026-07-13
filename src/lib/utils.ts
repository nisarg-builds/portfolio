import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/* Teach tailwind-merge the custom fluid font-size token so `text-display`
   is treated as a font-size, not a color (it would otherwise be dropped
   whenever a text-* color appears in the same cn() call). */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-display'],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
