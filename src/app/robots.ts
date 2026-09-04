import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site-url'

/**
 * The class of old site this template replaces usually 404s here, so crawlers
 * get no guidance and no pointer to a sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Internal reference page, useful to us, noise in the index.
        disallow: ['/styleguide'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
