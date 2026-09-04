import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import HomePage from './page'

/**
 * These lock in the template's discipline in its all-pending state: the page
 * renders real structure, admits what is missing, and leaks nothing internal.
 */
describe('home page (all-pending state)', () => {
  it('has exactly one h1', () => {
    const { container } = render(<HomePage />)
    expect(container.querySelectorAll('h1')).toHaveLength(1)
  })

  it('renders wireframe copy in the hero, not a fake business', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/goes here/i)
  })

  it('marks every empty section with the question that fills it', () => {
    const { container } = render(<HomePage />)
    const notes = container.querySelectorAll('[data-pending-question]')
    // Services, team and reviews are all pending out of the box.
    expect(notes.length).toBeGreaterThanOrEqual(3)
    for (const note of notes) {
      expect(note.getAttribute('data-pending-question')).toMatch(/^Q\d+: /)
    }
  })

  it('never renders a raw pending question as visible text', () => {
    const { container } = render(<HomePage />)
    expect(container.textContent).not.toMatch(/Q\d+: /)
    expect(container.textContent).not.toContain('[object Object]')
  })

  it('emits no JSON-LD while the business identity is pending', () => {
    // Structured data is read by machines that republish it. A placeholder
    // name in a LocalBusiness node would become "fact" in a knowledge panel.
    const { container } = render(<HomePage />)
    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0)
  })

  it('gives every image an alt attribute', () => {
    const { container } = render(<HomePage />)
    for (const img of container.querySelectorAll('img')) {
      expect(img.getAttribute('alt')).not.toBeNull()
    }
  })

  it('does not claim results or reviews it cannot evidence', () => {
    const { container } = render(<HomePage />)
    expect(container.textContent).not.toMatch(/real results/i)
    expect(container.textContent).not.toMatch(/explore more/i)
  })
})
