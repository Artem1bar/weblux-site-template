import { type VariantProps, cva } from 'class-variance-authority'
import type { ComponentProps, ElementType } from 'react'

import { cn } from '@/lib/cn'

const container = cva('mx-auto w-full px-5 sm:px-8', {
  variants: {
    width: {
      // Measure-constrained: long prose stays readable.
      prose: 'max-w-[68ch]',
      narrow: 'max-w-3xl',
      default: 'max-w-6xl',
      wide: 'max-w-7xl',
    },
  },
  defaultVariants: { width: 'default' },
})

export function Container({
  className,
  width,
  as: As = 'div',
  ...props
}: ComponentProps<'div'> & VariantProps<typeof container> & { as?: ElementType }) {
  return <As className={cn(container({ width }), className)} {...props} />
}

const section = cva('', {
  variants: {
    tone: {
      default: 'bg-bg text-ink',
      surface: 'bg-surface text-ink',
      brand: 'bg-brand text-on-brand',
      accent: 'bg-accent text-on-accent',
    },
    space: {
      sm: 'py-10 sm:py-14',
      md: 'py-14 sm:py-20',
      lg: 'py-20 sm:py-28',
    },
  },
  defaultVariants: { tone: 'default', space: 'md' },
})

export function Section({
  className,
  tone,
  space,
  as: As = 'section',
  ...props
}: ComponentProps<'section'> & VariantProps<typeof section> & { as?: ElementType }) {
  return <As className={cn(section({ tone, space }), className)} {...props} />
}

/**
 * A short label above a heading.
 *
 * Set in the body face on purpose: it is the one small piece of type near a
 * display headline, and matching the headline there makes both look like a
 * mistake. Wide tracking because uppercase at 13px sets far too tight otherwise.
 */
export function Eyebrow({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'mb-3 font-sans text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-ink-muted',
        className,
      )}
      {...props}
    />
  )
}

/**
 * The type scale.
 *
 * Every heading is set in the display slot. That is a decision, not a default:
 * opting the display face in per-heading is the kind of thing that gets
 * forgotten on the ninth page and leaves one section quietly set in the body
 * face. Opting *out* is the rarer case, so it is the one that has to be
 * written down.
 *
 * Sizes step by roughly a major third and every level names its own
 * line-height, because a display face at 60px wants far tighter leading than
 * the same face at 18px and the browser default splits the difference badly.
 */
const heading = cva('font-display font-bold tracking-tight', {
  variants: {
    level: {
      display: 'text-[2.5rem] leading-[1.04] sm:text-5xl lg:text-6xl xl:text-[4.25rem]',
      1: 'text-3xl leading-[1.1] sm:text-4xl lg:text-5xl',
      2: 'text-2xl leading-[1.16] sm:text-3xl lg:text-[2.5rem]',
      3: 'text-xl leading-[1.24] sm:text-2xl',
      4: 'text-lg leading-[1.3] sm:text-xl',
    },
  },
  defaultVariants: { level: 2 },
})

/**
 * `as` and `level` are independent on purpose: the document outline is a
 * semantic decision and the type scale is a visual one. Sites that pick tags by
 * how big they want the text end up with zero h1 elements.
 */
export function Heading({
  className,
  level,
  as: As = 'h2',
  ...props
}: ComponentProps<'h2'> & VariantProps<typeof heading> & { as?: ElementType }) {
  return <As className={cn(heading({ level }), className)} {...props} />
}

/**
 * The standfirst under a heading. Capped narrower than the prose measure so it
 * reads as an opening line rather than as the first paragraph of the body.
 */
export function Lede({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'max-w-[52ch] text-lg leading-[1.55] text-ink-muted text-pretty sm:text-xl',
        className,
      )}
      {...props}
    />
  )
}

/**
 * Running body copy.
 *
 * Measure is capped at 68 characters, which is the middle of the range that
 * stops the eye losing its place on the carriage return. Leading is 1.7 rather
 * than the browser's 1.5, and paragraph spacing is set from the leading so the
 * block reads as a rhythm instead of as evenly-spaced slabs.
 */
export function Prose({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('max-w-[68ch] text-lg leading-[1.7] text-ink [&>*+*]:mt-[1.15em]', className)}
      {...props}
    />
  )
}

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-card border border-border bg-bg p-6 sm:p-7', className)}
      {...props}
    />
  )
}
