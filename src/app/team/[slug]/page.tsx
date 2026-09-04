import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CtaBand } from '@/components/site/cta-band'
import { JsonLd } from '@/components/site/json-ld'
import { PageHero } from '@/components/site/page-hero'
import { PhoneLink } from '@/components/site/phone-link'
import { TeamCard } from '@/components/site/team-card'
import { ButtonLink } from '@/components/ui/button'
import { Card, Container, Heading, Prose, Section } from '@/components/ui/layout'
import { team, teamMemberBySlug } from '@/content/team'
import { breadcrumbSchema, personSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

/** Zero pages while the roster is empty (Q7); unknown slugs 404. */
export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const member = teamMemberBySlug(slug)
  if (!member) return {}

  return {
    title: `${member.displayName}, ${member.role}`,
    description: `${member.displayName} — ${member.role}. ${member.credentials.slice(0, 3).join('. ')}.`,
    alternates: { canonical: `/team/${member.slug}` },
  }
}

export default async function TeamMemberPage({ params }: Params) {
  const { slug } = await params
  const member = teamMemberBySlug(slug)
  if (!member) notFound()

  const trail = [
    { href: '/', label: 'Home' },
    { href: '/team', label: 'Team' },
    { href: `/team/${member.slug}`, label: member.displayName },
  ]
  const others = team.filter((m) => m.slug !== member.slug)

  return (
    <>
      <JsonLd data={personSchema(member)} />
      <JsonLd data={breadcrumbSchema(trail)} />

      {/*
        displayName only — publish what the business publishes, and never guess
        at a real person's name. No portrait either, unless the client supplies
        one they own (Q7): a generated face standing in for a named
        professional is a fabricated person, not a placeholder.
      */}
      <PageHero eyebrow={member.role} title={member.displayName} trail={trail} />

      <Section>
        <Container width="wide">
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12 lg:items-start">
            <Prose className="lg:col-span-7">
              {member.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </Prose>

            <aside className="space-y-5 lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              {member.credentials.length > 0 ? (
                <Card className="bg-surface">
                  <Heading level={4} as="h2">
                    Background
                  </Heading>
                  <ul className="mt-4 divide-y divide-border">
                    {member.credentials.map((c) => (
                      <li key={c} className="py-2.5 text-ink-muted first:pt-0 last:pb-0">
                        {c}
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}

              <Card className="bg-surface">
                <Heading level={4} as="h2">
                  Ask for {member.displayName.split(' ')[0]}
                </Heading>
                <p className="mt-3 text-ink-muted">
                  Describe what you need and it will land with whoever on the team knows that kind
                  of work best.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <ButtonLink href="/contact" block className="sweep press">
                    Get in touch
                  </ButtonLink>
                  <PhoneLink
                    location="team-aside"
                    className="press flex min-h-11 w-full items-center justify-center rounded-card border-2 border-ink px-4 font-bold transition-colors duration-200 hover:bg-ink hover:text-bg"
                  />
                </div>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>

      {others.length > 0 ? (
        <Section tone="surface">
          <Container width="wide">
            <Heading level={2} as="h2">
              The rest of the team
            </Heading>
            <ul className="stagger mt-8 grid gap-6 md:grid-cols-2">
              {others.map((m) => (
                <li key={m.slug} className="reveal">
                  <TeamCard member={m} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <CtaBand />
    </>
  )
}
