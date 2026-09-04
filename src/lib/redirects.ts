export type LegacyRedirect = {
  source: string
  destination: string
  permanent: boolean
}

/**
 * Cutover map from the client's old site. Ships empty; fill it from the answer
 * to docs/CLIENT-QUESTIONS.md Q12 (old-site URLs that must keep working).
 *
 * The discipline, learned the hard way across client cutovers:
 *
 * - Inventory the old site's live paths first (crawl it, check Search Console)
 *   — every path that 404s after cutover throws away whatever ranking and
 *   inbound links it had.
 * - Every rule is a 301 (`permanent: true`), not a 302: these paths have been
 *   live for years, and a temporary redirect transfers nothing.
 * - Paths that keep their meaning keep their URL and need no rule at all.
 * - Old form POST targets (the `/contact-send.php` kind) should land on the
 *   page that replaces the form, not on the homepage.
 *
 * Example rule:
 *   { source: '/index.php', destination: '/', permanent: true },
 *
 * next.config.ts feeds this array straight to `redirects()`, and
 * redirects.test.ts holds the invariants (301s only, no duplicate sources, no
 * self-redirects, root-relative destinations) from the first entry onward.
 */
export const legacyRedirects: LegacyRedirect[] = []
