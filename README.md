# Weblux Site Template

The starting point for a Weblux client site: a Next.js brochure-site skeleton plus the
docs lifecycle every build runs, from reference capture to handover.

Distilled 2026-08-14 from five shipped client builds (named generically here):

- **The first build** (an overnight run) — typed content with `pending()` unknowns,
  the lead pipeline, the SEO kit, contrast-enforced tokens
- **A realtor's site** — the port of the first build: proved Q-number citations from
  code and the explicit port-delta sections in PLAN.md
- **A tire shop** — placeholder discipline (555-01xx numbers that can never ring anyone)
  and a README that tells the owner what must change before launch
- **A refrigeration contractor** — runs with zero env vars, console-fallback lead
  delivery, screenshot QA across both themes
- **A detailing shop** — the image pipeline and the Vercel Hobby ToS lesson

Where a rule below seems oddly specific, one of these five paid for it.

## Stamping a new client project

1. **Copy the repo** to `~/<client>`. The directory name is the project's working name.
2. **Set `package.json` `name`** to the brand slug (convention: the brand, slugged —
   `example-realty`). The slug is the project's identity everywhere it appears.
3. **Assign a unique `E2E_PORT`.** Each client project on this machine gets its own so
   parallel e2e runs never collide. `3300` is the template's; pick a free one and keep
   it for the life of the project.
4. **Fill the `.env.example` trio** into `.env.local`: `NEXT_PUBLIC_SITE_URL`,
   `NEXT_PUBLIC_GA_ID`, and `LEAD_NOTIFY_TO` + `RESEND_API_KEY`. The site runs without
   them; the lead form delivers nothing until they exist.
5. **Run the docs lifecycle** (next section). Capture and audit come before code.
6. **Create the Vercel project**, named after the brand slug, on a **paid plan**.
   Hobby's terms are non-commercial — a client business site does not qualify
   (the detailing shop's handoff README records this).
7. **Demo on `<project>.vercel.app`.** The client's real domain moves only via
   [docs/LAUNCH.md](docs/LAUNCH.md) — DNS is never touched casually.

## The docs lifecycle

```
reference capture            archive the existing site into reference/ — HTML, CSS,
        │                    images, screenshots. Evidence for every audit claim.
        ▼
docs/AUDIT.md                what's broken, measured — and what's worth keeping
        ▼
docs/CLIENT-QUESTIONS.md     everything unverifiable, numbered so code can cite it
        ▼
docs/PLAN.md                 goal, locked decisions, IA, phases, the port delta
        ▼
(proposal)                   only if the client isn't already greenlit — onboarding
        │                    stage 4: ~/weblux/docs/onboarding/04-proposal-and-agreement.md
        ▼
build                        overnight runs land their reports in docs/nightly/
        │                    (one dated report per run)
        ▼
docs/LAUNCH.md               go-live with an owner and a date on every line
        ▼
docs/HANDOFF.md              the client can leave — the proof it was done right
```

`docs/AUDIT.md`, `docs/CLIENT-QUESTIONS.md`, and `docs/PLAN.md` in this repo are
fill-in templates carrying the conventions. `docs/LAUNCH.md` and `docs/HANDOFF.md` are
the two artifacts past builds skipped; they ship in the repo so skipping them is a
visible act rather than a quiet one.

## What every project eventually needed

Consult during PLAN, not after launch. Every item here was retrofitted at least once:

- [ ] **Real email transport** — the first build shipped a console-logging notifier; leads are
      the entire point. Wire Resend and verify a submitted lead reaches a human.
- [ ] **Legal pages** — privacy and terms; the forms collect personal data on day one.
- [ ] **Analytics events at page-build time** — wiring call/form conversion events
      after the pages exist means a second pass over every CTA.
- [ ] **Spam protection beyond the honeypot** — the upgrade is Turnstile on the forms
      plus Vercel Firewall rules. Decide when, not whether.
- [ ] **Image pipeline with provenance + licensing doctrine** — origin and license
      recorded per image; no stock with unverified property releases; generated
      imagery never captioned as the client's real work.
- [ ] **Redirect map + e2e walk of old URLs** — every old URL with traffic 301s
      somewhere real, and a test proves it stays that way.
- [ ] **A11y pass in both themes** — contrast holds in light and dark, or the second
      theme doesn't ship.
- [ ] **Favicon / OG identity** — the tab icon and the link preview are brand
      deliverables, not leftovers.
- [ ] **404 / error pages** — designed, on-brand, with a way back to something useful.
- [ ] **Canonical URLs** — one canonical origin driving sitemap, OG, and JSON-LD.
- [ ] **One-tap `tel:` CTA on mobile** — local service businesses convert by phone.
- [ ] **Form-state preservation** — a failed submit never eats what the visitor typed.

## Site or platform?

This template is the brochure-site skeleton. When the engagement is a product — auth,
tenancy, a database, integrations — the docs lifecycle still applies, and this skeleton
becomes the `(marketing)` route group inside the platform repo. The boundary, and the
reference implementations (two private platform builds): [docs/PLATFORM.md](docs/PLATFORM.md).

## Built with

Built with Claude Code, Anthropic's agentic coding tool.
