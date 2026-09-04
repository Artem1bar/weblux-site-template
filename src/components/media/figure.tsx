import Image from 'next/image'

import type { SiteImage } from '@/assets/images'
import { cn } from '@/lib/cn'

const ratios = {
  wide: 'aspect-[21/9]',
  landscape: 'aspect-[16/9]',
  photo: 'aspect-[4/3]',
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  tall: 'aspect-[3/4]',
} as const

export type Ratio = keyof typeof ratios

/**
 * A photograph in a fixed frame.
 *
 * Two things this is protecting. First, layout: the frame owns the aspect ratio
 * and the image fills it, so nothing reflows when the picture arrives — the
 * static import already gave Next the intrinsic size and a blur placeholder.
 * Second, honesty: `image` carries its own alt text and provenance from the
 * registry, so a caller cannot quietly relabel an image as somebody's work.
 */
export function Figure({
  image,
  ratio = 'landscape',
  className,
  imgClassName,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  rounded = true,
  drift = false,
}: {
  image: SiteImage
  ratio?: Ratio
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
  rounded?: boolean
  /** Slow parallax as the frame crosses the viewport. Scroll-driven, no JS. */
  drift?: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-surface',
        ratios[ratio],
        rounded && 'rounded-card',
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        className={cn('object-cover', drift && 'drift', imgClassName)}
        style={image.focus ? { objectPosition: image.focus } : undefined}
      />
    </div>
  )
}
