import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CtaBand } from '@/components/site/cta-band'
import { JsonLd } from '@/components/site/json-ld'
import { PageHero } from '@/components/site/page-hero'
import { Card, Container, Heading, Section } from '@/components/ui/layout'
import { areas, areaBySlug } from '@/content/areas'
import { featuredServices } from '@/content/services'
import { areaImage } from '@/lib/imagery'
import { breadcrumbSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

/** Zero pages while the area list is empty (Q5); unknown slugs 404. */
export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const area = areaBySlug(slug)
  if (!area) return {}

  return {
    title: `${area.name}`,
    description: `Serving ${area.communities.slice(0, 4).join(', ')} and the rest of ${area.name}.`,
    alternates: { canonical: `/areas/${area.slug}` },
  }
}

export default async function AreaPage({ params }: Params) {
  const { slug } = await params
  const area = areaBySlug(slug)
  if (!area) notFound()
  const trail = [
    { href: '/', label: 'Home' },
    { href: '/areas', label: 'Areas we serve' },
    { href: `/areas/${area.slug}`, label: area.name },
  ]
  const others = areas.filter((a) => a.slug !== area.slug)

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Areas we serve"
        title={area.name}
        lede={area.context}
        image={areaImage(area.slug)}
        trail={trail}
      />

      <Section>
        <Container width="wide">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="reveal lg:col-span-7">
              <Heading level={2} as="h2">
                Communities we work in
              </Heading>
              <ul className="mt-5 flex flex-wrap gap-2">
                {area.communities.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-border bg-surface px-4 py-2 font-semibold text-ink-muted"
                  >
                    {c}
                  </li>
                ))}
              </ul>

              {featuredServices.length > 0 ? (
                <>
                  <Heading level={2} as="h2" className="mt-12">
                    What we do here
                  </Heading>
                  <ul className="mt-5 space-y-3">
                    {featuredServices.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="nudge link-draw inline-flex min-h-11 items-center gap-2 font-semibold"
                        >
                          {s.title}{' '}
                          <span aria-hidden="true" className="nudge-arrow text-accent">
                            &rarr;
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>

            {others.length > 0 ? (
              <aside className="reveal lg:col-span-5">
                <Card className="bg-surface">
                  <Heading level={4} as="h2">
                    Other areas
                  </Heading>
                  <ul className="mt-3 space-y-2">
                    {others.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/areas/${a.slug}`}
                          className="link-draw font-semibold text-ink-muted hover:text-ink"
                        >
                          {a.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </aside>
            ) : null}
          </div>
        </Container>
      </Section>

      <CtaBand heading={`Need work done in ${area.name}?`} />
    </>
  )
}
