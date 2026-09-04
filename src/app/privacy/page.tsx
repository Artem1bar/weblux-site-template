import type { Metadata } from 'next'

import { PageHero } from '@/components/site/page-hero'
import { PendingNote } from '@/components/site/pending-note'
import { Container, Section } from '@/components/ui/layout'
import { pending } from '@/content/maybe'

export const metadata: Metadata = {
  title: 'Privacy',
  alternates: { canonical: '/privacy' },
  description: 'Privacy policy.',
  // noindex until the real policy exists — indexing a placeholder legal page
  // is worse than indexing nothing. Flip this (and add the page to sitemap.ts)
  // when Q9 lands real content.
  robots: { index: false, follow: true },
}

const privacyPending = pending(
  'Q9: Privacy policy — the source of the real text (lawyer, generator the client accepts, or an existing policy)',
)

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        trail={[
          { href: '/', label: 'Home' },
          { href: '/privacy', label: 'Privacy' },
        ]}
      />
      <Section>
        <Container>
          <div className="max-w-2xl">
            <PendingNote title="The policy is being prepared" pending={privacyPending}>
              <p>
                A privacy policy is a legal document, and a templated one presented as this
                business&rsquo;s own would be a claim nobody has reviewed. The real text goes here
                once its source is confirmed; until then this page stays out of search indexes.
              </p>
              <p>
                What can be said now: the contact form sends what you type to the business so it can
                reply, and nothing else on this site asks you for personal information.
              </p>
            </PendingNote>
          </div>
        </Container>
      </Section>
    </>
  )
}
