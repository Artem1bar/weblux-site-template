import { cn } from '@/lib/cn'

/**
 * First element in tab order. Visually hidden until focused, then it becomes a
 * real, visible control. The class of site this template replaces usually has
 * no skip link at all, so a keyboard user tabs through the whole header on
 * every page.
 */
export function SkipLink({ className }: { className?: string }) {
  return (
    <a
      href="#main"
      className={cn(
        'sr-only focus:not-sr-only',
        'focus:absolute focus:left-4 focus:top-4 focus:z-50',
        'focus:rounded-card focus:bg-accent focus:px-5 focus:py-3',
        'focus:font-semibold focus:text-on-accent',
        className,
      )}
    >
      Skip to main content
    </a>
  )
}
