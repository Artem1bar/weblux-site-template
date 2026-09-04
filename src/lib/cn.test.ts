import { describe, expect, it } from 'vitest'

import { cn } from './cn'

describe('cn', () => {
  it('joins plain class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, '', 'b')).toBe('a b')
  })

  it('lets a later tailwind utility win over an earlier conflicting one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-ink', 'text-brand')).toBe('text-brand')
  })

  it('keeps non-conflicting tailwind utilities', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })

  it('accepts conditional object and array syntax', () => {
    expect(cn('base', { active: true, hidden: false }, ['x', 'y'])).toBe('base active x y')
  })
})
