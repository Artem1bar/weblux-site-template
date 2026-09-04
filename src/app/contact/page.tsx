import type { Metadata } from 'next'

import { JsonLd } from '@/components/site/json-ld'
import { LeadForm } from '@/components/site/lead-form'
import { PageHero } from '@/components/site/page-hero'
import { PendingNote } from '@/components/site/pending-note'
import { Card, Container, Heading, Section } from '@/components/ui/layout'
import { isKnown, pending } from '@/content/maybe'
import { site } from '@/content/site'
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Send us the details and we will get back to you.',
  alternates: { canonical: '/contact' },
}

const trail = [
  { href: '/', label: 'Home' },
  { href: '/contact', label: 'Contact' },
]

const channelsPending = pending(
  'Q3: Contact channels — phone, email, address and hours to publish on the contact page',
)

export default function ContactPage() {
  const business = localBusinessSchema()
  const hasChannels =
    isKnown(site.phone) || isKnown(site.email) || isKnown(site.address) || isKnown(site.hours)

  return (
    <>
      {business ? <JsonLd data={business} /> : null}
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        lede="Tell us what you need. The form works today; the direct channels appear as the business confirms them."
        trail={trail}
      />

      <Section>
        {/*
          A 7/5 split rather than two fixed columns: proportional columns meet
          in the middle with one gutter, instead of hugging their own edges
          with a corridor of nothing between them. The inputs stay capped at
          34rem inside the left column — a text field the full width of a
          1200px page is uncomfortable to read back, whatever the grid says.
        */}
        <Container>
          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Heading level={3} as="h2">
                Send us the details
              </Heading>
              <LeadForm className="mt-6 max-w-[34rem]" />
            </div>

            <aside className="space-y-5 lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              {isKnown(site.phone) ? (
                <Card className="bg-surface">
                  <Heading level={4} as="h2">
                    Call directly
                  </Heading>
                  <a
                    href={`tel:${site.phone.value.raw}`}
                    className="mt-3 inline-flex min-h-11 items-center text-2xl font-bold text-accent hover:underline"
                  >
                    {site.phone.value.display}
                  </a>
                  {isKnown(site.hours) ? (
                    <p className="mt-2 text-ink-muted">{site.hours.value}</p>
                  ) : null}
                </Card>
              ) : null}

              {isKnown(site.email) ? (
                <Card className="bg-surface">
                  <Heading level={4} as="h2">
                    Email
                  </Heading>
                  <a
                    href={`mailto:${site.email.value}`}
                    className="mt-3 inline-flex min-h-11 items-center break-all font-semibold text-accent hover:underline"
                  >
                    {site.email.value}
                  </a>
                </Card>
              ) : null}

              {isKnown(site.address) ? (
                <Card className="bg-surface">
                  <Heading level={4} as="h2">
                    Office
                  </Heading>
                  <address className="mt-3 not-italic text-ink-muted">
                    {site.address.value.street}
                    <br />
                    {site.address.value.city}, {site.address.value.region}{' '}
                    {site.address.value.postalCode}
                  </address>
                </Card>
              ) : null}

              {!hasChannels ? (
                <PendingNote title="Direct channels on the way" pending={channelsPending}>
                  <p>
                    Phone, email and address appear here once the business confirms which ones to
                    publish. The form above reaches us in the meantime.
                  </p>
                </PendingNote>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}
