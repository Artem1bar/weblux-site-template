# Launch — {{DOMAIN}}

Go-live and DNS cutover. Every line gets an OWNER and a DATE **before** cutover is
scheduled — this file exists because the cutover step has died of unowned-ness twice.
Full narrative: stage 8 in `~/weblux/docs/onboarding/06-delivery-handover-review.md`.

**Client:** {{...}} · **Domain:** {{...}} · **DNS host:** {{...}}
**Cutover:** {{a Tuesday or Wednesday morning — never Friday, never before a holiday,
never on a day the client's operator is out}}
**Rollback decision point:** {{time}} — not green by then, revert and reschedule.

<!--
Owner means one named human, not "us". Done means a date, not a checkmark. Delete
rows that don't apply rather than leaving them blank — a checklist with permanent
blanks stops being read.
-->

## T-minus 24h or more

| # | Item | Owner | Date | Done |
|---|---|---|---|---|
| 1 | DNS TTLs lowered on every record we will touch | {{}} | {{}} | |
| 2 | Rollback recorded before touching anything: current records exported verbatim, restore steps written, decision point named above | {{}} | {{}} | |
| 3 | Existing special records inventoried and preserved in the new zone plan — MX, SPF, DKIM, DMARC, service CNAMEs (e.g. a `search.` subdomain), verification TXTs | {{}} | {{}} | |
| 4 | Redirect map live on the new site + e2e walk of old URLs green | {{}} | {{}} | |
| 5 | `npm run check:launch` green — env trio set, a real notifier selected | {{}} | {{}} | |
| 6 | A submitted lead reaches a human — verified end-to-end, not inferred from config | {{}} | {{}} | |
| 7 | Analytics events firing on the preview domain | {{}} | {{}} | |
| 8 | Client sign-off in writing (Q15) | {{}} | {{}} | |

## Cutover day

| # | Item | Owner | Date | Done |
|---|---|---|---|---|
| 9 | Records changed — the cutover batched with nothing else, someone watching the first hour | {{}} | {{}} | |
| 10 | SSL verified on the live host | {{}} | {{}} | |
| 11 | Email re-verified AFTER cutover — send and receive on the client's domain; SPF/DKIM/DMARC still pass | {{}} | {{}} | |
| 12 | Every critical path walked manually on the live domain | {{}} | {{}} | |
| 13 | A live-domain lead submitted and received | {{}} | {{}} | |

## First 48h

| # | Item | Owner | Date | Done |
|---|---|---|---|---|
| 14 | Search Console verified + sitemap submitted | {{}} | {{}} | |
| 15 | Monitoring watched — errors, form deliveries, redirect 404s | {{}} | {{}} | |
| 16 | Confirmation to the client: it is live, and what to watch for | {{}} | {{}} | |
