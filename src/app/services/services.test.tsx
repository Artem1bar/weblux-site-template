import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { services } from '@/content/services'

import ServicesIndex from './page'
import { generateStaticParams } from './[slug]/page'

describe('services index (all-pending state)', () => {
  it('has exactly one h1', () => {
    const { container } = render(<ServicesIndex />)
    expect(container.querySelectorAll('h1')).toHaveLength(1)
  })

  it('renders the pending note, traceable to Q4, while the list is empty', () => {
    const { container } = render(<ServicesIndex />)
    const note = container.querySelector('[data-pending-question]')
    expect(note).toBeTruthy()
    expect(note?.getAttribute('data-pending-question')).toMatch(/^Q4: /)
  })

  it('never renders a raw pending question as visible text', () => {
    const { container } = render(<ServicesIndex />)
    expect(container.textContent).not.toMatch(/Q\d+: /)
  })

  it('invents no service links', () => {
    const { container } = render(<ServicesIndex />)
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))
    expect(hrefs.filter((h) => h?.startsWith('/services/'))).toHaveLength(0)
  })
})

describe('service detail', () => {
  it('prerenders one param per confirmed service — zero today', async () => {
    const params = await generateStaticParams()
    expect(params.map((p) => p.slug).sort()).toEqual(services.map((s) => s.slug).sort())
    expect(params).toHaveLength(0)
  })
})
