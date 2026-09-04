import { describe, expect, it } from 'vitest'

import { footerColumns, primaryNav } from '@/components/site/nav-config'
import { areas } from '@/content/areas'
import { services } from '@/content/services'
import { team } from '@/content/team'
import { siteUrl } from '@/lib/site-url'

import robots from './robots'
import sitemap from './sitemap'

describe('siteUrl', () => {
  it('never ends in a trailing slash, so joins do not double up', () => {
    expect(siteUrl.endsWith('/')).toBe(false)
  })

  it('is an absolute URL', () => {
    expect(() => new URL(siteUrl)).not.toThrow()
  })
})

describe('robots.txt', () => {
  const r = robots()

  it('exists at all — the class of old site this replaces usually 404s here', () => {
    expect(r).toBeTruthy()
  })

  it('allows crawling of the public site', () => {
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules]
    expect(rules.some((rule) => rule.allow === '/' || rule.allow?.includes('/'))).toBe(true)
  })

  it('keeps the internal style guide out of the index', () => {
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules]
    const disallowed = rules.flatMap((rule) =>
      Array.isArray(rule.disallow) ? rule.disallow : rule.disallow ? [rule.disallow] : [],
    )
    expect(disallowed).toContain('/styleguide')
  })

  it('points at the sitemap', () => {
    expect(r.sitemap).toBe(`${siteUrl}/sitemap.xml`)
  })
})

describe('sitemap.xml', () => {
  const entries = sitemap()
  const urls = entries.map((e) => e.url)

  it('exists at all', () => {
    expect(entries.length).toBeGreaterThan(0)
  })

  it('uses absolute URLs on the configured origin', () => {
    for (const url of urls) {
      expect(url.startsWith(siteUrl)).toBe(true)
    }
  })

  it('has no duplicates', () => {
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('includes the home page at the highest priority', () => {
    expect(urls).toContain(`${siteUrl}/`)
    const home = entries.find((e) => e.url === `${siteUrl}/`)
    expect(home?.priority).toBe(1)
    for (const entry of entries) {
      expect(entry.priority).toBeLessThanOrEqual(1)
    }
  })

  it('includes every content-derived page, from the same modules the pages read', () => {
    for (const s of services) expect(urls).toContain(`${siteUrl}/services/${s.slug}`)
    for (const m of team) expect(urls).toContain(`${siteUrl}/team/${m.slug}`)
    for (const a of areas) expect(urls).toContain(`${siteUrl}/areas/${a.slug}`)
  })

  it('excludes the internal style guide', () => {
    expect(urls.some((u) => u.includes('/styleguide'))).toBe(false)
  })

  it('excludes the noindexed legal placeholders until their content is real (Q9)', () => {
    // A sitemap advertising pages that ask not to be indexed is contradictory.
    // When the noindex comes off privacy/terms/accessibility, add them to
    // sitemap.ts and flip this test.
    for (const path of ['/privacy', '/terms', '/accessibility']) {
      expect(
        urls.some((u) => u.endsWith(path)),
        `${path} should stay out while noindexed`,
      ).toBe(false)
    }
  })
})

/**
 * Nav and sitemap are two views of one route set. Everything the nav links to
 * must be a real, indexable page (or a deliberately-noindexed legal page);
 * everything in the sitemap must be reachable from the UI. Holding the two
 * together is what stops a page existing in one and not the other.
 */
describe('nav <-> sitemap resolution', () => {
  const sitemapPaths = new Set(
    sitemap().map((e) => new URL(e.url).pathname.replace(/\/$/, '') || '/'),
  )
  const noindexed = new Set(['/privacy', '/terms', '/accessibility'])

  const navHrefs = [
    ...primaryNav.flatMap((i) => [i.href, ...(i.children?.map((c) => c.href) ?? [])]),
    ...footerColumns.flatMap((col) => col.links.map((l) => l.href)),
  ]

  it('every nav link is in the sitemap, or deliberately noindexed', () => {
    for (const href of navHrefs) {
      expect(
        sitemapPaths.has(href) || noindexed.has(href),
        `${href} is in the nav but neither in the sitemap nor a known noindexed page`,
      ).toBe(true)
    }
  })

  it('every indexable sitemap page is reachable from the nav or is a home/hub page', () => {
    const reachable = new Set([...navHrefs, '/'])
    for (const path of sitemapPaths) {
      // Detail pages hang off their hub (services/areas/team indexes).
      const hub = `/${path.split('/')[1]}`
      expect(
        reachable.has(path) || reachable.has(hub),
        `${path} is in the sitemap but nothing links toward it`,
      ).toBe(true)
    }
  })
})
