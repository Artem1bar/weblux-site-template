import type { MetadataRoute } from 'next'

import { areas } from '@/content/areas'
import { services } from '@/content/services'
import { team } from '@/content/team'
import { siteUrl } from '@/lib/site-url'

/**
 * Generated from the content modules rather than hand-listed, so a new
 * service, team or area page cannot end up missing from the sitemap — the
 * same modules feed nav-config.ts, and seo.test.ts holds the two ends
 * together so nothing is reachable from one and not the other.
 *
 * Deliberately absent:
 * - /styleguide — internal, robots-disallowed.
 * - /privacy, /terms, /accessibility — noindex until their real text lands
 *   (Q9); a sitemap advertising pages that ask not to be indexed is
 *   contradictory. Add them here the day the noindex comes off.
 * - lastModified — a build timestamp on every URL tells crawlers everything
 *   changed on every deploy, which is worse than saying nothing.
 */
type Entry = MetadataRoute.Sitemap[number]

const staticPages: {
  path: string
  priority: number
  changeFrequency: Entry['changeFrequency']
}[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/team', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/reviews', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/areas', priority: 0.6, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages.map((page) => ({
      url: `${siteUrl}${page.path}`,
      priority: page.priority,
      changeFrequency: page.changeFrequency,
    })),
    ...services.map((service) => ({
      url: `${siteUrl}/services/${service.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
    })),
    ...team.map((member) => ({
      url: `${siteUrl}/team/${member.slug}`,
      priority: 0.6,
      changeFrequency: 'yearly' as const,
    })),
    ...areas.map((area) => ({
      url: `${siteUrl}/areas/${area.slug}`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
    })),
  ]
}
