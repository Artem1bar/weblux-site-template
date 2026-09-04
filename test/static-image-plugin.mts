import { basename } from 'node:path'

import type { Plugin } from 'vite'

/**
 * Makes `import hero from './hero.webp'` behave under vitest the way it does in
 * the real build.
 *
 * Next's image loader rewrites a static image import into a StaticImageData
 * object — `{ src, width, height, blurDataURL }`. Vite has no such loader, so
 * without this the import resolves to a bare URL string and every `next/image`
 * with `placeholder="blur"` throws "missing the blurDataURL property". That is
 * a harness gap, not a site bug.
 *
 * The dimensions are a stand-in rather than the file's real ones: nothing in the
 * suite asserts on intrinsic size, and parsing WebP headers here would be a lot
 * of machinery to reproduce a number the build already gets right. What does
 * matter is the *shape* — every field `next/image` reads is present, so a
 * component that forgets one still fails the test.
 */
export function staticImagePlugin(): Plugin {
  const IMAGE = /\.(webp|png|jpe?g|avif|gif)$/

  return {
    name: 'static-image-stub',
    enforce: 'pre',
    load(id) {
      const [path] = id.split('?')
      if (!IMAGE.test(path)) return null

      const src = `/_next/static/media/${basename(path)}`
      return `export default ${JSON.stringify({
        src,
        height: 1760,
        width: 2352,
        blurDataURL: `data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==`,
        blurWidth: 8,
        blurHeight: 6,
      })}`
    },
  }
}
