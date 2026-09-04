import type { Metadata } from 'next'

import { CtaBand } from '@/components/site/cta-band'
import { PageHero } from '@/components/site/page-hero'
import { PendingNote } from '@/components/site/pending-note'
import { Card, Container, Section } from '@/components/ui/layout'
import { isKnown } from '@/content/maybe'
import { testimonials, testimonialsPending } from '@/content/testimonials'

export const metadata: Metadata = {
  title: 'Reviews',
  alternates: { canonical: '/reviews' },
  description: 'What clients say about working with this business, quoted as written.',
}

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Client reviews"
        title="What clients say"
        lede="Quoted as written, republished with permission, and never padded out with details the source does not give."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/reviews', label: 'Reviews' },
        ]}
      />

      <Section>
        <Container width="wide">
          {testimonials.length > 0 ? (
            <ul className="stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.id} className="reveal">
                  <Card className="lift flex h-full flex-col">
                    <span
                      aria-hidden="true"
                      className="font-display text-5xl leading-none text-brand"
                    >
                      &ldquo;
                    </span>
                    <blockquote className="mt-2 flex-1 text-ink">
                      <p>{t.quote}</p>
                    </blockquote>
                    <footer className="mt-5 border-t border-border pt-4">
                      <p className="font-bold">{t.attribution}</p>
                      {/*
                        Role, date and work type render only where the source
                        actually states them. An invented "Homeowner, 2023" is
                        fabricated social proof, and it stays absent instead.
                      */}
                      {isKnown(t.role) ? <p className="text-ink-muted">{t.role.value}</p> : null}
                      {isKnown(t.workType) ? (
                        <p className="mt-1 text-sm text-ink-muted">{t.workType.value}</p>
                      ) : null}
                    </footer>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <div className="max-w-2xl">
              <PendingNote
                title="Reviews are the part of this we cannot write"
                pending={testimonialsPending}
              >
                <p>
                  Everything that will appear here has to come from a real client, quoted verbatim,
                  with permission to republish. Until the business supplies its reviews and their
                  source, the page stays honestly empty.
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
