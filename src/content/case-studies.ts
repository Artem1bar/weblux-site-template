import type { Maybe } from './maybe'
import { pending, type Pending } from './maybe'

export type CaseStudy = {
  slug: string
  workType: string
  /** Numbers only where the client supplies them; never derived, never rounded up. */
  outcome: Maybe<string>
  timeline: Maybe<string>
  summary: string
}

/**
 * Deliberately empty.
 *
 * Case studies are the highest-credibility content a client site can carry,
 * and the one place where inventing an outcome does real damage — these are
 * results claimed on a real business's behalf. The array ships empty and no
 * template page consumes it yet; wire a /results (or similar) page up only
 * once the client supplies real, publishable outcomes.
 */
export const caseStudies: CaseStudy[] = []

export const caseStudiesPending: Pending = pending(
  'Q14: Case studies / results — real outcomes the client can publish, with any numbers they will stand behind',
)
