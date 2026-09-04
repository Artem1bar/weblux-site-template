import Link from 'next/link'

import { Container } from '@/components/ui/layout'
import { isKnown, isPending, valueOr } from '@/content/maybe'
import { CURRENT_YEAR, NAME_PLACEHOLDER, site } from '@/content/site'

import { footerColumns } from './nav-config'

/**
 * Every fact slot in this footer narrows a Maybe. Contact, office and hours
 * render only once known; the copyright line names the placeholder until Q1 is
 * answered. Nothing here writes a promise on the client's behalf — an
 * unanswered question is not a licence to write the answer.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container width="wide" className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p
              className="text-lg font-bold"
              data-pending-question={isPending(site.name) ? site.name.question : undefined}
            >
              {valueOr(site.name, NAME_PLACEHOLDER)}
            </p>
            {isKnown(site.tagline) ? (
              <p className="mt-4 text-ink-muted italic">&ldquo;{site.tagline.value}&rdquo;</p>
            ) : null}
          </div>

          {footerColumns
            .filter((col) => col.links.length > 0)
            .map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="font-bold">{col.title}</h2>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-ink-muted hover:text-ink hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
        </div>

        {isKnown(site.phone) || isKnown(site.email) || isKnown(site.address) || isKnown(site.hours) ? (
          <div className="mt-12 grid gap-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {isKnown(site.phone) || isKnown(site.email) ? (
              <div>
                <h2 className="font-bold">Contact</h2>
                <ul className="mt-3 space-y-2 text-ink-muted">
                  {isKnown(site.phone) ? (
                    <li>
                      <a
                        href={`tel:${site.phone.value.raw}`}
                        className="font-semibold text-accent hover:underline"
                      >
                        {site.phone.value.display}
                      </a>
                    </li>
                  ) : null}
                  {isKnown(site.email) ? (
                    <li>
                      <a
                        href={`mailto:${site.email.value}`}
                        className="hover:text-ink hover:underline"
                      >
                        {site.email.value}
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            ) : null}

            {isKnown(site.address) ? (
              <div>
                <h2 className="font-bold">Office</h2>
                <address className="mt-3 not-italic text-ink-muted">
                  {site.address.value.street}
                  <br />
                  {site.address.value.city}, {site.address.value.region}{' '}
                  {site.address.value.postalCode}
                </address>
              </div>
            ) : null}

            {isKnown(site.hours) ? (
              <div>
                <h2 className="font-bold">Hours</h2>
                <p className="mt-3 text-ink-muted">{site.hours.value}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {CURRENT_YEAR} {valueOr(site.name, NAME_PLACEHOLDER)}. All rights reserved.
          </p>
          {/* Licence lines only once confirmed (Q9) — a regulated credential is
              not something to paraphrase. */}
          {isKnown(site.licenseNumber) ? <p>Licence {site.licenseNumber.value}</p> : null}
        </div>
      </Container>
    </footer>
  )
}
