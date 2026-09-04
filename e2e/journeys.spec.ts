import { expect, test } from '@playwright/test'

import { legacyRedirects } from '../src/lib/redirects'

/**
 * The journeys that have to work, end to end, on a real production build.
 *
 * Chosen by what actually loses a small business a customer rather than by
 * what is easy to assert: submitting the contact form, dialable phone links,
 * finding your way on a phone, and honest pages while content is pending.
 * Unit tests already cover the content layer and the validation rules; these
 * cover the parts only a browser can tell you about.
 *
 * Delivery note: the e2e environment sets no RESEND_API_KEY/LEAD_NOTIFY_TO,
 * so a successful submission exercises the console-notifier path — the
 * success screen proves the action ran and answered; no real email is ever
 * attempted here.
 */

const ALL_ROUTES = [
  '/',
  '/about',
  '/services',
  '/areas',
  '/team',
  '/reviews',
  '/contact',
  '/privacy',
  '/terms',
  '/accessibility',
  '/styleguide',
]

test.describe('the contact form', () => {
  test('rejects an incomplete submission without losing what was typed', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel(/your name/i).fill('Jordan Boudreaux')
    await page
      .getByLabel(/what do you need/i)
      .fill('The unit in the kitchen stopped working and we need someone this week.')
    // Phone deliberately left empty.
    await page.getByRole('button', { name: /send it through/i }).click()

    // One alert per bad field plus a summary is the intended behaviour, so
    // assert the specific message rather than "an alert".
    await expect(page.getByText(/we need a phone number to call you back/i)).toBeVisible()
    await expect(page.getByText(/please check the highlighted fields/i)).toBeVisible()

    // The whole point of a server action returning state: the visitor does not
    // retype what they already typed.
    await expect(page.getByLabel(/your name/i)).toHaveValue('Jordan Boudreaux')
    await expect(page.getByLabel(/what do you need/i)).toHaveValue(
      'The unit in the kitchen stopped working and we need someone this week.',
    )
  })

  test('accepts a complete submission and confirms what was received', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel(/your name/i).fill('Jordan Boudreaux')
    await page.getByLabel(/phone/i).fill('(555) 555-0142')
    await page.getByLabel(/what is this about/i).selectOption({ index: 1 })
    await page
      .getByLabel(/what do you need/i)
      .fill('The unit in the kitchen stopped working and we need someone this week.')

    await page.getByRole('button', { name: /send it through/i }).click()

    // Echoing the details back is what makes it credible that anything
    // happened. With delivery unconfigured the server logged the lead — the
    // form must still tell the visitor the truth about receipt.
    await expect(page.getByText(/got it/i)).toBeVisible()
    await expect(page.getByText(/jordan boudreaux/i)).toBeVisible()
  })

  test('a filled honeypot is refused', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel(/your name/i).fill('Spam Bot')
    await page.getByLabel(/phone/i).fill('(555) 555-0142')
    await page.getByLabel(/what is this about/i).selectOption({ index: 1 })
    await page.getByLabel(/what do you need/i).fill('Buy cheap things at this link right now.')
    // Hidden from people, irresistible to naive bots.
    await page.locator('input[name="website"]').fill('https://example.com')

    await page.getByRole('button', { name: /send it through/i }).click()

    // Refused, and refused the same way an ordinary validation failure looks —
    // a bot learns nothing about why it was rejected.
    await expect(page.getByText(/please check the highlighted fields/i)).toBeVisible()
    await expect(page.getByText(/got it/i)).toHaveCount(0)
  })
})

test.describe('reaching a human', () => {
  test('every tel: link on the site dials an E.164 number', async ({ page }) => {
    // The phone number ships pending (Q3), so today this asserts zero
    // malformed links; the moment a number lands, it asserts every link
    // dials clean. Formatted hrefs with spaces and parens get rejected by
    // some dialers, which is exactly the bug this exists to catch.
    for (const route of ALL_ROUTES) {
      await page.goto(route)
      const hrefs = await page
        .locator('a[href^="tel:"]')
        .evaluateAll((links) => links.map((l) => l.getAttribute('href')))
      for (const href of hrefs) {
        expect(href, `tel link on ${route}`).toMatch(/^tel:\+\d{7,15}$/)
      }
    }
  })
})

test.describe('finding your way', () => {
  test('a visitor can get from the homepage to the services page', async ({ page, isMobile }) => {
    await page.goto('/')

    if (isMobile) {
      await page.getByRole('button', { name: /menu/i }).click()
    }
    await page.getByRole('link', { name: 'Services', exact: true }).first().click()

    await expect(page).toHaveURL(/\/services$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Services')
  })

  test('the mobile menu opens, and closes on Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'the menu button only exists below lg')
    await page.goto('/')

    const toggle = page.getByRole('button', { name: /menu/i })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(
      page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: /contact/i }),
    ).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  test('every page has exactly one h1', async ({ page }) => {
    for (const route of ALL_ROUTES) {
      await page.goto(route)
      // Sites that pick heading tags by how big they want the text end up
      // with zero h1 elements — pinned here across the whole route set.
      await expect(page.locator('h1'), `h1 count on ${route}`).toHaveCount(1)
    }
  })
})

test.describe('honest placeholders', () => {
  test('no page renders a raw pending value outside a data-pending-question carrier', async ({
    page,
  }) => {
    for (const route of ALL_ROUTES) {
      await page.goto(route)

      // The question strings are for the DOM attribute, never for visitors.
      const bodyText = (await page.locator('body').innerText()).replace(/\s+/g, ' ')
      expect(bodyText, `raw pending question leaked on ${route}`).not.toMatch(/Q\d+: /)
      expect(bodyText, `pending object dumped on ${route}`).not.toContain('[object Object]')
    }
  })

  test('the pages built on pending content carry their resolving questions in the DOM', async ({
    page,
  }) => {
    for (const route of ['/services', '/areas', '/team', '/reviews', '/privacy', '/terms']) {
      await page.goto(route)
      const notes = page.locator('[data-pending-question]')
      expect(await notes.count(), `no pending marker on ${route}`).toBeGreaterThan(0)
      for (const question of await notes.evaluateAll((els) =>
        els.map((el) => el.getAttribute('data-pending-question')),
      )) {
        expect(question, `malformed question on ${route}`).toMatch(/^Q\d+: /)
      }
    }
  })
})

test.describe('the old site', () => {
  test('bookmarked legacy URLs land somewhere useful', async ({ page }) => {
    // The map ships empty (Q12); this walk binds the moment it fills in.
    test.skip(legacyRedirects.length === 0, 'no legacy redirects configured yet')

    for (const { source, destination } of legacyRedirects) {
      const response = await page.goto(source)
      expect(response?.status(), `${source} should not error`).toBeLessThan(400)
      expect(page.url(), `${source} should redirect`).toContain(destination)
    }
  })
})

test.describe('what a reader gets before the JavaScript does', () => {
  test('content is readable with JavaScript disabled', async ({ browser }) => {
    // Nothing on this template may depend on script to be read: reveal motion
    // is CSS-only, nav links are in the DOM from the server, and the form is
    // a real <form action>. This is the test that keeps it that way.
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()

    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByText(/services/i).first()).toBeVisible()

    await page.goto('/contact')
    await expect(page.getByLabel(/your name/i)).toBeVisible()
    await expect(page.getByLabel(/what do you need/i)).toBeVisible()

    await context.close()
  })
})
