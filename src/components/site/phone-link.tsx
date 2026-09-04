'use client'

import type { ComponentProps } from 'react'

import { isKnown } from '@/content/maybe'
import { site } from '@/content/site'
import { CONVERSIONS, track } from '@/lib/analytics'

/**
 * A tel: link that reports the click.
 *
 * For a local-service business the phone call is usually the conversion. If
 * calls are not measured, the site's actual performance is invisible. The href
 * is always correct whether or not analytics loads; tracking is a side effect
 * of the click, never a precondition for it.
 *
 * Renders nothing while the phone number is pending (Q3): a call button that
 * dials a placeholder is worse than no button, and the layouts that host this
 * component are built to close up gracefully around its absence. The E.164
 * `raw` form goes in the href — some dialers reject formatted strings with
 * spaces and parentheses.
 */
export function PhoneLink({
  location,
  children,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & { location: string }) {
  if (!isKnown(site.phone)) return null
  const phone = site.phone.value

  return (
    <a
      href={`tel:${phone.raw}`}
      onClick={() => track(CONVERSIONS.phoneClick, { location })}
      {...props}
    >
      {children ?? `Call ${phone.display}`}
    </a>
  )
}
