import { describe, expect, it } from 'vitest'

import { images } from '@/assets/images'
import { areas } from '@/content/areas'
import { services } from '@/content/services'

import {
  areaImage,
  pairedAreaSlugs,
  pairedServiceSlugs,
  registrySize,
  serviceImage,
} from './imagery'

/**
 * These lookups return undefined rather than throw, so a slug that does not
 * match is invisible in the browser — the page still renders, just imageless
 * (or, once a fallback exists, with the wrong picture). These tests turn that
 * class of mistake back into a failing build, in both directions, and they
 * bind from the moment either side stops being empty.
 */
describe('imagery pairings', () => {
  it('ships empty alongside the empty image registry (Q6)', () => {
    expect(registrySize).toBe(0)
    expect(pairedServiceSlugs).toEqual([])
    expect(pairedAreaSlugs).toEqual([])
  })

  it('never pairs a slug that no service has', () => {
    const slugs = services.map((service) => service.slug)
    const stale = pairedServiceSlugs.filter((slug) => !slugs.includes(slug))
    expect(stale, `image pairings for unknown services: ${stale.join(', ')}`).toEqual([])
  })

  it('never pairs a slug that no area has', () => {
    const slugs = areas.map((area) => area.slug)
    const stale = pairedAreaSlugs.filter((slug) => !slugs.includes(slug))
    expect(stale, `image pairings for unknown areas: ${stale.join(', ')}`).toEqual([])
  })

  it('answers undefined, not a throw, for an unpaired slug', () => {
    expect(serviceImage('nope')).toBeUndefined()
    expect(areaImage('nope')).toBeUndefined()
  })

  it('only ever hands back images from the registry', () => {
    const registry = new Set(Object.values(images))
    for (const slug of pairedServiceSlugs) {
      expect(registry.has(serviceImage(slug)!)).toBe(true)
    }
    for (const slug of pairedAreaSlugs) {
      expect(registry.has(areaImage(slug)!)).toBe(true)
    }
  })
})
