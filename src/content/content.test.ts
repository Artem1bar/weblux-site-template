import { describe, expect, it } from 'vitest'

import { areas, areasPending } from './areas'
import { caseStudies, caseStudiesPending } from './case-studies'
import { faqs, faqsPending } from './faq'
import { isKnown, isPending, known, pending, valueOr, type Pending } from './maybe'
import { services, servicesPending, serviceBySlug } from './services'
import { NAME_PLACEHOLDER, site } from './site'
import { team, teamPending, teamMemberBySlug } from './team'
import { testimonials, testimonialsPending } from './testimonials'

describe('maybe', () => {
  it('marks a verified value as known', () => {
    const v = known('abc')
    expect(isKnown(v)).toBe(true)
    expect(isPending(v)).toBe(false)
    expect(v.value).toBe('abc')
  })

  it('makes a pending value carry the question that would resolve it', () => {
    const p = pending('Q1: legal name')
    expect(isPending(p)).toBe(true)
    expect(isKnown(p)).toBe(false)
    expect(p.question).toMatch(/Q1/)
  })

  it('refuses an empty question, so a gap can never be untraceable', () => {
    expect(() => pending('')).toThrow()
    expect(() => pending('   ')).toThrow()
  })

  it('valueOr falls back without throwing', () => {
    expect(valueOr(known('real'), 'fallback')).toBe('real')
    expect(valueOr(pending('Q1: something'), 'fallback')).toBe('fallback')
  })
})

/**
 * The template's core discipline, held mechanically: every fact slot ships
 * pending, and every pending value cites the standing client question that
 * resolves it, in the canonical `Q<n>: <question>` form. A pending value with
 * a free-floating question would drift out of docs/CLIENT-QUESTIONS.md and
 * become untraceable.
 */
const QUESTION_FORMAT = /^Q([1-9]|1[0-5]): .{10,}/

function collectPending(value: unknown, path: string, out: [string, Pending][]) {
  if (value && typeof value === 'object') {
    if ('known' in value && (value as { known: unknown }).known === false) {
      out.push([path, value as Pending])
      return
    }
    for (const [key, child] of Object.entries(value)) {
      collectPending(child, `${path}.${key}`, out)
    }
  }
}

describe('content discipline', () => {
  it('ships every site fact pending — nothing is invented', () => {
    expect(isPending(site.name)).toBe(true)
    expect(isPending(site.legalName)).toBe(true)
    expect(isPending(site.tagline)).toBe(true)
    expect(isPending(site.foundedYear)).toBe(true)
    expect(isPending(site.phone)).toBe(true)
    expect(isPending(site.email)).toBe(true)
    expect(isPending(site.address)).toBe(true)
    expect(isPending(site.hours)).toBe(true)
    expect(isPending(site.licenseNumber)).toBe(true)
    expect(isPending(site.socialProfiles)).toBe(true)
  })

  it('cites a canonical standing question on every pending value', () => {
    const found: [string, Pending][] = []
    collectPending(site, 'site', found)
    for (const p of [
      ['servicesPending', servicesPending],
      ['areasPending', areasPending],
      ['teamPending', teamPending],
      ['testimonialsPending', testimonialsPending],
      ['faqsPending', faqsPending],
      ['caseStudiesPending', caseStudiesPending],
    ] as const) {
      found.push([p[0], p[1]])
    }

    expect(found.length).toBeGreaterThan(10)
    for (const [path, p] of found) {
      expect(p.question, `${path} must cite docs/CLIENT-QUESTIONS.md as "Q<n>: …"`).toMatch(
        QUESTION_FORMAT,
      )
    }
  })

  it('uses a placeholder name that cannot be mistaken for a real brand', () => {
    expect(NAME_PLACEHOLDER).toMatch(/your business/i)
  })
})

describe('content arrays', () => {
  it('ship empty rather than fabricated', () => {
    // Every one of these is a set of claims about a business nobody has
    // confirmed. Empty is honest; plausible is dangerous.
    expect(services).toEqual([])
    expect(areas).toEqual([])
    expect(team).toEqual([])
    expect(testimonials).toEqual([])
    expect(faqs).toEqual([])
    expect(caseStudies).toEqual([])
  })

  it('lookups return undefined rather than throwing while empty', () => {
    expect(serviceBySlug('anything')).toBeUndefined()
    expect(teamMemberBySlug('anything')).toBeUndefined()
  })
})

/**
 * Invariants that hold from the first real entry onward. They are vacuous
 * today; they exist so filling the arrays in cannot silently break them.
 */
describe('content invariants (for when the arrays fill in)', () => {
  it('service slugs are unique and ctas are specific', () => {
    const slugs = services.map((s) => s.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of services) {
      expect(s.cta).not.toMatch(/explore more/i)
      expect(s.summary.length).toBeGreaterThan(20)
      expect(s.body.length).toBeGreaterThan(0)
    }
  })

  it('team slugs are unique', () => {
    expect(new Set(team.map((m) => m.slug)).size).toBe(team.length)
  })

  it('area slugs are unique', () => {
    expect(new Set(areas.map((a) => a.slug)).size).toBe(areas.length)
  })

  it('faq entries are questions with substantive answers', () => {
    for (const f of faqs) {
      expect(f.question.trim().endsWith('?')).toBe(true)
      expect(f.answer.length).toBeGreaterThan(20)
    }
  })
})
