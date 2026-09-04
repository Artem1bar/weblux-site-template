# Client questions — {{CLIENT}}

Numbered so code can cite them: a fact we cannot verify ships as
`pending('Q2: where do leads go?')` in the content layer, or
`data-pending-question="Q2"` in markup. ⛔ marks build-blockers — no launch while one
is open; the rest can trickle in. Grep-able both directions: from a question number to
every place the code depends on it, and from any `pending()` back to the exact
question to ask. Never renumber — the numbers are load-bearing once cited.

## Part 1 — Standing questions (every project)

<!--
Q1–Q15 keep these numbers across all Weblux projects, so "Q10" means DNS access in
every repo. Delete none; mark a resolved one with the answer and the date. Access
items — who invites us into which system — are the access checklist's job
(a separate onboarding document); don't restate it here.
These are the FACTS only the client knows.
-->

1. ⛔ **Business identity** — exact legal name, year founded, team size, office hours.
2. ⛔ **Lead routing** — where website leads go: one inbox, a person, per-service
   routing? → `LEAD_NOTIFY_TO`.
3. ⛔ **Phone + contact channels** — the number that actually rings, text yes/no,
   WhatsApp, what happens after hours.
4. ⛔ **Service list confirmation** — the services we found, confirmed one by one;
   anything missing; anything listed they don't actually do.
5. **Service areas** — cities/parishes actually worked, ranked by preference.
6. ⛔ **Brand assets** — vector logo (SVG/AI/EPS), fonts and their licenses,
   photography and who owns it.
7. **Team roster** — names, titles, headshots, short bios, display order.
8. **Testimonials** — where reviews live (Google, Facebook, texts), favorites, and
   written permission to quote.
9. **Legal/compliance** — license numbers, regulator marks, required disclaimers,
   where privacy/terms text comes from (their counsel, or our draft for review).
10. ⛔ **Domain + DNS access** — registrar, DNS host, who controls each; existing
    email on the domain (SPF/DKIM/DMARC records that must survive cutover).
11. **Analytics to keep** — existing GA4 property, Search Console verification,
    ad pixels.
12. **Old-site URLs that must keep working** — anything with traffic, backlinks, or
    printed on trucks and business cards.
13. **Business profile + socials** — Google Business Profile (exists? who has
    access?), Facebook/Instagram/YouTube, and whether the details on them are right.
14. **Pricing/offers publishable** — what may appear on the site: prices, ranges,
    free estimates, financing, discounts.
15. **Launch constraints** — target dates, blackout days, who signs off.

## Part 2 — Project-specific (Q16+)

<!--
Everything found during capture and audit that only this client can answer:
contradictions between pages, mystery services, "is this Facebook page yours".
Next to each, note which code cites it — then answering the question arrives with
the list of places to update.
-->

16. {{Question}} — cited by: {{file / component}}
17. {{Question}} — cited by: {{...}}
18. {{Question}}
