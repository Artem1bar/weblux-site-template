import { beforeEach, describe, expect, it } from 'vitest'

import { __resetRateLimit, checkRateLimit, INQUIRY_TYPES, leadSchema, normalizePhone } from './lead'

const valid = {
  name: 'Marie Boudreaux',
  phone: '(555) 555-0142',
  inquiryType: 'quote',
  message: 'The kitchen unit stopped working on Friday and the vendor quote seems far too high.',
  email: '',
  address: '',
  website: '',
}

describe('normalizePhone', () => {
  it('reduces a formatted US number to E.164', () => {
    expect(normalizePhone('(555) 555-0142')).toBe('+15555550142')
    expect(normalizePhone('555-555-0142')).toBe('+15555550142')
    expect(normalizePhone('5555550142')).toBe('+15555550142')
  })

  it('keeps an already-prefixed number', () => {
    expect(normalizePhone('+15555550142')).toBe('+15555550142')
  })

  it('returns null for something that is not a US number', () => {
    expect(normalizePhone('12345')).toBeNull()
    expect(normalizePhone('')).toBeNull()
  })
})

describe('leadSchema', () => {
  it('accepts a minimal real submission', () => {
    expect(leadSchema.safeParse(valid).success).toBe(true)
  })

  it('requires a name', () => {
    expect(leadSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })

  it('requires a usable phone number', () => {
    expect(leadSchema.safeParse({ ...valid, phone: '' }).success).toBe(false)
    expect(leadSchema.safeParse({ ...valid, phone: '123' }).success).toBe(false)
  })

  it('normalises the phone into E.164 alongside the raw input', () => {
    const r = leadSchema.safeParse(valid)
    expect(r.success && r.data.phoneE164).toBe('+15555550142')
  })

  it('requires enough of a message to be actionable', () => {
    expect(leadSchema.safeParse({ ...valid, message: 'help' }).success).toBe(false)
  })

  it('treats email and address as optional', () => {
    // Requiring six fields before a stranger has any reason to trust the site
    // is how leads get lost.
    const r = leadSchema.safeParse({ ...valid, email: '', address: '' })
    expect(r.success).toBe(true)
  })

  it('still validates email when one is given', () => {
    expect(leadSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false)
    expect(leadSchema.safeParse({ ...valid, email: 'a@b.co' }).success).toBe(true)
  })

  it('requires an inquiry type', () => {
    expect(leadSchema.safeParse({ ...valid, inquiryType: '' }).success).toBe(false)
  })

  it('rejects a submission that filled the honeypot', () => {
    expect(leadSchema.safeParse({ ...valid, website: 'http://spam.example' }).success).toBe(false)
  })

  it('trims surrounding whitespace', () => {
    const r = leadSchema.safeParse({ ...valid, name: '  Marie  ' })
    expect(r.success && r.data.name).toBe('Marie')
  })
})

describe('inquiry types', () => {
  it('are generic conversation shapes, not invented services', () => {
    // The dropdown must not assert what the business sells before Q4 answers.
    expect(INQUIRY_TYPES.length).toBeGreaterThanOrEqual(3)
    const values = INQUIRY_TYPES.map((t) => t.value)
    expect(new Set(values).size).toBe(values.length)
    for (const t of INQUIRY_TYPES) {
      expect(t.label.length).toBeGreaterThan(0)
    }
  })
})

describe('checkRateLimit', () => {
  beforeEach(() => __resetRateLimit())

  it('allows the first few submissions from one source', () => {
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit('1.2.3.4').ok).toBe(true)
    }
  })

  it('blocks once the burst limit is passed', () => {
    for (let i = 0; i < 3; i++) checkRateLimit('1.2.3.4')
    expect(checkRateLimit('1.2.3.4').ok).toBe(false)
  })

  it('keeps sources independent', () => {
    for (let i = 0; i < 3; i++) checkRateLimit('1.2.3.4')
    expect(checkRateLimit('5.6.7.8').ok).toBe(true)
  })
})
