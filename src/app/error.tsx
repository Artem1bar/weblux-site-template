'use client'

import { useEffect } from 'react'

import { BrandMark } from '@/components/brand/brand-mark'
import { Button } from '@/components/ui/button'
import { Container, Heading, Section } from '@/components/ui/layout'

/**
 * Branded-neutral error boundary. It says something went wrong, offers a
 * retry, and admits nothing it cannot know — no "we've been notified" unless
 * error reporting is actually wired up on the client build.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Server logs carry the detail; the visitor gets the honest summary.
    console.error(error)
  }, [error])

  return (
    <Section space="lg">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <BrandMark className="mx-auto h-14 w-14 text-ink-muted" />
          <Heading as="h1" level={1} className="mt-6">
            Something went wrong
          </Heading>
          <p className="mt-4 text-lg text-ink-muted">
            The page hit an error it could not recover from. Trying again usually works.
          </p>
          <div className="mt-8">
            <Button onClick={reset}>Try again</Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
