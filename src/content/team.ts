import { type Maybe, pending, type Pending } from './maybe'

export type TeamMember = {
  slug: string
  /** As the business publishes it — which may be first name and initial only. */
  displayName: string
  fullName: Maybe<string>
  role: string
  /** Short, verifiable credentials pulled from published material. */
  credentials: string[]
  bio: string[]
  headshot: Maybe<string>
}

/**
 * Deliberately empty, and the rule here is absolute: no invented people, no
 * generated faces, no stock portrait standing in for a named professional.
 * A fabricated person is not a placeholder. The roster fills in only from the
 * client's own answer, and headshots only from photographs they own.
 */
export const team: TeamMember[] = []

export const teamPending: Pending = pending(
  'Q7: Team roster — who is named on the site, their roles, credentials, and headshots the client owns',
)

export function teamMemberBySlug(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug)
}
