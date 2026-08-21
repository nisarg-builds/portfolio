'use client'

import { useEffect, useState } from 'react'
import { PROFILE } from '@/lib/site-data'

/**
 * Nisarg's local time, ticking.
 *
 * Rendered empty on the server and filled after mount: the value is
 * time-dependent by definition, so there is no correct markup to prerender.
 * Reserving the width keeps the meta row from reflowing when it arrives.
 */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: PROFILE.timeZone,
    })

    function tick() {
      setTime(formatter.format(new Date()))
    }

    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="numeral inline-block min-w-[3.2em] tabular-nums">
      {time ?? ' '}
    </span>
  )
}
