import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { MobileNav } from './mobile-nav'
import { SkipLink } from './skip-link'
import { footerColumns, primaryNav } from './nav-config'

describe('nav config', () => {
  it('has unique hrefs', () => {
    const hrefs = primaryNav.map((i) => i.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('uses root-relative hrefs, never the old "./page" form', () => {
    for (const item of primaryNav) {
      expect(item.href.startsWith('/')).toBe(true)
    }
  })

  it('gives every item a label', () => {
    for (const item of primaryNav) {
      expect(item.label.trim().length).toBeGreaterThan(0)
    }
  })

  it('covers the pages a small-business site needs reachable', () => {
    const hrefs = primaryNav.flatMap((i) => [i.href, ...(i.children?.map((c) => c.href) ?? [])])
    for (const required of ['/services', '/about', '/team', '/reviews', '/contact']) {
      expect(hrefs).toContain(required)
    }
  })

  it('links the legal pages from the footer', () => {
    const hrefs = footerColumns.flatMap((col) => col.links.map((l) => l.href))
    for (const required of ['/privacy', '/terms', '/accessibility']) {
      expect(hrefs).toContain(required)
    }
  })

  it('every footer link is root-relative and labelled', () => {
    for (const col of footerColumns) {
      expect(col.title.length).toBeGreaterThan(0)
      for (const link of col.links) {
        expect(link.href.startsWith('/')).toBe(true)
        expect(link.label.length).toBeGreaterThan(0)
      }
    }
  })
})

describe('SkipLink', () => {
  it('points at the main landmark', () => {
    render(<SkipLink />)
    const link = screen.getByRole('link', { name: /skip to main content/i })
    expect(link).toHaveAttribute('href', '#main')
  })
})

describe('MobileNav', () => {
  it('renders the nav links in the DOM even while closed', () => {
    // The point: content exists without JavaScript having to reveal it.
    render(<MobileNav />)
    for (const item of primaryNav) {
      expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument()
    }
  })

  it('starts collapsed and reports that through aria-expanded', () => {
    render(<MobileNav />)
    expect(screen.getByRole('button', { name: /menu/i })).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens and closes on click', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)
    const toggle = screen.getByRole('button', { name: /menu/i })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<MobileNav />)
    const toggle = screen.getByRole('button', { name: /menu/i })

    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard('{Escape}')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('labels the panel it controls', () => {
    render(<MobileNav />)
    const toggle = screen.getByRole('button', { name: /menu/i })
    const controls = toggle.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    expect(document.getElementById(controls as string)).toBeTruthy()
  })
})
