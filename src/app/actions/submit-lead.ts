'use server'

import { headers } from 'next/headers'

import { isKnown } from '@/content/maybe'
import { site } from '@/content/site'
import { checkRateLimit, leadSchema } from '@/lib/lead'
import type { LeadState } from '@/lib/lead-state'
import { getNotifier } from '@/lib/notifier'

/**
 * What the visitor typed, echoed back so a rejected form can refill itself.
 *
 * The honeypot is deliberately excluded: sending it back would repopulate the
 * trap for a bot that fell into it, and there is no legitimate value to restore.
 */
function echo(formData: FormData): Record<string, string> {
  const fields = ['name', 'phone', 'email', 'address', 'inquiryType', 'message'] as const
  return Object.fromEntries(fields.map((field) => [field, String(formData.get(field) ?? '')]))
}

/** "Please call us" only where there is a confirmed number to call (Q3). */
function failureMessage(): string {
  if (isKnown(site.phone)) {
    return `Something went wrong sending that. Please call ${site.phone.value.display} so this does not sit unanswered.`
  }
  return 'Something went wrong sending that. Please try again in a moment.'
}

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const parsed = leadSchema.safeParse({
    name: formData.get('name') ?? '',
    phone: formData.get('phone') ?? '',
    email: formData.get('email') ?? '',
    address: formData.get('address') ?? '',
    inquiryType: formData.get('inquiryType') ?? '',
    message: formData.get('message') ?? '',
    website: formData.get('website') ?? '',
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '_')
      if (!fieldErrors[key]) fieldErrors[key] = issue.message
    }
    // A filled honeypot looks like a normal validation failure from the outside.
    return {
      status: 'error',
      message: 'Please check the highlighted fields.',
      fieldErrors,
      values: echo(formData),
    }
  }

  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  const limit = checkRateLimit(ip)
  if (!limit.ok) {
    return {
      status: 'error',
      message: `That is a lot of submissions at once. Try again in ${Math.ceil(limit.retryAfterMs / 1000)} seconds.`,
      values: echo(formData),
    }
  }

  try {
    await getNotifier().send(parsed.data)
  } catch (error) {
    // Never swallow this. A form that says "thanks" and drops the lead is worse
    // than one that admits it failed.
    console.error('[lead] notifier failed', error)
    return {
      status: 'error',
      message: failureMessage(),
      values: echo(formData),
    }
  }

  return {
    status: 'success',
    message: 'Got it. We will get back to you.',
    received: { name: parsed.data.name, phone: parsed.data.phone },
  }
}
