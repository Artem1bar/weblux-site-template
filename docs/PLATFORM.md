# When it's a platform, not a site

<!--
One page, deliberately. This template is a brochure-site skeleton; a platform build is
a different animal wearing the same docs. Recognize which one you're in before Phase 1.
-->

## The signals

You are building a platform, not a site, when any of these are true:

- **Auth and tenancy** — anyone logs in, or more than one org's data lives in it
- **A database with migrations** that must survive deploys
- **Background jobs** — queues, scheduled work, anything that runs when nobody clicked
- **Third-party API integrations** that need fixtures/sandboxes to develop against
- **CSP + Turnstile as posture**, not as an upgrade item
- **A threat model** worth writing down
- **An ADR log** — decisions that will be revisited and must not be re-argued
- **Worktree lane discipline** — multiple concurrent work lanes in one repo

Two or more: it's a platform. Say so in PLAN.md before scaffolding anything.

## What carries over

The docs lifecycle survives unchanged — reference capture → AUDIT → CLIENT-QUESTIONS →
PLAN → nightly reports → LAUNCH → HANDOFF. And this skeleton keeps its job: mount it as
a `(marketing)` route group so the brochure pages coexist with the product instead of
becoming a second repo to keep in sync.

## What this template does not give you

The platform concerns above. Study the reference implementations rather than
reinventing them — and point at them, don't restate them:

- **Platform reference A** (a private SaaS build) — the platform build to copy from:
  - `scripts/verify.sh` — the verification gate (typecheck, lint, tests, secret
    scan), wired as a Stop hook so a work turn cannot end red
  - `docs/BRANCHING.md` — worktree lane discipline, measured against `git rev-list`
    rather than remembered
  - `docs/DECISIONS.md` — append-only ADR log; supersede, never rewrite
  - `.claude/rules/` — per-domain rules the agent loads (frontend, migrations,
    security)
- **Platform reference B** (private) — the second platform reference (`docs/scoping.md`, `docs/workplan.md`)
