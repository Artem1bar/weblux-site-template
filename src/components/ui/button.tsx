import { type VariantProps, cva } from 'class-variance-authority'
import Link from 'next/link'
import type { ComponentProps } from 'react'

import { cn } from '@/lib/cn'

const button = cva(
  // 44px minimum target: client sites get read on phones, often by people who
  // are not having a good day.
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-card font-semibold ' +
    'transition-colors duration-150 disabled:pointer-events-none disabled:opacity-55',
  {
    variants: {
      variant: {
        // Brand as a filled surface under its `on` ink — contrast-tested.
        primary: 'bg-brand text-on-brand hover:bg-brand/85',
        accent: 'bg-accent text-on-accent hover:bg-accent/90',
        outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-bg',
        ghost: 'text-ink hover:bg-surface',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', size: 'md', block: false },
  },
)

type ButtonVariants = VariantProps<typeof button>

export function Button({
  className,
  variant,
  size,
  block,
  ...props
}: ComponentProps<'button'> & ButtonVariants) {
  return <button className={cn(button({ variant, size, block }), className)} {...props} />
}

export function ButtonLink({
  className,
  variant,
  size,
  block,
  ...props
}: ComponentProps<typeof Link> & ButtonVariants) {
  return <Link className={cn(button({ variant, size, block }), className)} {...props} />
}

export { button as buttonVariants }
