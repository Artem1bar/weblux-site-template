import { pending, type Pending } from './maybe'

export type Service = {
  slug: string
  title: string
  /** One sentence for cards and meta descriptions. */
  summary: string
  /** Paragraphs for the detail page. */
  body: string[]
  /** What the work actually consists of, itemised. Lifted from the client's own description, never invented to fill a column. */
  covers: string[]
  /** The situation a visitor is in when this is the right service. */
  whenYouNeedIt: string
  /** What the visitor gets by clicking. Never "Explore More". */
  cta: string
  /** Surfaced in the homepage services grid, in this order. */
  featured: boolean
}

/**
 * Deliberately empty.
 *
 * A plausible-looking list of services is the single most tempting thing to
 * invent, and the most dangerous: it puts words in a business's mouth about
 * what it sells. The list ships empty, /services renders an honest pending
 * state, and entries are added only from the client's confirmed answers.
 */
export const services: Service[] = []

/** The question the empty state renders, so the gap stays traceable. */
export const servicesPending: Pending = pending(
  'Q4: The confirmed service list — names, one-line summaries, and what each covers',
)

export function serviceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export const featuredServices = services.filter((s) => s.featured)
