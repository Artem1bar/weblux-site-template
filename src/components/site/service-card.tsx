import Link from 'next/link'

import { Figure } from '@/components/media/figure'
import { Heading } from '@/components/ui/layout'
import type { Service } from '@/content/services'
import { cn } from '@/lib/cn'
import { serviceImage } from '@/lib/imagery'

/**
 * One service card, used on the homepage, on /services and in any related
 * strip — one component, so copies cannot drift on link text or heading level.
 *
 * The photograph is optional by construction: `serviceImage` returns undefined
 * until the imagery pairings exist (Q6), and the card renders as a clean text
 * card in the meantime.
 *
 * The `wide` layout exists for grid arithmetic: a service count of 3n+1 in a
 * three-column grid strands one orphan card beside two card-shaped holes.
 * Wide turns that orphan into a full-bleed row on purpose, which reads as a
 * decision rather than as a grid that ran out.
 */
export function ServiceCard({
  service,
  layout = 'stacked',
  className,
  headingAs = 'h3',
  sizes,
}: {
  service: Service
  layout?: 'stacked' | 'wide'
  className?: string
  headingAs?: 'h2' | 'h3'
  sizes?: string
}) {
  const wide = layout === 'wide'
  const image = serviceImage(service.slug)

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        'lift zoom-frame nudge group flex h-full overflow-hidden rounded-card border border-border bg-bg',
        wide ? 'flex-col sm:flex-row' : 'flex-col',
        className,
      )}
    >
      {image ? (
        // zoom-frame is on the root, so hovering anywhere in the card moves the
        // picture. A second one here would just nest the same rule.
        <div className={cn(wide && 'sm:w-2/5 sm:shrink-0')}>
          <Figure
            image={image}
            ratio="landscape"
            rounded={false}
            className={wide ? 'sm:h-full' : undefined}
            sizes={sizes ?? '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw'}
          />
        </div>
      ) : null}

      <div className={cn('flex flex-1 flex-col p-6', wide ? 'sm:justify-center sm:p-8' : 'sm:p-7')}>
        <Heading level={wide ? 3 : 4} as={headingAs}>
          {service.title}
        </Heading>
        <p className={cn('mt-3 text-ink-muted', wide ? 'max-w-prose' : 'flex-1')}>
          {service.summary}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-bold text-accent">
          {service.cta}{' '}
          <span aria-hidden="true" className="nudge-arrow">
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  )
}
