import { describe, expect, it } from 'vitest'

import { contrastRatio, meetsAA, meetsAALarge, relativeLuminance } from './contrast'
import { onPhoto, themes } from '@/styles/tokens'

describe('relativeLuminance', () => {
  it('puts black at 0 and white at 1', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5)
    expect(relativeLuminance('#ffffff')).toBeCloseTo(1, 5)
  })

  it('accepts shorthand hex', () => {
    expect(relativeLuminance('#fff')).toBeCloseTo(1, 5)
  })

  it('rejects a value that is not a hex colour', () => {
    expect(() => relativeLuminance('rebeccapurple')).toThrow()
    expect(() => relativeLuminance('#12345')).toThrow()
  })
})

describe('contrastRatio', () => {
  it('is 21:1 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
  })

  it('is 1:1 for a colour against itself', () => {
    expect(contrastRatio('#2563eb', '#2563eb')).toBeCloseTo(1, 5)
  })

  it('does not care which colour is given first', () => {
    expect(contrastRatio('#1f2933', '#2563eb')).toBeCloseTo(contrastRatio('#2563eb', '#1f2933'), 5)
  })
})

/**
 * The palette gate. This loop is what a brand swap has to satisfy: replace the
 * tokens, run this file, and every meaningful pair is re-judged. It has caught
 * real shipped bugs — the classic being a brand colour that is beautiful as a
 * background and unreadable as text.
 */
describe('token contrast', () => {
  for (const [themeName, theme] of Object.entries(themes)) {
    describe(themeName, () => {
      it('body text on the page background clears AA', () => {
        expect(meetsAA(theme.ink, theme.bg)).toBe(true)
      })

      it('body text on a raised surface clears AA', () => {
        expect(meetsAA(theme.ink, theme.surface)).toBe(true)
      })

      it('muted text clears AA on both background and surface', () => {
        expect(meetsAA(theme.inkMuted, theme.bg)).toBe(true)
        expect(meetsAA(theme.inkMuted, theme.surface)).toBe(true)
      })

      it('text on the brand colour clears AA', () => {
        expect(meetsAA(theme.onBrand, theme.brand)).toBe(true)
      })

      it('text on the accent clears AA', () => {
        expect(meetsAA(theme.onAccent, theme.accent)).toBe(true)
      })

      it('the accent is legible as a link colour on the page background', () => {
        expect(meetsAA(theme.accent, theme.bg)).toBe(true)
      })

      it('the focus ring is visible against the background', () => {
        // 3:1 is the WCAG floor for non-text UI like a focus indicator.
        expect(contrastRatio(theme.focus, theme.bg)).toBeGreaterThanOrEqual(3)
      })

      it('borders are at least discernible', () => {
        expect(contrastRatio(theme.border, theme.bg)).toBeGreaterThanOrEqual(1.2)
      })

      it('the danger colour clears AA on the background', () => {
        expect(meetsAA(theme.danger, theme.bg)).toBe(true)
      })

      it('the brand colour keeps a visible edge as a filled surface', () => {
        // A filled button against the page needs the 3:1 non-text floor, in
        // both themes — the dark theme is where a saturated brand quietly
        // sinks into the page.
        expect(contrastRatio(theme.brand, theme.bg)).toBeGreaterThanOrEqual(3)
      })
    })
  }
})

/*
  The fixed dark panels — the CTA band and any inverted card.

  These exist as their own token set because the theme-relative way of building
  an inverted panel is a trap: `bg-ink text-bg` looks right in light mode and
  silently flips in dark, and every colour placed on it is then measured
  against the wrong ground. That shipped once on the site this template
  distils. The fixed tokens cannot flip, and these assertions pin them.
*/
describe('fixed dark panels', () => {
  it('white and muted ink clear AA on the dark ground', () => {
    expect(meetsAA(onPhoto.ink, onPhoto.ground)).toBe(true)
    expect(meetsAA(onPhoto.inkMuted, onPhoto.ground)).toBe(true)
  })

  it('the panel accent is legible on the dark ground', () => {
    expect(meetsAA(onPhoto.accent, onPhoto.ground)).toBe(true)
  })

  it('shows why the saturated brand is not the panel accent', () => {
    // The reason onPhoto.accent exists: the brand blue lands under the 4.5:1
    // text floor on the near-black ground. If a future brand colour passes
    // this, the separate panel accent can collapse back into it — knowingly.
    expect(meetsAA(themes.light.brand, onPhoto.ground)).toBe(false)
  })
})

describe('meetsAALarge', () => {
  it('uses the 3:1 floor rather than 4.5:1', () => {
    const pair: [string, string] = ['#767676', '#ffffff']
    expect(meetsAALarge(...pair)).toBe(true)
    // A pair that clears large-text AA but not body AA.
    expect(meetsAALarge('#949494', '#ffffff')).toBe(true)
    expect(meetsAA('#949494', '#ffffff')).toBe(false)
  })
})
