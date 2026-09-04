import { cn } from '@/lib/cn'

/**
 * PLACEHOLDER MARK — replace per client (docs/CLIENT-QUESTIONS.md Q6: brand
 * assets, logo, fonts, photo ownership).
 *
 * A deliberately neutral geometric device: three rising bars in a circle. It
 * is abstract on purpose — it must never be mistakable for a real company's
 * logo, and it must never ship to production as if it were one. It exists so
 * the header, footer and cards have a mark-shaped object to hang layout on
 * while the real identity is pending.
 *
 * Inline SVG drawn in `currentColor`, so it takes its colour from whatever it
 * sits in — brand-on-dark, ink-on-brand, or an inherited link colour — with no
 * second copy. If the client's real mark arrives as heavy path data, prefer
 * the CSS-mask treatment (one cached file, still currentColor) over inlining
 * kilobytes of path into every page.
 */
export function BrandMark({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={cn('block', className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.8" />
      <rect x="7" y="12.5" width="2.6" height="5" rx="0.9" fill="currentColor" />
      <rect x="10.8" y="9.5" width="2.6" height="8" rx="0.9" fill="currentColor" />
      <rect x="14.6" y="6.5" width="2.6" height="11" rx="0.9" fill="currentColor" />
    </svg>
  )
}
