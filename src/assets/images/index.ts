import type { StaticImageData } from 'next/image'

/**
 * Every photograph on the site, in one typed place. The template ships with
 * the registry EMPTY — brand imagery is a client fact
 * (docs/CLIENT-QUESTIONS.md Q6: brand assets, fonts, photo ownership).
 *
 * The load-bearing rule, and the reason `provenance` is not optional: imagery
 * is atmosphere, never evidence. The classic small-site defect this template
 * refuses to reproduce is stock or generated photos captioned as the client's
 * own work, people, or premises. So no generated face ever stands in for a
 * named person, no generated building is captioned as the office, and `alt`
 * describes what is in the frame without claiming the scene is the client's.
 *
 * Static imports (rather than /public paths) are deliberate: Next derives the
 * intrinsic width, height and a blur placeholder at build time, so every
 * figure reserves its own space and nothing shifts while it loads. Add images
 * like so:
 *
 *   import heroStreet from './hero-street.webp'
 *   export const images = {
 *     heroStreet: clientSupplied(heroStreet, 'A row of shopfronts at dusk.'),
 *   } as const satisfies Record<string, SiteImage>
 */
export type SiteImage = {
  src: StaticImageData
  /** Describes the frame. Never asserts whose property or work it is. */
  alt: string
  /** Where the pixels came from. Required so nothing can quietly become "a real photo". */
  provenance: 'generated' | 'client-supplied' | 'licensed-stock'
  /** Focal point for art-directed crops, as CSS object-position. */
  focus?: string
}

export const generated = (src: StaticImageData, alt: string, focus?: string): SiteImage => ({
  src,
  alt,
  provenance: 'generated',
  focus,
})

/**
 * An image the client already publishes under their own name. That makes it
 * the single class of imagery allowed to show a person — the decision to
 * publish someone's face was theirs to make, and they made it.
 */
export const clientSupplied = (src: StaticImageData, alt: string, focus?: string): SiteImage => ({
  src,
  alt,
  provenance: 'client-supplied',
  focus,
})

export const licensedStock = (src: StaticImageData, alt: string, focus?: string): SiteImage => ({
  src,
  alt,
  provenance: 'licensed-stock',
  focus,
})

export const images = {} as const satisfies Record<string, SiteImage>

export type ImageKey = keyof typeof images
