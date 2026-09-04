import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CtaBand } from '@/components/site/cta-band'
import { JsonLd } from '@/components/site/json-ld'
import { PageHero } from '@/components/site/page-hero'
import { PhoneLink } from '@/components/site/phone-link'
import { ServiceCard } from '@/components/site/service-card'
import { ButtonLink } from '@/components/ui/button'
import { Card, Container, Eyebrow, Heading, Lede, Section } from '@/components/ui/layout'
import { services, serviceBySlug } from '@/content/services'
import { serviceImage } from '@/lib/imagery'
import { breadcrumbSchema, serviceSchema } from '@/lib/schema'

type Params = { params: Promise<{ slug: string }> }

/**
 * Prerenders one page per confirmed service — which is zero while the list is
 * empty (Q4), so this route contributes nothing to the build until content
 * arrives, and an unknown slug 404s rather than inventing a page.
 */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const service = serviceBySlug(slug)
  if (!service) return {}

  return {
    title: service.title,
    // Each page gets its own description; reusing one line site-wide is the
    // classic old-site defect this replaces.
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  }
}

export default async function ServiceDetail({ params }: Params) {
  const { slug } = await params
  const service = serviceBySlug(slug)
  if (!service) notFound()

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3)
  const trail = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: `/services/${service.slug}`, label: service.title },
  ]

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumbSchema(trail)} />

      {/*
        The service photograph (once paired, Q6) appears here and nowhere else
        on the page — a second copy further down is how a thin page pads
        itself, and it reads exactly that way.
      */}
      <PageHero
        eyebrow="Service"
        title={service.title}
        lede={service.summary}
        image={serviceImage(service.slug)}
        trail={trail}
      />

      <Section>
        <Container width="wide">
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12 lg:items-start">
            <div className="reveal lg:col-span-7">
              <Eyebrow className="rule-brand">What it is</Eyebrow>
              {/*
                The first paragraph is set as a standfirst and the rest as body.
                Two paragraphs at one size read as a stub; the same two with a
                step between them read as an opening and a follow-through.
              */}
              <Lede className="max-w-none text-ink">{service.body[0]}</Lede>
              {service.body.slice(1).map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-5 max-w-[62ch] text-lg leading-[1.7] text-ink-muted"
                >
                  {paragraph}
                </p>
              ))}

              <div className="mt-10 rounded-card border-l-4 border-brand bg-surface p-6 sm:p-7">
                <Heading level={4} as="h2">
                  When you need it
                </Heading>
                <p className="mt-3 text-lg leading-[1.65] text-ink-muted">
                  {service.whenYouNeedIt}
                </p>
              </div>
            </div>

            <aside className="reveal lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <Card className="bg-surface">
                <Heading level={4} as="h2">
                  Talk it through
                </Heading>
                <p className="mt-3 text-ink-muted">
                  Describe what you need. If this is not the right service, we will point you at
                  the one that is.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <ButtonLink href="/contact" block className="sweep press">
                    Get in touch
                  </ButtonLink>
                  <PhoneLink
                    location="service-aside"
                    className="press flex min-h-11 w-full items-center justify-center rounded-card border-2 border-ink px-4 font-bold transition-colors duration-200 hover:bg-ink hover:text-bg"
                  />
                </div>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>

      {service.covers.length > 0 ? (
        <Section tone="surface">
          <Container width="wide">
            <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
              <div className="reveal lg:col-span-4">
                <Eyebrow className="rule-brand">What this covers</Eyebrow>
                <Heading level={2} as="h2">
                  The work, itemised
                </Heading>
              </div>

              <ul className="stagger lg:col-span-8">
                {service.covers.map((item, i) => (
                  <li
                    key={item}
                    className="reveal flex gap-5 border-b border-border py-5 first:border-t"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1 font-display text-sm font-black tabular-nums text-accent"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-lg leading-[1.55] text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section>
          <Container width="wide">
            <div className="reveal flex flex-wrap items-end justify-between gap-4">
              <Heading level={2} as="h2">
                Related services
              </Heading>
              <Link
                href="/services"
                className="nudge link-draw inline-flex min-h-11 items-center gap-2 font-bold text-accent"
              >
                All services{' '}
                <span aria-hidden="true" className="nudge-arrow">
                  &rarr;
                </span>
              </Link>
            </div>

            <ul className="stagger mt-8 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug} className="reveal">
                  <ServiceCard service={r} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <CtaBand />
    </>
  )
}
