import Link from 'next/link'

import { BrandMark } from '@/components/brand/brand-mark'
import { Card, Heading } from '@/components/ui/layout'
import type { TeamMember } from '@/content/team'

/**
 * One team member, shared everywhere a person is carded so copies cannot
 * drift on bullet style, link text or heading level.
 *
 * The mark holds the portrait space until the client supplies real
 * photographs (Q7). That is not an oversight: a generated face standing in
 * for a named professional is a fabricated person, not a placeholder. The
 * credentials do the work a face would have done.
 */
export function TeamCard({ member }: { member: TeamMember }) {
  const firstName = member.displayName.split(' ')[0]

  return (
    <Card className="lift flex h-full flex-col">
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand text-on-brand">
          <BrandMark className="h-8 w-8" />
        </span>
        <div className="min-w-0">
          <Heading level={4} as="h3">
            {member.displayName}
          </Heading>
          <p className="mt-1 font-semibold text-ink-muted">{member.role}</p>
        </div>
      </div>

      <ul className="mt-5 flex-1 space-y-2">
        {member.credentials.map((credential) => (
          <li key={credential} className="flex gap-2.5 text-ink-muted">
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {credential}
          </li>
        ))}
      </ul>

      <Link
        href={`/team/${member.slug}`}
        className="nudge mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-accent"
      >
        Read {firstName}&rsquo;s background{' '}
        <span aria-hidden="true" className="nudge-arrow">
          &rarr;
        </span>
      </Link>
    </Card>
  )
}
