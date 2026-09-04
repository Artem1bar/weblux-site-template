import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { pending } from '@/content/maybe'

import { PendingNote } from './pending-note'

describe('PendingNote', () => {
  const question = pending('Q4: The confirmed service list')

  it('shows the visitor copy, not the internal question', () => {
    render(
      <PendingNote title="The service list is being confirmed" pending={question}>
        <p>Content appears here once the business confirms it.</p>
      </PendingNote>,
    )
    expect(
      screen.getByRole('heading', { name: /the service list is being confirmed/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/content appears here/i)).toBeInTheDocument()
    // The question is for us, not the visitor — it must not be visible text.
    expect(screen.queryByText(/Q4:/)).not.toBeInTheDocument()
  })

  it('carries the resolving question into the DOM for traceability', () => {
    const { container } = render(
      <PendingNote title="Pending" pending={question}>
        <p>Soon.</p>
      </PendingNote>,
    )
    const el = container.querySelector('[data-pending-question]')
    expect(el).toBeTruthy()
    expect(el?.getAttribute('data-pending-question')).toBe('Q4: The confirmed service list')
  })
})
