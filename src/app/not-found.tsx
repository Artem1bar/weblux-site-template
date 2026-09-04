import Link from 'next/link'

import { BrandMark } from '@/components/brand/brand-mark'
import { ButtonLink } from '@/components/ui/button'
import { Container, Heading, Section } from '@/components/ui/layout'

/**
 * Branded-neutral: the mark, a plain statement, and two useful exits. No
 * jokes and no blame — a 404 on a small-business site is usually a stale link
 * from somewhere else, and the visitor still wants what they came for.
 */
export default function NotFound() {
  return (
    <Section space="lg">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <BrandMark className="mx-auto h-14 w-14 text-ink-muted" />
          <Heading as="h1" level={1} className="mt-6">
            That page is not here
          </Heading>
          <p className="mt-4 text-lg text-ink-muted">
            The address may be out of date, or the page may have moved. The homepage has everything
            this site currently offers.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/">Go to the homepage</ButtonLink>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center font-bold text-accent hover:underline"
            >
              Or get in touch
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  )
}
