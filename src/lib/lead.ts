import { z } from 'zod'

/** Digits only, then require a plausible US number. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

/**
 * Required: who you are, how to call you back, and what this is about. Email
 * and address are useful but they are not worth losing the lead over — six
 * required fields is a lot of friction for a first touch with a stranger.
 */
export const leadSchema = z
  .object({
    name: z.string().trim().min(2, 'Please tell us your name.'),
    phone: z
      .string()
      .trim()
      .min(1, 'We need a phone number to call you back.')
      .refine((v) => normalizePhone(v) !== null, 'That does not look like a US phone number.'),
    email: z
      .string()
      .trim()
      .refine(
        (v) => v === '' || z.string().email().safeParse(v).success,
        'Check the email address.',
      ),
    address: z.string().trim().max(200).optional().default(''),
    inquiryType: z.string().trim().min(1, 'Tell us what this is about.'),
    message: z
      .string()
      .trim()
      .min(20, 'A sentence or two about what you need helps us point you the right way.')
      .max(4000),
    /**
     * Honeypot. Hidden from people, irresistible to naive bots. A real
     * submission leaves it empty.
     */
    website: z.string().max(0, 'Rejected.').optional().default(''),
  })
  .transform((data) => ({
    ...data,
    phoneE164: normalizePhone(data.phone) as string,
  }))

export type Lead = z.infer<typeof leadSchema>

/**
 * Coarse in-memory burst limit.
 *
 * Deliberately modest: this is a small business contact form, not an API. It
 * stops a bot hammering the endpoint. It does not survive a restart or work
 * across instances, and it is not meant to — a real limiter belongs at the edge
 * (Vercel Firewall) once the site is deployed.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 3

const hits = new Map<string, number[]>()

export function checkRateLimit(
  key: string,
  now: number = Date.now(),
): { ok: true } | { ok: false; retryAfterMs: number } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent)
    return { ok: false, retryAfterMs: WINDOW_MS - (now - recent[0]) }
  }

  recent.push(now)
  hits.set(key, recent)
  return { ok: true }
}

/** Test seam. */
export function __resetRateLimit() {
  hits.clear()
}

/**
 * What the inquiry dropdown offers. These are deliberately generic — they
 * describe the shape of the conversation, not the client's services, so they
 * assert nothing about what the business sells. Tailor them once the service
 * list is confirmed (docs/CLIENT-QUESTIONS.md Q4).
 */
export const INQUIRY_TYPES = [
  { value: 'quote', label: 'A quote or estimate' },
  { value: 'question', label: 'A question about the work' },
  { value: 'existing', label: 'An existing job or order' },
  { value: 'other', label: 'Something else' },
] as const
