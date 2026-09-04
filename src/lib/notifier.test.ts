import { describe, expect, it } from 'vitest'

import type { Lead } from './lead'
import {
  consoleNotifier,
  escapeHtml,
  getNotifier,
  isDeliveryConfigured,
  leadEmailBodies,
  leadSubject,
  resendNotifier,
} from './notifier'

const lead: Lead = {
  name: 'Marie Boudreaux',
  phone: '(555) 555-0142',
  phoneE164: '+15555550142',
  email: 'marie@example.com',
  address: '',
  inquiryType: 'quote',
  message: 'The kitchen unit stopped working on Friday and the vendor quote seems far too high.',
  website: '',
}

/** Next's ProcessEnv augmentation makes NODE_ENV required; tests build partial envs. */
const env = (vars: Record<string, string> = {}): NodeJS.ProcessEnv =>
  vars as unknown as NodeJS.ProcessEnv

describe('delivery selection', () => {
  it('is unconfigured until BOTH the key and the destination exist', () => {
    expect(isDeliveryConfigured(env())).toBe(false)
    expect(isDeliveryConfigured(env({ RESEND_API_KEY: 're_x' }))).toBe(false)
    expect(isDeliveryConfigured(env({ LEAD_NOTIFY_TO: 'a@b.co' }))).toBe(false)
    expect(isDeliveryConfigured(env({ RESEND_API_KEY: 're_x', LEAD_NOTIFY_TO: 'a@b.co' }))).toBe(
      true,
    )
  })

  it('treats empty strings as unset', () => {
    expect(isDeliveryConfigured(env({ RESEND_API_KEY: '', LEAD_NOTIFY_TO: 'a@b.co' }))).toBe(false)
  })

  it('falls back to the console notifier while unconfigured', () => {
    // The keyless path must keep working — preview deploys run with no env at
    // all, and a lead must be logged rather than silently dropped.
    expect(getNotifier(env()).channel).toBe('console')
    expect(getNotifier(env({ RESEND_API_KEY: 're_x' })).channel).toBe('console')
  })

  it('selects Resend once fully configured', () => {
    const n = getNotifier(env({ RESEND_API_KEY: 're_x', LEAD_NOTIFY_TO: 'owner@example.com' }))
    expect(n.channel).toBe('resend')
    expect(n).toBe(resendNotifier)
  })

  it('exposes the channel on both notifiers, so selection is observable', () => {
    expect(consoleNotifier.channel).toBe('console')
    expect(resendNotifier.channel).toBe('resend')
  })
})

describe('console notifier', () => {
  it('logs without throwing — the fallback path must never lose a lead to an exception', async () => {
    await expect(consoleNotifier.send(lead)).resolves.toBeUndefined()
  })
})

describe('escapeHtml', () => {
  it('neutralises the five HTML-significant characters', () => {
    expect(escapeHtml(`<img src=x onerror="alert('1')" & more>`)).toBe(
      '&lt;img src=x onerror=&quot;alert(&#39;1&#39;)&quot; &amp; more&gt;',
    )
  })

  it('leaves ordinary text alone', () => {
    expect(escapeHtml('Marie Boudreaux, apt. 4')).toBe('Marie Boudreaux, apt. 4')
  })
})

describe('lead email', () => {
  it('carries name and phone in the subject, so the inbox list is actionable', () => {
    const subject = leadSubject(lead)
    expect(subject).toContain('Marie Boudreaux')
    expect(subject).toContain('+15555550142')
  })

  it('escapes visitor-typed values in the HTML body', () => {
    const hostile = { ...lead, name: `<script>alert('x')</script>` }
    const { html } = leadEmailBodies(hostile)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('includes every field a human needs in both bodies', () => {
    const { html, text } = leadEmailBodies(lead)
    for (const body of [html, text]) {
      expect(body).toContain('Marie Boudreaux')
      expect(body).toContain('+15555550142')
      expect(body).toContain('marie@example.com')
      expect(body).toContain(lead.message)
    }
  })
})
