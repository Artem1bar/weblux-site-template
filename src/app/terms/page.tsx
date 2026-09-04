import type { Metadata } from 'next'

import { PageHero } from '@/components/site/page-hero'
import { PendingNote } from '@/components/site/pending-note'
import { Container, Section } from '@/components/ui/layout'
import { pending } from '@/content/maybe'

export const metadata: Metadata = {
  title: 'Terms',
  alternates: { canonical: '/terms' },
  description: 'Terms of use.',
  // noindex until the real terms exist — see /privacy for the reasoning.
  // Flip this (and add the page to sitemap.ts) when Q9 lands real content.
  robots: { index: false, follow: true },
}

const termsPending = pending(
  'Q9: Terms of use — the source of the real text, and any trade-specific disclaimers that belong in it',
)

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of use"
        trail={[
          { href: '/', label: 'Home' },
          { href: '/terms', label: 'Terms' },
        ]}
      />
      <Section>
        <Container>
          <div className="max-w-2xl">
            <PendingNote title="The terms are being prepared" pending={termsPending}>
              <p>
                Terms bind the business that publishes them, so they are not text to template.
                Trade-specific disclaimers — licensing statements, service limitations, anything a
                regulator expects — belong here too, and every one of them is the client&rsquo;s
                call. The page stays out of search indexes until the real text lands.
              </p>
            </PendingNote>
          </div>
        </Container>
      </Section>
    </>
  )
}
