import type { Metadata } from 'next'

import { JsonLd } from '@/components/site/json-ld'
import { CtaBand } from '@/components/site/cta-band'
import { PageHero } from '@/components/site/page-hero'
import { PendingNote } from '@/components/site/pending-note'
import { TeamCard } from '@/components/site/team-card'
import { Container, Eyebrow, Heading, Section } from '@/components/ui/layout'
import { pending } from '@/content/maybe'
import { team, teamPending } from '@/content/team'
import { breadcrumbSchema, localBusinessSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'About',
  description: 'Who is behind the business. Content appears here once the business confirms it.',
  alternates: { canonical: '/about' },
}

const trail = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
]

/**
 * The story slot. On a client build this page carries the record — history,
 * values in the client's own published words, the team. All of that is Q1/Q7
 * material, so the template renders the structure with honest pending notes.
 */
const storyPending = pending(
  'Q1: The business story — founding year, history, and the values it publishes in its own words',
)

export default function AboutPage() {
  const business = localBusinessSchema()

  return (
    <>
      {business ? <JsonLd data={business} /> : null}
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="About us"
        title="About this business"
        lede="The record behind the promise on the homepage — written from confirmed facts only."
        trail={trail}
      />

      <Section>
        <Container width="wide">
          <div className="reveal max-w-2xl">
            <PendingNote title="The story is being written" pending={storyPending}>
              <p>
                This page will carry the business&rsquo;s own history and values — founding year,
                the record since, and the words it already uses about itself. None of that gets
                paraphrased or invented, so the section waits for the client&rsquo;s answers.
              </p>
            </PendingNote>
          </div>
        </Container>
      </Section>

      <Section tone="surface" space="lg">
        <Container width="wide">
          <div className="reveal max-w-2xl">
            <Eyebrow className="rule-brand">The team</Eyebrow>
            <Heading level={1} as="h2">
              Who actually does the work
            </Heading>
          </div>

          {team.length > 0 ? (
            <ul className="stagger mt-12 grid gap-6 md:grid-cols-3">
              {team.map((member) => (
                <li key={member.slug} className="reveal">
                  <TeamCard member={member} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 max-w-2xl">
              <PendingNote title="The roster is being confirmed" pending={teamPending}>
                <p>
                  Real people, real credentials, photographs the business owns. Nothing stands in
                  for them here in the meantime.
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
