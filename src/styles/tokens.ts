/**
 * The single source of truth for colour. `globals.css` mirrors these values into
 * CSS custom properties, and `contrast.test.ts` asserts every meaningful pair
 * clears WCAG AA in both themes. Change one, change both.
 *
 * This is the template's deliberately neutral placeholder palette: slate ink on
 * white / deep-slate surfaces, one saturated blue doing brand duty, and a link
 * accent that lifts to a pale blue in dark mode where a saturated blue would
 * sink into the page. Swap it per brand — and when you do, run the contrast
 * suite before looking at a single screenshot. It is the cheapest design review
 * you will ever get, and it has caught real shipped bugs (a brand colour that
 * is gorgeous as a background and 1.3:1 as text is a classic).
 */

export type Theme = {
  /** Page background. */
  bg: string
  /** Raised surface: cards, form wells. */
  surface: string
  /** Body text. */
  ink: string
  /** Secondary text — still AA on both bg and surface. */
  inkMuted: string
  /** Brand colour. Here: a saturated blue that works as a filled surface under white ink. */
  brand: string
  /** Text placed on the brand colour. */
  onBrand: string
  /** Interactive/link colour. */
  accent: string
  /** Text placed on the accent. */
  onAccent: string
  /** Hairlines and dividers. */
  border: string
  /** Focus ring — must clear 3:1 against bg. */
  focus: string
  /** Errors and destructive states. */
  danger: string
}

export const light: Theme = {
  bg: '#ffffff',
  surface: '#f4f6f8',
  ink: '#1f2933',
  inkMuted: '#4e5d6c',
  brand: '#2563eb',
  onBrand: '#ffffff',
  // A step deeper than the brand blue, so links read as ink that happens to be
  // interactive rather than as decoration.
  accent: '#1d4ed8',
  onAccent: '#ffffff',
  border: '#d9e0e6',
  focus: '#1d4ed8',
  danger: '#b3261e',
}

export const dark: Theme = {
  bg: '#10161c',
  surface: '#1a232c',
  ink: '#eef2f6',
  inkMuted: '#a3b1bf',
  // Same brand blue: it still clears 3:1 against the dark page as a filled
  // surface, so buttons keep their edge without a per-theme brand fork.
  brand: '#2563eb',
  onBrand: '#ffffff',
  // A saturated blue is unreadable as text on a dark page, so the accent lifts
  // to a pale blue.
  accent: '#8ab8f0',
  onAccent: '#0c1a33',
  border: '#2c3945',
  focus: '#8ab8f0',
  danger: '#ffa198',
}

export const themes = { light, dark } as const

export type ThemeName = keyof typeof themes

/**
 * Ink for surfaces that stay dark in both themes.
 *
 * Photography (once a client supplies any) sits under heavy scrims and reads
 * dark either way, so type over it is fixed against the image rather than
 * against the page. `ground` extends that to panels that want the photographic
 * treatment without a photograph, and `accent` is the one link colour allowed
 * on those panels — the pale blue, because the saturated brand blue lands
 * under 3:1 on a near-black ground.
 *
 * Use these, and never `bg-ink`/`text-bg`, to invert a panel. Those two flip
 * with the theme, so an "inverted" card built from them becomes a *light* card
 * in dark mode, and every colour placed on it is suddenly being measured
 * against the wrong ground. That bug shipped once on the site this template
 * distils; `contrast.test.ts` now pins the fixed tokens instead.
 */
export const onPhoto = {
  ink: '#ffffff',
  inkMuted: '#c6d0da',
  ground: '#10151a',
  accent: '#8ab8f0',
} as const
