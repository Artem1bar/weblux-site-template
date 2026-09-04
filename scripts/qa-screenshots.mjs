/**
 * Visual QA sweep: every route, three breakpoints, both themes, plus a
 * console-error / page-error / failed-request check on each load.
 *
 *   npm run build && npx next start --port 3300   # in one terminal
 *   QA_BASE_URL=http://localhost:3300 npm run qa:screenshots
 *
 * Screenshots land in qa-screens/ (gitignored). Scroll-driven reveal
 * animations are pinned to their end state, because a headless full-page
 * capture never scrolls and would otherwise photograph half-empty pages.
 *
 * Chromium comes from @playwright/test, which is already a devDependency —
 * no separate `playwright` install.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'qa-screens')
const base = process.env.QA_BASE_URL ?? 'http://localhost:3300'

/** Keep in step with the route set in e2e/journeys.spec.ts. */
const PAGES = [
  ['home', '/'],
  ['about', '/about'],
  ['services', '/services'],
  ['areas', '/areas'],
  ['team', '/team'],
  ['reviews', '/reviews'],
  ['contact', '/contact'],
  ['privacy', '/privacy'],
  ['terms', '/terms'],
  ['accessibility', '/accessibility'],
  ['styleguide', '/styleguide'],
  ['404', '/this-page-does-not-exist'],
]

const SIZES = [
  ['390', 390, 844],
  ['768', 768, 1024],
  ['1440', 1440, 900],
]

/**
 * Pin every animation to its finished state. The scroll-driven reveals
 * (.reveal, .text-rise, …) hold elements at their `from` keyframe until they
 * enter the viewport; `animation: none` snaps them to the resting values, and
 * the explicit resets cover anything a transition was mid-way through.
 */
const SETTLE = `
  *, *::before, *::after {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
    transition-delay: 0s !important;
    animation-delay: 0s !important;
  }
  .reveal, .reveal-fade, .reveal-wipe, .drift, .spine-draw, .text-rise, .rule-brand::before {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
  }
  html { scroll-behavior: auto !important; }
`

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch()
const problems = []
let shots = 0

// The theme default is system-follow, so the sweep sets an explicit stored
// choice per pass — deterministic regardless of the machine's OS setting.
// THEME_STORAGE_KEY in src/lib/theme-init.ts; keep in step.
for (const theme of ['light', 'dark']) {
  for (const [label, width, height] of SIZES) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    })

    await context.addInitScript((value) => {
      window.localStorage.setItem('site-theme', value)
    }, theme)

    const page = await context.newPage()

    page.on('console', (message) => {
      if (message.type() === 'error') {
        problems.push(`console ${theme}/${width}: ${message.text()}`)
      }
    })
    page.on('pageerror', (error) => {
      problems.push(`pageerror ${theme}/${width}: ${error.message}`)
    })
    page.on('requestfailed', (request) => {
      problems.push(
        `request ${theme}/${width}: ${request.url()} — ${request.failure()?.errorText}`,
      )
    })

    for (const [name, path] of PAGES) {
      const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })

      const expected404 = name === '404'
      if (!response?.ok() && !(expected404 && response?.status() === 404)) {
        problems.push(`http ${path} → ${response?.status()}`)
      }

      const applied = await page.evaluate(
        (theme_) => document.documentElement.getAttribute('data-theme') === theme_,
        theme,
      )
      if (!applied) problems.push(`theme ${theme} did not apply on ${path}`)

      await page.addStyleTag({ content: SETTLE })

      // Walk the page so lazily-loaded images decode and paint. A fullPage
      // capture alone leaves below-the-fold images blank often enough to
      // waste a review pass.
      await page.evaluate(async () => {
        const step = window.innerHeight
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 40))
        }
        window.scrollTo(0, 0)
      })
      // CountUp is a requestAnimationFrame loop, not a CSS transition, so
      // zeroing durations does not finish it. Give any instance time to land
      // on its real number before the capture.
      await page.waitForTimeout(1300)

      await page.screenshot({
        path: join(outDir, `${name}-${theme}-${label}.png`),
        fullPage: true,
      })
      shots += 1
    }

    await context.close()
  }
}

await browser.close()

const report = [
  `${shots} screenshots written to qa-screens/`,
  problems.length === 0
    ? 'no console errors, page errors or failed requests'
    : 'PROBLEMS:',
  ...problems,
].join('\n')

await writeFile(join(outDir, 'report.txt'), `${report}\n`)
console.log(report)

if (problems.length > 0) process.exitCode = 1
