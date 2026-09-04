import type { ReactNode } from 'react'

import { Card, Heading } from '@/components/ui/layout'
import type { Pending } from '@/content/maybe'

/**
 * What a page renders instead of content we do not have.
 *
 * Two audiences, one element. The visitor reads `title` and `children`: plain
 * copy saying the section is not published yet, written so it never reads as an
 * error. We read `data-pending-question`, which carries the exact
 * docs/CLIENT-QUESTIONS.md item that fills the gap — so an unfinished page is
 * traceable from the DOM without shouting an internal to-do at a client's
 * customers.
 *
 * The alternative — a plausible-looking placeholder roster, three sample
 * listings, a generic five-star quote — is the one thing this build will not do.
 */
export function PendingNote({
  title,
  pending,
  children,
}: {
  title: string
  pending: Pending
  children: ReactNode
}) {
  return (
    <Card className="bg-surface" data-pending-question={pending.question}>
      <Heading level={4} as="h2">
        {title}
      </Heading>
      <div className="mt-3 max-w-[60ch] space-y-3 text-ink-muted">{children}</div>
    </Card>
  )
}
