import type { Metadata } from 'next'
import Link from 'next/link'

import { CtaBand } from '@/components/site/cta-band'
import { PageHero } from '@/components/site/page-hero'
import { PendingNote } from '@/components/site/pending-note'
import { Card, Container, Heading, Section } from '@/components/ui/layout'
import { areas, areasPending } from '@/content/areas'
import { cn } from '@/lib/cn'

export const metadata: Metadata = {
  title: 'Areas we serve',
  alternates: { canonical: '/areas' },
  description: 'Where this business works. The confirmed service areas appear here.',
}

/**
 * How many cards are stranded in the final row of a three-across grid, and how
 * wide each of them has to be to fill it. Six-column track, so a third is 2 and
 * a half is 3.
 */
const leftover = areas.length % 3
const tailStart = leftover === 0 ? areas.length : areas.length - leftover
const tailSpan = leftover === 1 ? 'lg:col-span-6' : leftover === 2 ? 'lg:col-span-3' : ''

export default function AreasIndex() {
  return (
    <>
      <PageHero
        eyebrow="Where we work"
        title="Areas we serve"
        lede="Each confirmed area gets a page about what the work looks like there — real places the business actually goes."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/areas', label: 'Areas we serve' },
        ]}
      />

      <Section>
        <Container width="wide">
          {areas.length > 0 ? (
            /*
              Area counts rarely divide by three. The track is six columns
              rather than three, so a card can span two (the normal third),
              three (a half) or all six; `tailSpan` widens whatever is left
              over at the end to fill the row exactly, and keeps working as
              the client adds or drops an area.
            */
            <ul className="stagger grid gap-6 md:grid-cols-2 lg:grid-cols-6">
              {areas.map((area, i) => (
                <li
                  key={area.slug}
                  className={cn('reveal lg:col-span-2', i >= tailStart && tailSpan)}
                >
                  <Link href={`/areas/${area.slug}`} className="nudge block h-full">
                    <Card className="lift flex h-full flex-col">
                      <Heading level={3} as="h2">
                        {area.name}
                      </Heading>
                      <p className="mt-3 flex-1 text-ink-muted">{area.context}</p>
                      <p className="mt-4 text-sm text-ink-muted">{area.communities.join(' · ')}</p>
                      <span className="mt-5 inline-flex items-center gap-2 font-bold text-accent">
                        Work in {area.name}{' '}
                        <span aria-hidden="true" className="nudge-arrow">
                          &rarr;
                        </span>
                      </span>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="max-w-2xl">
              <PendingNote title="Service areas are being confirmed" pending={areasPending}>
                <p>
                  A landing page for somewhere the business does not actually go is worse than no
                  page. The area list waits for the client&rsquo;s confirmation, then each area gets
                  a page of its own.
                </p>
              </PendingNote>
            </div>
          )}
        </Container>
      </Section>

      <CtaBand />
    </>
  )
}
