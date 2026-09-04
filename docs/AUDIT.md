# Audit — {{DOMAIN}}

Captured {{DATE}}. Evidence: `reference/` (HTML, CSS, images, screenshots) and the
browse-session measurements quoted below.

<!--
Every claim in this file is measured, not remembered: quote the number and name where
it came from. The audit has two audiences forever. (1) The build — findings become
code comments justifying design choices ("audit #3" next to the one-h1 rule, the
contrast test that encodes the a11y finding). (2) The client — the audit doubles as
the sales asset; two past clients' proposals were assembled from these
files nearly verbatim. Write every finding so it survives both readings.
-->

## Summary

{{One paragraph naming the defects that cost money. Not a list of everything wrong —
the two or three things that make the rebuild worth paying for, and the strongest
asset hiding underneath them.}}

## Critical

<!--
Findings are numbered continuously across all four severities so they can be cited —
from PLAN.md, commit messages, and code — as "audit #4". The heading IS the claim:
one falsifiable sentence. The body is the evidence: measurements, quotes, tables,
and what it costs the business. Severity is about money and trust, not code purity.
-->

### 1. {{One-sentence claim}}

{{Evidence: what was measured, how, and why it costs money.}}

### 2. {{One-sentence claim}}

{{...}}

## High

### {{N}}. {{One-sentence claim}}

{{...}}

## Medium

### {{N}}. {{One-sentence claim}}

{{...}}

## Low

<!-- Small stuff may degrade to bullets, but it still gets recorded — low is not "skip". -->

- {{...}}

## What's worth keeping

<!--
The section that keeps the audit fair and the rebuild honest. Every build so far kept
more than expected — one client kept the copy, the team bios, and the brand; another
kept ten service descriptions and the palette. Naming what survives is also what stops
the rebuild from discarding the client's real equity.
-->

- {{Copy / brand / positioning / URLs that survive into the rebuild, and why.}}

## Content inventory (real vs. template)

<!--
Which content is genuinely the client's and which is template filler, stock, or lorem.
This table decides what ports into the typed content layer and what gets replaced —
and it is the fastest way to show a client what their last vendor actually delivered.
-->

| Content | Status |
|---|---|
| {{Section / page / asset}} | {{**Real copy** — keep / Template — replace / Stock — replace}} |

## Business facts (verified during capture)

<!--
Only facts verified against a source during capture: NAP, hours, license numbers,
socials, stack. These seed the content layer and the Google Business Profile
alignment. Anything you could not verify is not a fact — it goes to
CLIENT-QUESTIONS.md with a number instead.
-->

- {{Legal name, address, phone, email — and what each was verified against}}
- {{Current stack: platform, theme, plugins, hosting}}
