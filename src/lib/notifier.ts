import 'server-only'

import type { Lead } from './lead'

/**
 * Where a lead goes once it validates.
 *
 * The failure mode this module exists to prevent is the classic small-site PHP
 * mailer that fails silently — a form that says "thanks" while the message goes
 * nowhere. So the contract is that a notifier either succeeds or throws, and
 * the caller tells the visitor the truth either way.
 *
 * Two notifiers ship. `resendNotifier` delivers by email through Resend and is
 * selected automatically once RESEND_API_KEY and LEAD_NOTIFY_TO are both set
 * (docs/CLIENT-QUESTIONS.md Q2 resolves where leads go). Until then
 * `consoleNotifier` logs the lead on the server, loudly, so nothing is dropped
 * on a keyless preview deploy. `npm run check:launch` blocks a launch while
 * delivery is unconfigured.
 */
export type Notifier = {
  /** Which transport this is. Lets selection be asserted without sending anything. */
  channel: 'console' | 'resend'
  send(lead: Lead): Promise<void>
}

/** Whether leads currently reach a human. Read by check:launch and tests. */
export function isDeliveryConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(env.RESEND_API_KEY) && Boolean(env.LEAD_NOTIFY_TO)
}

export const consoleNotifier: Notifier = {
  channel: 'console',
  async send(lead) {
    const record = JSON.stringify({
      name: lead.name,
      phone: lead.phoneE164,
      email: lead.email || null,
      inquiryType: lead.inquiryType,
      messageLength: lead.message.length,
    })

    if (process.env.NODE_ENV === 'production') {
      /*
        console.error, not console.info, and deliberately so.

        In production an unconfigured notifier means a real person has just
        asked for help and the only copy of that is this line. Hosting
        dashboards surface and retain errors far more aggressively than info
        logs, and error-level output is what alerting actually watches. A lead
        sitting unread in an info log is the silent-drop failure this whole
        module exists to prevent, just relocated.
      */
      console.error(
        '[lead] DELIVERY NOT CONFIGURED — set RESEND_API_KEY and LEAD_NOTIFY_TO. Lead:',
        record,
      )
      return
    }

    console.info('[lead]', record)
  },
}

/** Escapes anything a visitor typed before it goes into an HTML email. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * The subject line carries who and how to reach them, so a lead is actionable
 * from the inbox list without opening the message.
 */
export function leadSubject(lead: Pick<Lead, 'name' | 'phoneE164'>): string {
  return `Website lead — ${lead.name} — ${lead.phoneE164}`
}

export function leadEmailBodies(lead: Lead): { html: string; text: string } {
  const rows: [string, string][] = [
    ['Name', lead.name],
    ['Phone', lead.phoneE164],
    ['Email', lead.email || 'Not given'],
    ['Address', lead.address || 'Not given'],
    ['About', lead.inquiryType],
    ['Message', lead.message],
  ]

  // Every visitor-typed value goes through escapeHtml. The email renders in
  // the client's own inbox; an unescaped message is a stored-XSS vector there.
  const html = `
    <h2 style="font-family:sans-serif">New lead from the website</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr>
               <td style="padding:6px 16px 6px 0;vertical-align:top;color:#666">${escapeHtml(label)}</td>
               <td style="padding:6px 0;vertical-align:top"><strong>${escapeHtml(value)}</strong></td>
             </tr>`,
        )
        .join('')}
    </table>
  `

  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n')

  return { html, text }
}

/**
 * onboarding@resend.dev is the one from-address Resend accepts without domain
 * verification — fine for smoke tests, wrong for launch (deliverability, and
 * replies go nowhere). Set LEAD_NOTIFY_FROM once the client's domain is
 * verified (Q10).
 */
const DEFAULT_FROM = 'Website <onboarding@resend.dev>'

export const resendNotifier: Notifier = {
  channel: 'resend',
  async send(lead) {
    // Imported lazily so selection logic (and every keyless code path) never
    // touches the SDK, and constructed per-send so a rotated key is picked up
    // without a redeploy of module state.
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { html, text } = leadEmailBodies(lead)

    const { error } = await resend.emails.send({
      from: process.env.LEAD_NOTIFY_FROM ?? DEFAULT_FROM,
      to: [process.env.LEAD_NOTIFY_TO as string],
      replyTo: lead.email || undefined,
      subject: leadSubject(lead),
      html,
      text,
    })

    if (error) {
      // Throw, never swallow: the caller shows the visitor an honest failure.
      throw new Error(`Resend rejected the message: ${error.message}`)
    }
  },
}

export function getNotifier(env: NodeJS.ProcessEnv = process.env): Notifier {
  return isDeliveryConfigured(env) ? resendNotifier : consoleNotifier
}
