'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

type Connection = { saveData?: boolean; effectiveType?: string }

const STILLNESS = '(prefers-reduced-motion: reduce)'

/**
 * Below this width the video is never requested. It is decoration sitting under
 * a heavy scrim at partial opacity, and on a phone it is a megabyte spent on
 * something almost nobody will consciously notice. The still photograph is the
 * hero on small screens, and it is enough.
 */
const WIDE = '(min-width: 1024px)'

function subscribe(onChange: () => void) {
  const stillness = window.matchMedia(STILLNESS)
  const wide = window.matchMedia(WIDE)
  stillness.addEventListener('change', onChange)
  wide.addEventListener('change', onChange)
  return () => {
    stillness.removeEventListener('change', onChange)
    wide.removeEventListener('change', onChange)
  }
}

/**
 * Should this visitor be sent a decorative video at all?
 *
 * Read through useSyncExternalStore rather than an effect, for two reasons: the
 * server has no opinion (it always answers "no", so the markup it sends never
 * contains a video and there is nothing to mismatch on hydration), and a reader
 * who turns reduced-motion *on* mid-visit gets the video removed rather than
 * having to reload.
 */
function wantsVideo(): boolean {
  if (window.matchMedia(STILLNESS).matches) return false
  if (!window.matchMedia(WIDE).matches) return false

  // Network Information API is Chromium-only and still optional, so it is read
  // defensively rather than typed into existence.
  const conn = (navigator as Navigator & { connection?: Connection }).connection
  if (conn?.saveData) return false
  if (conn?.effectiveType && /(^|-)2g$|^3g$/.test(conn.effectiveType)) return false

  return true
}

const noVideoOnServer = () => false

/**
 * An ambient background video that layers *over* an already-painted poster.
 * (No video asset ships with the template; the component waits for one — Q6.)
 *
 * The rules it follows, in the order they matter:
 *
 * 1. The poster is a real `next/image` rendered by the parent, and it is what
 *    the browser paints for LCP. This component never delays that — it renders
 *    nothing until the file can actually play, then fades in. If the video
 *    404s, stalls, or the tab is on a slow link, the page is still a finished
 *    hero with a photograph in it.
 * 2. `prefers-reduced-motion` means no video at all. Not paused — never
 *    requested, so a reader who asked for stillness does not pay for the bytes.
 * 3. Same for Save-Data and 2g/3g connections.
 * 4. It pauses when scrolled out of view, so it is not decoding frames nobody
 *    is looking at.
 */
export function AmbientVideo({
  src,
  className,
  /**
     Opacity once playing. Below 1 the video blends into the still poster
     underneath it rather than replacing it, which does two useful things: the
     motion reads as a drift in the photograph instead of a video starting, and
     the loop's turnaround stops being a visible event.
   */
  maxOpacity = 0.7,
}: {
  src: string
  className?: string
  maxOpacity?: number
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const allowed = useSyncExternalStore(subscribe, wantsVideo, noVideoOnServer)
  const [idle, setIdle] = useState(false)
  const [ready, setReady] = useState(false)
  const wanted = allowed && idle

  // Wait for the browser to go quiet before asking for a megabyte of
  // decoration. The hero photograph is the LCP element and it must not queue
  // behind this; requestIdleCallback puts the video after everything the page
  // actually needs, and the timeout stops it waiting forever on a busy tab.
  useEffect(() => {
    if (!allowed) return

    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (handle: number) => void
    }
    const w = window as IdleWindow

    if (typeof w.requestIdleCallback === 'function') {
      const handle = w.requestIdleCallback(() => setIdle(true), { timeout: 3000 })
      return () => w.cancelIdleCallback?.(handle)
    }

    // Safari has no requestIdleCallback; a timer after load is close enough.
    const timer = setTimeout(() => setIdle(true), 1200)
    return () => clearTimeout(timer)
  }, [allowed])

  useEffect(() => {
    const el = ref.current
    if (!el || !wanted) return

    // Decode only while it is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [wanted])

  if (!wanted) return null

  return (
    <video
      ref={ref}
      // The poster underneath is the accessible content; this is decoration.
      aria-hidden="true"
      muted
      loop
      playsInline
      preload="none"
      onCanPlay={() => setReady(true)}
      className={className}
      style={{
        opacity: ready ? maxOpacity : 0,
        transition: 'opacity 1200ms var(--ease)',
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
