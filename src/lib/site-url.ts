/**
 * The origin every absolute URL is built from: canonicals, sitemap entries,
 * Open Graph images, JSON-LD @id values.
 *
 * The production domain is a client fact (docs/CLIENT-QUESTIONS.md Q10), so
 * this reads from the environment rather than hardcoding a guess. Vercel sets
 * VERCEL_PROJECT_PRODUCTION_URL automatically, which keeps preview deploys
 * honest without any configuration. `npm run check:launch` refuses a launch
 * while NEXT_PUBLIC_SITE_URL is unset.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/+$/, '')

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`.replace(/\/+$/, '')

  return 'http://localhost:3000'
}

export const siteUrl = resolveSiteUrl()

/** Absolute URL for a root-relative path. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${siteUrl}/`).toString()
}
