import Image from 'next/image'

import type { SiteImage } from '@/assets/images'
import { BrandMark } from '@/components/brand/brand-mark'
import { ButtonLink } from '@/components/ui/button'
import { Container, Heading } from '@/components/ui/layout'

import { PhoneLink } from './phone-link'

/**
 * The closing call to action, shared across every content page so the way to
 * act is identical wherever a visitor stops reading.
 *
 * The default copy is structural — it invites a conversation and promises
 * nothing on the client's behalf. Pages pass their own heading/body once the
 * client's voice is confirmed. `image` is optional: with client photography
 * (Q6) this becomes the photographic band; without it, the same layout sits on
 * the fixed dark ground so the page still ends on a full stop.
 */
export function CtaBand({
  heading = 'Ready when you are.',
  body = 'Send the details through the contact page and we will come back to you.',
  image,
}: {
  heading?: string
  body?: string
  image?: SiteImage
}) {
  return (
    <section className="on-photo relative isolate overflow-hidden bg-[#10151a]">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <Image
            src={image.src}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            className="object-cover"
            style={image.focus ? { objectPosition: image.focus } : undefined}
          />
          <div className="photo-scrim absolute inset-0" />
        </div>
      ) : null}

      <Container width="wide">
        <div className="reveal max-w-2xl py-20 sm:py-28">
          <BrandMark className="h-12 w-12 text-on-photo-muted" />
          <Heading level="display" as="h2" className="text-rise mt-6 text-on-photo">
            {heading}
          </Heading>
          <p className="mt-5 max-w-xl text-lg text-on-photo-muted">{body}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/contact" variant="primary" size="lg" className="sweep press">
              Get in touch
            </ButtonLink>
            <PhoneLink
              location="cta-band"
              className="press inline-flex min-h-11 items-center justify-center rounded-card border-2 border-on-photo/70 px-6 py-4 text-lg font-bold text-on-photo transition-colors duration-200 hover:border-on-photo hover:bg-on-photo hover:text-[#10151a]"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
