import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Join class names, letting later Tailwind utilities override earlier
 * conflicting ones. Every component in this codebase composes classes through
 * `cn` so a caller's `className` always wins over a component's defaults.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
