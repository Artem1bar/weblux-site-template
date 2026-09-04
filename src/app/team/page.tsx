import type { Metadata } from 'next'

import { CtaBand } from '@/components/site/cta-band'
import { PageHero } from '@/components/site/page-hero'
import { PendingNote } from '@/components/site/pending-note'
import { TeamCard } from '@/components/site/team-card'
import { Container, Section } from '@/components/ui/layout'
import { team, teamPending } from '@/content/team'

export const metadata: Metadata = {
  title: 'Team',
  alternates: { canonical: '/team' },
  description: 'The people who do the work. The confirmed roster appears here.',
}

export default function TeamIndex() {
  return (
    <>
      <PageHero
        eyebrow="Who does the work"
        title="The team"
        lede="Real people with credentials the business actually publishes — nothing here is invented to fill a grid."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/team', label: 'Team' },
        ]}
      />

      <Section>
        <Container width="wide">
          {team.length > 0 ? (
            <ul className="stagger grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <li key={member.slug} className="reveal">
                  <TeamCard member={member} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="max-w-2xl">
              <PendingNote title="The roster is being confirmed" pending={teamPending}>
                <p>
                  No generated faces, no stock portraits standing in for named professionals. The
                  people listed here will be real, with photographs the business owns, or the page
                  stays honestly empty.
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
