import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import ContactPage from './page'

describe('contact page', () => {
  it('has exactly one h1', () => {
    const { container } = render(<ContactPage />)
    expect(container.querySelectorAll('h1')).toHaveLength(1)
  })

  it('renders the lead form with its required fields labelled', () => {
    render(<ContactPage />)
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/what is this about/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/what do you need/i)).toBeInTheDocument()
  })

  it('marks email and address as optional rather than required', () => {
    render(<ContactPage />)
    expect(screen.getByLabelText(/^email \(optional\)$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^address \(optional\)$/i)).toBeInTheDocument()
  })

  it('has no duplicate element ids', () => {
    // A page that renders the same form twice breaks label association on
    // every field — a classic old-site defect worth pinning against.
    const { container } = render(<ContactPage />)
    const ids = [...container.querySelectorAll('[id]')].map((el) => el.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('includes a honeypot that is hidden from assistive tech', () => {
    const { container } = render(<ContactPage />)
    const honeypot = container.querySelector('input[name="website"]')
    expect(honeypot).toBeTruthy()
    expect(honeypot?.closest('[aria-hidden="true"]')).toBeTruthy()
    expect(honeypot?.getAttribute('tabindex')).toBe('-1')
  })

  it('admits the direct channels are pending instead of inventing them', () => {
    const { container } = render(<ContactPage />)
    // No tel: or mailto: links exist until Q3 is answered…
    expect(container.querySelectorAll('a[href^="tel:"]')).toHaveLength(0)
    expect(container.querySelectorAll('a[href^="mailto:"]')).toHaveLength(0)
    // …and the aside says so traceably rather than sitting empty.
    const note = container.querySelector('[data-pending-question]')
    expect(note?.getAttribute('data-pending-question')).toMatch(/^Q3: /)
  })
})
