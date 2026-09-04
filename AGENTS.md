# weblux-site-template — project briefing

A reusable Next.js scaffold for building small-business client sites. It
distils five client builds into one de-branded starting point whose gates all
pass before a single client fact has been entered. Nothing in it asserts a
fact about any business: the template's whole discipline is that it renders
honestly while everything is still pending.

## Commands

Package manager: **npm** (package-lock.json).

- `npm run dev` — Next.js dev server (localhost:3000)
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint
- `npm run typecheck` — `next typegen && tsc --noEmit`
- `npm test` / `npm run test:watch` / `npm run test:cov` — Vitest
- `npm run e2e` — Playwright against a production build (builds first via
  webServer; port 3300, override with `E2E_PORT`; never reuses a running
  server unless `E2E_REUSE=1` — two client projects on one machine must not
  silently test the wrong codebase)
- `npm run qa:screenshots` — full visual sweep: routes × 3 breakpoints ×
  light+dark into `qa-screens/`, console/page/request errors flagged; needs a
  server on `QA_BASE_URL` (default localhost:3300)
- `npm run check:launch` — launch gate: exits non-zero listing every
  launch-blocking env var unset (LEAD_NOTIFY_TO, RESEND_API_KEY,
  NEXT_PUBLIC_SITE_URL). Deliberately not part of the build — preview deploys
  must work keyless.
- `./scripts/a11y.sh [light|dark]` — axe-core over every route; requires the
  gstack `browse` CLI (machine-specific; exits early without it)

## Content discipline — the heart of the template

**No invented facts, ever.** No fake business name, testimonials, phone
numbers, addresses, service claims, or legal text.

- `src/content/maybe.ts` is the mechanism: every client fact is
  `Known<T> | Pending`, and `pending(question)` throws unless the question
  that resolves it is supplied. Cite the standing list in
  docs/CLIENT-QUESTIONS.md as `Q<n>: <question>` — tests enforce the format.
- Content arrays (services, areas, team, testimonials, faqs, case-studies)
  ship **empty**. Components tolerate empty gracefully: hide the section, or
  render `PendingNote` — the standard empty state, which shows visitors plain
  copy and carries the resolving question into the DOM as
  `data-pending-question` (e2e audits that no raw question ever renders as
  visible text).
- Structured data follows the same rule harder: `localBusinessSchema()`
  returns null until identity facts are known — no JSON-LD is better than
  fabricated JSON-LD.
- The one place placeholder text is fine: neutral structural copy that
  carries no factual claim (section headings like "What we do", the
  wireframe-style hero copy on the homepage, `NAME_PLACEHOLDER`).
- Imagery: the registry (`src/assets/images`) ships empty and every entry
  requires `provenance`. Atmosphere, never evidence — no generated face for a
  named person, no generated building captioned as the office.

## Structure

- `src/app/` — routes: `/`, `/about`, `/services(/[slug])`, `/areas(/[slug])`,
  `/team(/[slug])`, `/reviews`, `/contact`, `/styleguide` (robots-disallowed),
  `/privacy` `/terms` `/accessibility` (honest placeholders, noindex until Q9
  lands real text — then also add them to sitemap.ts), `not-found.tsx`,
  `error.tsx`, `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, `icon.svg`
  (placeholder, Q6), `actions/submit-lead.ts`
- `src/content/` — the fact layer: `maybe.ts`, `site.ts` (everything
  pending), plus the empty arrays; each exports its `…Pending` question
- `src/components/` — `site/` (header, footer, mobile-nav, nav-config,
  skip-link, breadcrumbs, cta-band, page-hero, phone-link, lead-form,
  theme-toggle, json-ld, analytics, service-card, team-card, pending-note,
  outbound-link), `ui/` (button, layout), `media/` (figure, ambient-video),
  `motion/` (count-up), `brand/brand-mark.tsx` (neutral placeholder, Q6)
- `src/lib/` — lead (validation; the old `lossType` field is generalized to
  `inquiryType`), lead-state, notifier (console + Resend, selected by env),
  schema, redirects (empty documented map feeding next.config.ts),
  site-url, analytics (`CONVERSIONS` incl. `outbound_click`), contrast
  (WCAG math the token tests run on), cn, theme-init, imagery
- `src/styles/tokens.ts` — the neutral palette (slate ink, white/deep-slate
  surfaces, saturated blue brand, accent that lifts pale in dark);
  `/styleguide` renders it, `contrast.test.ts` gates every swap
- `e2e/journeys.spec.ts` — production-build journeys, incl. the
  pending-note audit and a legacy-redirect walk that binds when Q12 fills
  the map
- `test/` — vitest shims (static images, server-only)
- `scripts/` — check-launch-env.mjs, qa-screenshots.mjs, a11y.sh
- `docs/` — CLIENT-QUESTIONS.md (the canonical Q1–Q15 list) and per-client
  process docs

## Stack & conventions

- Next.js 16.3.0 (App Router), React 19.2.8, TypeScript strict
- Tailwind CSS v4 via `@tailwindcss/postcss`; tokens mirrored between
  `tokens.ts` and `globals.css` (change both — dark values appear twice in
  the CSS: media block + attribute block)
- Theme: **system-follow by default**, explicit choice persisted via the
  header toggle. Forcing one reviewed theme is a per-brand decision — see the
  comment in globals.css before making it.
- Fonts: one neutral face (Inter) in both the sans and display slots via
  next/font; swap per brand in layout.tsx + globals.css (Q6)
- Leads: zod-validated server action → `getNotifier()` — Resend when
  `RESEND_API_KEY` + `LEAD_NOTIFY_TO` are set (HTML-escaped, subject carries
  name+phone), console otherwise, loudly. A notifier succeeds or throws;
  the form never fakes a "thanks".
- Security headers in next.config.ts; redirects come from data
  (`src/lib/redirects.ts`)
- Playwright runs against `next build && next start`, never against dev

## Deliberately dropped from the source builds

Carried out of the first client build's port, minus its client-specifics:

- **`/free-claim-review`** — a per-client conversion landing page. Decide the
  primary conversion per client and build that page then; the template's CTAs
  point at `/contact`.
- **`/results`** — case-study showcase; `src/content/case-studies.ts` ships
  empty and no page consumes it until a client supplies real outcomes (Q14).
- The client's mark and palette (gold/navy), Catamaran/Fraunces faces, all
  client content and imagery, and a client-specific easter egg.
- Timeline / values / why-choose-us sections — coupled to that client's
  story; rebuild per client from confirmed content.
- The realtor build's `IdxLink` is generalized here as `OutboundLink`
  (tracked handoff to any client-controlled external system).
