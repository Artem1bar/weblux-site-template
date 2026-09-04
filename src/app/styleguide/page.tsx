import type { Metadata } from 'next'

import { Button, ButtonLink } from '@/components/ui/button'
import { Card, Container, Eyebrow, Heading, Lede, Prose, Section } from '@/components/ui/layout'
import { contrastRatio } from '@/lib/contrast'
import { themes } from '@/styles/tokens'

export const metadata: Metadata = {
  title: 'Style guide',
  // Internal reference, not something we want in the index.
  robots: { index: false, follow: false },
}

/** `on` is the token that stays legible on top of `name`, and `cssVar` its custom property. */
const swatches = [
  { name: 'bg', on: 'ink', cssVar: '--ink' },
  { name: 'surface', on: 'ink', cssVar: '--ink' },
  { name: 'brand', on: 'onBrand', cssVar: '--on-brand' },
  { name: 'accent', on: 'onAccent', cssVar: '--on-accent' },
] as const

export default function StyleguidePage() {
  return (
    <>
      <Section tone="surface" space="sm">
        <Container>
          <Eyebrow>Internal reference</Eyebrow>
          <Heading as="h1" level="display">
            Style guide
          </Heading>
          <Lede className="mt-4 max-w-2xl">
            The neutral placeholder palette, rendered live. Every colour pair below is asserted in{' '}
            <code>src/lib/contrast.test.ts</code> — swap the palette per brand and the same suite
            re-judges it.
          </Lede>
        </Container>
      </Section>

      <Section>
        <Container className="space-y-12">
          <div>
            <Heading level={2}>Type scale</Heading>
            <div className="mt-6 space-y-4">
              <Heading level="display" as="p">
                Display — the page&rsquo;s one big claim
              </Heading>
              <Heading level={1} as="p">
                Heading 1 — a section that carries a page
              </Heading>
              <Heading level={2} as="p">
                Heading 2 — a section inside it
              </Heading>
              <Heading level={3} as="p">
                Heading 3 — a card or a column
              </Heading>
              <Heading level={4} as="p">
                Heading 4 — a labelled block
              </Heading>
              <Lede>Lede — the sentence that carries the page.</Lede>
              <Prose>
                <p>
                  Body copy. Capped at 68 characters of measure, 1.7 leading, because long-form text
                  is read by people in a hurry on phones.
                </p>
              </Prose>
              <p className="text-ink-muted">Muted text, still AA against both bg and surface.</p>
            </div>
          </div>

          <div>
            <Heading level={2}>Buttons</Heading>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary action</Button>
              <Button variant="accent">Accent action</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <ButtonLink href="/styleguide" variant="accent">
                Link styled as button
              </ButtonLink>
            </div>
          </div>

          <div>
            <Heading level={2}>Surfaces</Heading>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {swatches.map((s) => (
                // Inline var() rather than a template-literal class: Tailwind
                // only emits utilities it can see as complete strings at build time.
                <div
                  key={s.name}
                  className="rounded-card border border-border p-6"
                  style={{
                    backgroundColor: `var(--${s.name})`,
                    color: `var(${s.cssVar})`,
                  }}
                >
                  <p className="font-bold">{s.name}</p>
                  <p className="text-sm opacity-80">
                    {contrastRatio(
                      themes.light[s.on as keyof typeof themes.light],
                      themes.light[s.name as keyof typeof themes.light],
                    ).toFixed(2)}
                    :1 light ·{' '}
                    {contrastRatio(
                      themes.dark[s.on as keyof typeof themes.dark],
                      themes.dark[s.name as keyof typeof themes.dark],
                    ).toFixed(2)}
                    :1 dark
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Heading level={2}>Cards</Heading>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {['First thing', 'Second thing', 'Third thing'].map((t) => (
                <Card key={t}>
                  <Heading level={4} as="h3">
                    {t}
                  </Heading>
                  <p className="mt-2 text-ink-muted">
                    A short summary of what this card is about, in one or two lines.
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Heading level={2}>Focus</Heading>
            <p className="mt-2 text-ink-muted">
              Tab through these. Every interactive element gets a 3px ring at 3:1 or better.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline">First</Button>
              <Button variant="outline">Second</Button>
              <Button variant="outline">Third</Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="brand" space="sm">
        <Container>
          <Heading level={2}>Brand as a surface</Heading>
          <p className="mt-2 max-w-2xl">
            The brand colour at scale: a filled surface under its own `on` ink. When a client
            palette arrives, the contrast suite decides whether the new brand can also carry text —
            many cannot, and become background-only exactly like this.
          </p>
        </Container>
      </Section>

      <Section tone="accent" space="sm">
        <Container>
          <Heading level={2}>Accent as a surface</Heading>
          <p className="mt-2 max-w-2xl">
            The accent carries links and secondary calls to action, and lifts to a pale tint in dark
            mode where the saturated version would disappear.
          </p>
        </Container>
      </Section>
    </>
  )
}
