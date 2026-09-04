import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CONVERSIONS, gaEnabled, track } from './analytics'

describe('conversion catalogue', () => {
  it('names the events that matter for a local-service client', () => {
    // Phone calls are usually the primary conversion, so they have to be
    // measurable, not just clickable.
    expect(CONVERSIONS.phoneClick).toBe('phone_click')
    expect(CONVERSIONS.leadSubmit).toBe('lead_submit')
    expect(CONVERSIONS.leadError).toBe('lead_error')
    expect(CONVERSIONS.emailClick).toBe('email_click')
    // The handoff to a client-controlled external system (OutboundLink).
    expect(CONVERSIONS.outboundClick).toBe('outbound_click')
  })

  it('uses snake_case, which is what GA4 expects', () => {
    for (const name of Object.values(CONVERSIONS)) {
      expect(name).toMatch(/^[a-z][a-z0-9_]*$/)
    }
  })

  it('has no duplicate event names', () => {
    const values = Object.values(CONVERSIONS)
    expect(new Set(values).size).toBe(values.length)
  })
})

describe('gaEnabled', () => {
  it('is off when no measurement id is configured', () => {
    expect(gaEnabled(undefined)).toBe(false)
    expect(gaEnabled('')).toBe(false)
  })

  it('is on for a well-formed GA4 measurement id', () => {
    expect(gaEnabled('G-ABC1234567')).toBe(true)
  })

  it('rejects a malformed id rather than injecting a broken tag', () => {
    expect(gaEnabled('UA-12345-1')).toBe(false)
    expect(gaEnabled('not-an-id')).toBe(false)
  })
})

describe('track', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {} as Window & typeof globalThis)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does nothing when no analytics provider is present', () => {
    // Must never throw. A missing tag is not an error the visitor should see.
    expect(() => track(CONVERSIONS.phoneClick)).not.toThrow()
  })

  it('forwards the event and its params to gtag when present', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag } as unknown as Window & typeof globalThis)

    track(CONVERSIONS.leadSubmit, { inquiry_type: 'quote' })

    expect(gtag).toHaveBeenCalledWith('event', 'lead_submit', { inquiry_type: 'quote' })
  })

  it('sends an empty params object rather than undefined', () => {
    const gtag = vi.fn()
    vi.stubGlobal('window', { gtag } as unknown as Window & typeof globalThis)

    track(CONVERSIONS.phoneClick)

    expect(gtag).toHaveBeenCalledWith('event', 'phone_click', {})
  })
})
