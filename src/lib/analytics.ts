/**
 * Two providers, both optional. Vercel Analytics needs no configuration and no
 * cookie banner. GA4 turns on only when NEXT_PUBLIC_GA_ID holds a well-formed
 * measurement id, so nothing is created on anyone's behalf and a missing id is
 * simply off rather than broken. Which analytics survive to launch is the
 * client's call — docs/CLIENT-QUESTIONS.md Q11.
 */

export const CONVERSIONS = {
  /** The primary conversion for most local-service clients: people call. */
  phoneClick: 'phone_click',
  emailClick: 'email_click',
  leadSubmit: 'lead_submit',
  leadError: 'lead_error',
  /**
   * A click out to a client-controlled external system — booking portal,
   * property search, patient portal. Everything after that click happens on
   * someone else's analytics, so this event is the only way the brochure site
   * can show it did its job. Fired by OutboundLink.
   */
  outboundClick: 'outbound_click',
} as const

export type ConversionEvent = (typeof CONVERSIONS)[keyof typeof CONVERSIONS]

/** GA4 measurement ids look like G-XXXXXXXXXX. A UA- id is not valid here. */
const GA_ID_PATTERN = /^G-[A-Z0-9]{6,}$/

export function gaEnabled(id: string | undefined): boolean {
  return typeof id === 'string' && GA_ID_PATTERN.test(id)
}

type GtagWindow = Window & {
  gtag?: (command: 'event', name: string, params: Record<string, unknown>) => void
}

/**
 * Fire and forget. Never throws: a missing or blocked analytics tag is not
 * something a visitor should ever notice.
 */
export function track(event: ConversionEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return

  try {
    ;(window as GtagWindow).gtag?.('event', event, params)
  } catch {
    // Deliberately silent.
  }
}
