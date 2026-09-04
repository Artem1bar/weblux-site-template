# Rebuild plan — {{CLIENT}}

{{One line: what is being replaced, with what, for whom.}} Template:
[weblux-site-template](https://github.com/Artem1bar/weblux-site-template).

## Goal

{{The site's job in one sentence — e.g. "convert a property owner who just took a loss
into a phone call". Everything else is secondary.}}

Target outcomes:
1. {{...}}
2. {{...}}
3. {{...}}

## Decisions (locked {{DATE}})

<!--
Decision + choice + rationale, locked on a date, so mid-build "why don't we just…"
has somewhere to be pointed. Anything not yet locked belongs in Still open, not here.
Typical rows: client stage, scope, stack, lead delivery, imagery source, hosting.
-->

| Decision | Choice | Rationale |
|---|---|---|
| Client stage | {{Greenlit — straight to build / Proposal first (onboarding stage 4)}} | {{...}} |
| Stack | {{Template default, unless a reason says otherwise}} | {{...}} |
| {{Lead delivery}} | {{...}} | {{...}} |
| {{Imagery}} | {{...}} | {{...}} |
| {{Hosting / cutover}} | {{...}} | {{...}} |

### Stack reasoning

{{Two or three sentences: why the template stack fits this client, or what deviates
and why. Not an essay — the template already argued the general case.}}

## Information architecture

<!-- The route tree IS the scope, visible at a glance. React to it before scaffolding. -->

```
/                       {{Home — positioning, proof, primary CTA}}
/services
  /services/{{slug}}    {{One page per service someone actually searches for}}
/about                  {{...}}
/contact                {{...}}
/areas/{{slug}}         {{Local SEO pages, if in scope — delete if not}}
+ sitemap.ts · robots.ts · opengraph-image · icon · redirects
```

## Phases

<!-- Every phase ends with an exit criterion someone can check, not a feeling. -->

### Phase 1 — Foundation

{{Scaffold, typed content layer, SEO fundamentals, analytics events, a11y baseline —
the invisible work with the highest ROI.}}
*Exit: {{...}}*

### Phase 2 — Conversion

{{Lead paths, CTAs, forms, emergency/after-hours path, the emotional sequencing of
the homepage.}}
*Exit: {{...}}*

### Phase 3 — Visual identity / imagery

{{Design tokens, art direction, the image pipeline with provenance and licensing.}}
*Exit: {{...}}*

### Phase 4 — Local SEO

{{Area pages, Google Business Profile alignment, structured data expansion, guidance
content.}}
*Exit: {{...}}*

## Lifted from the template

<!--
The port delta, explicit — the realtor plan proved these two sections are what make a
port reviewable. List what comes over as-is and what gets adapted; a reader should be
able to tell template code from client decisions without diffing.
-->

- {{Content module pattern, lead pipeline, SEO kit, tokens + contrast tests, shell components, test setup — strike what doesn't apply}}

## Not carried over

<!-- What must NOT leak into this build: prior clients' branding, content, jokes,
     one-off decisions. Name them so their absence is deliberate. -->

- {{...}}

## Still open

Blocking facts live in [CLIENT-QUESTIONS.md](./CLIENT-QUESTIONS.md), cited by number
from code. List here only open *decisions* (ours), not open facts (theirs).

- {{...}}

## Non-goals

<!-- The section that prevents the argument in month two. Longer than feels polite. -->

- {{...}}
