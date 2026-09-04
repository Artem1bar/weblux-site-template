/**
 * WCAG 2.1 contrast maths.
 *
 * This exists so the token set can be tested rather than eyeballed. Brand
 * palettes routinely contain a colour that is beautiful as a background and
 * unreadable as text — a mistake that is easy to make and hard to notice by
 * looking. A test catches it before a screenshot does, and it re-runs on every
 * palette swap this template goes through.
 *
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

function toRgb(hex: string): [number, number, number] {
  if (!HEX.test(hex)) {
    throw new Error(`contrast: expected a 3- or 6-digit hex colour, got "${hex}"`)
  }
  const h = hex.slice(1)
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ]
}

/** sRGB channel to linear, per WCAG. */
function linearize(channel8Bit: number): number {
  const c = channel8Bit / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map(linearize)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

/** AA for body text: 4.5:1. */
export function meetsAA(foreground: string, background: string): boolean {
  return contrastRatio(foreground, background) >= 4.5
}

/** AA for large text (18pt+, or 14pt+ bold) and non-text UI: 3:1. */
export function meetsAALarge(foreground: string, background: string): boolean {
  return contrastRatio(foreground, background) >= 3
}

/** AAA for body text: 7:1. */
export function meetsAAA(foreground: string, background: string): boolean {
  return contrastRatio(foreground, background) >= 7
}
