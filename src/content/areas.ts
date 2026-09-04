import { pending, type Pending } from './maybe'

export type Area = {
  slug: string
  name: string
  /** Communities within the area, used in the landing page copy. */
  communities: string[]
  /** Why this area is worth a page — what actually brings customers here. */
  context: string
}

/**
 * Local landing pages. Empty until the client confirms where they actually
 * work: a service-area page for somewhere the business does not go is worse
 * than no page, and the selection is a marketing decision the client owns.
 */
export const areas: Area[] = []

export const areasPending: Pending = pending(
  'Q5: Service areas — which towns/regions get a landing page, and what is true about the work there',
)

export function areaBySlug(slug: string): Area | undefined {
  return areas.find((a) => a.slug === slug)
}
