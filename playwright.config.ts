import { defineConfig, devices } from '@playwright/test'

/**
 * These run against a production build, not `next dev`.
 *
 * The things worth catching here — a redirect that does not fire, a server
 * action that 500s, a prerender that quietly went dynamic — behave differently
 * under the dev server, so testing dev would test something nobody visits.
 */

/**
 * Overridable port, and no server reuse by default.
 *
 * Two client projects built from this template routinely run on one machine.
 * With a fixed port and `reuseExistingServer: true`, project B's e2e run will
 * happily attach to project A's leftover server and green-light the wrong
 * codebase — the worst kind of pass. So each project can pin its own
 * E2E_PORT, and by default the runner refuses to adopt whatever is already
 * listening. Set E2E_REUSE=1 locally when iterating on one project and you
 * accept the risk; CI never reuses.
 */
const PORT = Number(process.env.E2E_PORT ?? 3300)
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    command: `npm run build && npx next start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: Boolean(process.env.E2E_REUSE) && !process.env.CI,
    timeout: 180_000,
  },
})
