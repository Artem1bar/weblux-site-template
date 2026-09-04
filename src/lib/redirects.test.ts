import { describe, expect, it } from 'vitest'

import { legacyRedirects } from './redirects'

/**
 * The map ships empty (Q12 fills it), so most of these are vacuously green
 * today. They are the contract for the first entry onward: every path the
 * old site served has to land somewhere sensible, permanently, and a rule
 * that breaks one of these invariants should fail the build, not a visitor.
 */
describe('legacy redirects', () => {
  it('is an array — next.config.ts feeds it straight to redirects()', () => {
    expect(Array.isArray(legacyRedirects)).toBe(true)
  })

  it('is permanent, so ranking signal transfers', () => {
    for (const r of legacyRedirects) {
      expect(r.permanent).toBe(true)
    }
  })

  it('has no duplicate sources', () => {
    const sources = legacyRedirects.map((r) => r.source)
    expect(new Set(sources).size).toBe(sources.length)
  })

  it('never redirects a path to itself', () => {
    for (const r of legacyRedirects) {
      expect(r.source).not.toBe(r.destination)
    }
  })

  it('uses root-relative sources and destinations', () => {
    for (const r of legacyRedirects) {
      expect(r.source.startsWith('/')).toBe(true)
      expect(r.destination.startsWith('/')).toBe(true)
    }
  })

  it('never chains: no destination is itself a redirected source', () => {
    const sources = new Set(legacyRedirects.map((r) => r.source))
    for (const r of legacyRedirects) {
      expect(sources.has(r.destination), `${r.source} -> ${r.destination} chains`).toBe(false)
    }
  })
})
