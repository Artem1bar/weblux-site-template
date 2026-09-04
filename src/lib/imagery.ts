import { type SiteImage, images } from '@/assets/images'

/**
 * Which photograph goes with which piece of content.
 *
 * This lives apart from `src/content` on purpose: the content modules are pure
 * data about the business and should not know that an art direction exists,
 * let alone which image file is currently fashionable. This is the seam
 * between them.
 *
 * Both maps ship empty alongside the empty image registry (Q6). When they
 * fill in, every pairing must be by *subject matter* — a roof for roof work,
 * never a photo implying a specific job. imagery.test.ts keeps the maps and
 * the content modules consistent in both directions, because these lookups
 * return undefined rather than throw: a typo'd slug is invisible in the
 * browser (the page renders, imageless) and only a test turns it back into a
 * failing build.
 */
const serviceImages: Record<string, SiteImage> = {}

export function serviceImage(slug: string): SiteImage | undefined {
  return serviceImages[slug]
}

/** The slugs that actually have a pairing. Tests ask this, since callers cannot. */
export const pairedServiceSlugs = Object.keys(serviceImages)

const areaImages: Record<string, SiteImage> = {}

export function areaImage(slug: string): SiteImage | undefined {
  return areaImages[slug]
}

export const pairedAreaSlugs = Object.keys(areaImages)

/** Referenced so the registry is part of the typechecked graph even while empty. */
export const registrySize = Object.keys(images).length
