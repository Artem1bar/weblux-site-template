#!/usr/bin/env node
/**
 * Launch gate: refuses a go-live while any launch-blocking variable is unset.
 *
 *   npm run check:launch
 *
 * Run it in the environment that is about to serve production (locally with
 * the production env loaded, or in the deploy pipeline's promote step). It is
 * deliberately NOT part of `npm run build` — preview deploys must work
 * keyless, and a scaffold that cannot build without secrets teaches people to
 * paste secrets where they do not belong.
 *
 * Each variable names what breaks without it and the client question that
 * resolves it (docs/CLIENT-QUESTIONS.md).
 */

const REQUIRED = [
  {
    name: 'LEAD_NOTIFY_TO',
    why: 'leads fall back to server logs instead of reaching a human',
    question: 'Q2 (lead routing)',
  },
  {
    name: 'RESEND_API_KEY',
    why: 'lead email delivery is off; the notifier logs to the console',
    question: 'Q2 (lead routing)',
  },
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    why: 'canonicals, sitemap, OG and JSON-LD publish a preview/localhost origin',
    question: 'Q10 (domain + DNS)',
  },
]

const missing = REQUIRED.filter(({ name }) => {
  const value = process.env[name]
  return !value || value.trim().length === 0
})

if (missing.length === 0) {
  console.log('check:launch — all launch-blocking variables are set.')
  process.exit(0)
}

console.error('check:launch — NOT ready to launch. Unset launch-blocking variables:\n')
for (const { name, why, question } of missing) {
  console.error(`  ${name}`)
  console.error(`    unset means: ${why}`)
  console.error(`    resolved by: ${question}\n`)
}
console.error(`${missing.length} of ${REQUIRED.length} launch-blocking variables missing.`)
process.exit(1)
