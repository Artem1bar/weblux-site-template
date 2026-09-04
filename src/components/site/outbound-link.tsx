'use client'

import type { ComponentProps } from 'react'

import { CONVERSIONS, track } from '@/lib/analytics'

/**
 * A link out to a client-controlled external system — a booking portal, a
 * property-search subdomain, an ordering platform. The kind of destination
 * where the visitor finishes the job the site exists to start.
 *
 * Three things this deliberately does, all fixes for defects that keep
 * recurring on the sites this template replaces:
 *
 * 1. It is a real `<a href>`, not a JavaScript handler. A JS-bound call to
 *    action is invisible to crawlers and to anyone whose script fails.
 * 2. It stays in the same tab. The external system is not an aside — it is
 *    usually the thing the visitor came to do — and forcing a new window takes
 *    the back button away from them.
 * 3. It says out loud that it leaves the site. The destination looks visibly
 *    different, and a visitor who is told that first is not surprised by it.
 *    Sighted users can be given an arrow by the caller; the sr-only text
 *    carries the same information into the accessible name.
 *
 * Firing `outbound_click` here is the only way the brochure site can show it
 * did its job, since everything after this click happens on someone else's
 * analytics.
 */
export function OutboundLink({
  href,
  location,
  children,
  ...props
}: ComponentProps<'a'> & { href: string; location: string }) {
  return (
    <a
      href={href}
      data-external="outbound"
      onClick={() => track(CONVERSIONS.outboundClick, { location, href })}
      {...props}
    >
      {children}
      <span className="sr-only"> (opens an external site)</span>
    </a>
  )
}
