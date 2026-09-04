import { ImageResponse } from 'next/og'

import { valueOr } from '@/content/maybe'
import { NAME_PLACEHOLDER, site } from '@/content/site'
import { onPhoto } from '@/styles/tokens'

export const alt = 'Link preview card'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The share card. Without one, a shared link renders as bare text — this is
 * the first thing anyone sees when the link is passed around.
 *
 * Built with next/og so the copy stays in sync with the content modules: the
 * name placeholder swaps for the real name the moment Q1 is answered, with no
 * second asset to remember. The mark is drawn as inline SVG shapes because
 * Satori resolves no CSS cascade — colours are baked in, not inherited.
 *
 * On a brand build: bake the brand ground and hero photograph in here (Satori
 * decodes PNG/JPEG/SVG only — hand it a WebP and the build fails with an
 * unhelpful "u2 is not iterable"), and prefer reading the file from disk into
 * a data URI over fetching the deployment's own origin.
 */
export default async function OpenGraphImage() {
  const name = valueOr(site.name, NAME_PLACEHOLDER)

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '68px',
        fontFamily: 'sans-serif',
        backgroundColor: onPhoto.ground,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* The placeholder mark: three rising bars in a circle. */}
        <svg width="62" height="62" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10.5" stroke="#8ab8f0" strokeWidth="1.8" />
          <rect x="7" y="12.5" width="2.6" height="5" rx="0.9" fill="#8ab8f0" />
          <rect x="10.8" y="9.5" width="2.6" height="8" rx="0.9" fill="#8ab8f0" />
          <rect x="14.6" y="6.5" width="2.6" height="11" rx="0.9" fill="#8ab8f0" />
        </svg>
        <span style={{ fontSize: 30, fontWeight: 700, color: onPhoto.ink }}>{name}</span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          color: onPhoto.ink,
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.08,
          letterSpacing: '-0.02em',
          maxWidth: 940,
        }}
      >
        <span>A site in preparation.</span>
      </div>

      <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, color: onPhoto.inkMuted }}>
        <span>Published facts only — content appears as the business confirms it.</span>
      </div>
    </div>,
    size,
  )
}
