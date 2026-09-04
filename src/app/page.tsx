import { JsonLd } from '@/components/site/json-ld'
import { PendingNote } from '@/components/site/pending-note'
import { CtaBand } from '@/components/site/cta-band'
import { ServiceCard } from '@/components/site/service-card'
import { TeamCard } from '@/components/site/team-card'
import { Container, Eyebrow, Heading, Lede, Section } from '@/components/ui/layout'
import { faqs } from '@/content/faq'
import { isPending } from '@/content/maybe'
import { featuredServices, servicesPending } from '@/content/services'
import { site } from '@/content/site'
import { team, teamPending } from '@/content/team'
import { testimonials, testimonialsPending } from '@/content/testimonials'
import { faqSchema, localBusinessSchema } from '@/lib/schema'

/**
 * The homepage, in its all-pending state.
 *
 * Structure is real — hero, services, people, reviews, FAQ, close — and every
 * fact slot is either hidden or a PendingNote, so the page demonstrates the
 * template's one discipline instead of demonstrating lorem ipsum. The hero
 * copy below is wireframe copy on purpose: it describes what belongs in the
 * slot, so it can never be mistaken for a claim about a real business, and
 * forgetting to replace it is embarrassing rather than dangerous.
 */
export default function HomePage() {
  const business = localBusinessSchema()
  const faq = faqSchema()

  return (
    <>
      {business ? <JsonLd data={business} /> : null}
      {faq ? <JsonLd data={faq} /> : null}

      {/*
        ── Hero ──────────────────────────────────────────────────────────────
        On a client build: the single strongest sentence the business has, over
        client photography (Q6), with the phone beside the primary action. The
        placeholder names the job of each line rather than faking a business.
      */}
      <section className="on-photo relative isolate overflow-hidden bg-[#10151a]">
        <Container width="wide">
          <div className="flex min-h-[clamp(26rem,64svh,38rem)] items-end pb-14 pt-24 sm:pb-20 sm:pt-32">
            <div
              className="max-w-2xl"
              data-pending-question={isPending(site.tagline) ? site.tagline.question : undefined}
            >
              <Eyebrow className="text-on-photo-muted">What the business is, in five words</Eyebrow>

              <Heading as="h1" level="display" className="text-on-photo">
                The one promise this business makes goes here.
              </Heading>

              <Lede className="mt-6 max-w-xl text-on-photo-muted">
                A sentence of support for the promise — who it is for, and why this business can
                keep it. Confirmed wording only; see the pending notes below for what is still open.
              </Lede>
            </div>
          </div>
        </Container>
      </section>

      {/*
        ── Services ──────────────────────────────────────────────────────────
        Renders the confirmed list once Q4 is answered; an honest pending note
        until then. The section heading is structural and stays either way.
      */}
      <Section space="lg">
        <Container width="wide">
          <div className="reveal max-w-2xl">
            <Eyebrow className="rule-brand">What we do</Eyebrow>
            <Heading level={1} as="h2" className="text-rise">
              Services
            </Heading>
          </div>

          {featuredServices.length > 0 ? (
            <ul className="stagger mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <li key={service.slug} className="reveal">
                  <ServiceCard service={service} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 max-w-2xl">
              <PendingNote title="The service list is being confirmed" pending={servicesPending}>
                <p>
                  Rather than guess at what this business offers, this section stays empty until the
                  list is confirmed. Every service then gets its own page describing what the work
                  covers and when you need it.
                </p>
              </PendingNote>
            </div>
          )}
        </Container>
      </Section>

      {/*
        ── The people ────────────────────────────────────────────────────────
        No invented people, no generated faces — the roster renders once Q7 is
        answered, and the pending note says so out loud.
      */}
      <Section tone="surface" space="lg">
        <Container width="wide">
          <div className="reveal max-w-2xl">
            <Eyebrow className="rule-brand">Who does the work</Eyebrow>
            <Heading level={1} as="h2" className="text-rise">
              The team
            </Heading>
          </div>

          {team.length > 0 ? (
            <ul className="stagger mt-12 grid gap-6 md:grid-cols-3">
              {team.map((member) => (
                <li key={member.slug} className="reveal">
                  <TeamCard member={member} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 max-w-2xl">
              <PendingNote title="The roster is being confirmed" pending={teamPending}>
                <p>
                  The people named here will be real, with credentials the business actually
                  publishes and photographs it actually owns. Nothing stands in for them in the
                  meantime.
                </p>
              </PendingNote>
            </div>
          )}
        </Container>
      </Section>

      {/*
        ── Reviews ───────────────────────────────────────────────────────────
        Verbatim quotes with permission, or nothing. Fabricated social proof is
        the one classic small-site move this template exists to refuse.
      */}
      <Section space="lg">
        <Container width="wide">
          <div className="reveal max-w-2xl">
            <Eyebrow className="rule-brand">What clients say</Eyebrow>
            <Heading level={1} as="h2" className="text-rise">
              Reviews
            </Heading>
          </div>

          {testimonials.length > 0 ? (
            <ul className="stagger mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <li key={t.id} className="reveal">
                  <figure className="lift flex h-full flex-col rounded-card border border-border bg-bg p-6 sm:p-7">
                    <blockquote className="flex-1 text-ink">
                      <p>{t.quote}</p>
                    </blockquote>
                    <figcaption className="mt-5 border-t border-border pt-4 font-bold">
                      {t.attribution}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 max-w-2xl">
              <PendingNote
                title="Reviews are the part we cannot write"
                pending={testimonialsPending}
              >
                <p>
                  Real quotes, republished with permission and attributed exactly as their authors
                  wrote them, will appear here. Until then the section stays honestly empty.
                </p>
              </PendingNote>
            </div>
          )}
        </Container>
      </Section>

      {/*
        ── FAQ ───────────────────────────────────────────────────────────────
        Native <details> so it works with no JavaScript. Renders only once the
        client has signed off answers — an FAQ is the business speaking.
      */}
      {faqs.length > 0 ? (
        <Section tone="surface" space="lg">
          <Container width="wide">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="reveal lg:col-span-4">
                <Eyebrow className="rule-brand">Common questions</Eyebrow>
                <Heading level={1} as="h2" className="text-rise">
                  What people ask first
                </Heading>
              </div>

              <div className="reveal lg:col-span-8">
                <div className="divide-y divide-border border-y border-border">
                  {faqs.slice(0, 5).map((faq) => (
                    <details key={faq.question} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold transition-colors duration-200 hover:text-accent">
                        {faq.question}
                        <span
                          aria-hidden="true"
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-accent transition-transform duration-300 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 max-w-prose text-ink-muted">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/*
        ── Close ─────────────────────────────────────────────────────────────
        The same closing band as every content page, so the way to act is
        identical wherever a visitor stops reading.
      */}
      <CtaBand />
    </>
  )
}
