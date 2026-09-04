import type { Metadata } from 'next'

import { PageHero } from '@/components/site/page-hero'
import { PendingNote } from '@/components/site/pending-note'
import { Container, Section } from '@/components/ui/layout'
import { pending } from '@/content/maybe'

export const metadata: Metadata = {
  title: 'Accessibility',
  alternates: { canonical: '/accessibility' },
  description: 'Accessibility statement.',
  // noindex until the statement is real — see /privacy for the reasoning.
  // Flip this (and add the page to sitemap.ts) when Q9 lands real content.
  robots: { index: false, follow: true },
}

const accessibilityPending = pending(
  'Q9: Accessibility statement — the commitment the business will actually stand behind, and its feedback contact',
)

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Accessibility"
        trail={[
          { href: '/', label: 'Home' },
          { href: '/accessibility', label: 'Accessibility' },
        ]}
      />
      <Section>
        <Container>
          <div className="max-w-2xl">
            <PendingNote title="The statement is being prepared" pending={accessibilityPending}>
              <p>
                This site is built to WCAG 2.1 AA practices — contrast-tested colour tokens, visible
                focus everywhere, content that never depends on JavaScript to be read. A formal
                statement is still a commitment the business makes in its own name, with a contact
                for problems, so the published wording waits for the client.
              </p>
            </PendingNote>
          </div>
        </Container>
      </Section>
    </>
  )
}
