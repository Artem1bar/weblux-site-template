'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Counts a number up the first time it scrolls into view.
 *
 * The important part is what happens when this does *not* run. `value` is
 * rendered as the initial state, so the server sends the real, final number and
 * that is what sits in the HTML. No script, script error, reduced-motion
 * preference or missing IntersectionObserver can leave a reader looking at a
 * zero — the animation can only ever replace a correct number with the same
 * correct number.
 *
 * (And the number itself must be a client-published figure, never one this
 * site derives — rounding a firm's headline credential up on its own behalf
 * is not a decision a rebuild gets to make.)
 */
export function CountUp({
  value,
  suffix = '',
  duration = 1100,
}: {
  value: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let done = false

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done) return
        done = true
        io.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          // Same expo-out the CSS uses, so the numbers settle like everything else.
          const eased = 1 - Math.pow(1 - t, 4)
          setShown(Math.round(value * eased))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        // Only drop to zero once we know we are going to animate back up.
        setShown(0)
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, duration])

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  )
}
