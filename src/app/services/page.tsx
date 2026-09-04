import type { Metadata } from 'next'

import { CtaBand } from '@/components/site/cta-band'
import { PageHero } from '@/components/site/page-hero'
import { PendingNote } from '@/components/site/pending-note'
import { ServiceCard } from '@/components/site/service-card'
import { Container, Section } from '@/components/ui/layout'
import { services, servicesPending } from '@/content/services'
import { cn } from '@/lib/cn'

export const metadata: Metadata = {
  title: 'Services',
  alternates: { canonical: '/services' },
  description: 'What this business does. The confirmed service list appears here.',
}

export default function ServicesIndex() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Services"
        lede="Each service the business confirms gets its own page: what the work covers, and when you need it."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/services', label: 'Services' },
        ]}
      />

      <Section>
        <Container width="wide">
          {services.length > 0 ? (
            /*
              A service count of 3n+1 in a three-column grid leaves one card
              alone in the last row beside two empty cells — the single most
              common way a well-built page still looks unfinished. The orphan
              runs wide instead: same card component, one variant, and the row
              reads as the end of a list rather than as a gap.
            */
            <ul className="stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => {
                const isLastOrphan = i === services.length - 1 && services.length % 3 === 1

                return (
                  <li
                    key={service.slug}
                    className={cn('reveal', isLastOrphan && 'md:col-span-2 lg:col-span-3')}
                  >
                    <ServiceCard
                      service={service}
                      headingAs="h2"
                      layout={isLastOrphan ? 'wide' : 'stacked'}
                      sizes={
                        isLastOrphan
                          ? '(min-width: 640px) 40vw, 100vw'
                          : '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'
                      }
                    />
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="max-w-2xl">
              <PendingNote title="The service list is being confirmed" pending={servicesPending}>
                <p>
                  Rather than publish a plausible-looking list nobody has confirmed, this page
                  stays empty until the business signs off what it actually offers. Each confirmed
                  service then gets a card here and a page of its own.
                </p>
              </PendingNote>
            </div>
          )}
        </Container>
      </Section>

      <CtaBand
        heading="Not sure what you need?"
        body="Describe the job through the contact page and we will point you the right way."
      />
    </>
  )
}
