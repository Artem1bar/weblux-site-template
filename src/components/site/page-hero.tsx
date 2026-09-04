import Image from 'next/image'
import type { ReactNode } from 'react'

import type { SiteImage } from '@/assets/images'
import { Container, Eyebrow, Heading, Lede } from '@/components/ui/layout'

import { Breadcrumbs } from './breadcrumbs'

/**
 * The page header used by every inner page, so the site has one entrance
 * rather than nine.
 *
 * `image` is optional because the template ships without client photography
 * (Q6). With an image, this is the photographic header: picture under a
 * deliberately strong scrim, fixed on-photo ink — a legible headline matters
 * more than an unobstructed picture. Without one, the same type, crumb trail
 * and spacing sit on the surface tone, and pages upgrade themselves the day
 * imagery arrives by passing it in.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  trail,
  children,
}: {
  eyebrow: string
  title: string
  lede?: ReactNode
  image?: SiteImage
  trail: { href: string; label: string }[]
  children?: ReactNode
}) {
  const inner = (
    <Container width="wide">
      <div className="max-w-2xl pb-14 pt-8 sm:pb-20 sm:pt-10">
        <Breadcrumbs trail={trail} />
        <Eyebrow className={image ? 'mt-8 text-on-photo-muted' : 'mt-8 text-ink-muted'}>
          {eyebrow}
        </Eyebrow>
        <Heading as="h1" level={1} className={image ? 'text-on-photo' : undefined}>
          {title}
        </Heading>
        {lede ? <Lede className={image ? 'mt-5 text-on-photo-muted' : 'mt-5'}>{lede}</Lede> : null}
        {children}
      </div>
    </Container>
  )

  if (!image) {
    return <section className="border-b border-border bg-surface">{inner}</section>
  }

  return (
    <section className="on-photo relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src={image.src}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="object-cover"
          style={image.focus ? { objectPosition: image.focus } : undefined}
        />
        <div className="photo-scrim-side absolute inset-0 hidden md:block" />
        <div className="photo-scrim absolute inset-0 md:hidden" />
      </div>
      {inner}
    </section>
  )
}
