import { type Maybe, pending, type Pending } from './maybe'

export type Testimonial = {
  id: string
  /** Exactly as the reviewer wrote it. We do not edit quotes. */
  quote: string
  /** Exactly as published. We do not expand attributions. */
  attribution: string
  role: Maybe<string>
  date: Maybe<string>
  /** What kind of work the review is about, where the source states it. */
  workType: Maybe<string>
}

/**
 * Deliberately empty. Fabricated social proof is the classic small-site sin —
 * a generic five-star quote from "Sarah M." harms a real business the moment
 * anyone checks. Reviews enter this file only quoted verbatim from a source the
 * client controls, with their permission to republish, and any detail the
 * source does not give (dates, full names, work type) stays pending rather
 * than being filled in.
 */
export const testimonials: Testimonial[] = []

export const testimonialsPending: Pending = pending(
  'Q8: Testimonials — the source (Google, etc.), verbatim quotes, and permission to republish them',
)
