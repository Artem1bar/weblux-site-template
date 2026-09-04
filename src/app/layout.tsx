import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { GoogleAnalytics } from '@/components/site/analytics'
import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { SkipLink } from '@/components/site/skip-link'
import { valueOr } from '@/content/maybe'
import { NAME_PLACEHOLDER, site } from '@/content/site'
import { siteUrl } from '@/lib/site-url'
import { themeInitScript } from '@/lib/theme-init'
import { dark, light } from '@/styles/tokens'

import './globals.css'

/**
 * SWAP PER BRAND (Q6). The template loads one deliberately neutral face and
 * feeds it to both slots — `--font-sans` and `--font-display` in globals.css
 * read the same `--font-body` variable. A brand build usually splits them: a
 * body face here, a display face with some personality (variable axes and all)
 * in a second next/font call, and its own variable wired into
 * `--font-display`. Keep `display: "swap"` — type must never block paint.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

const siteName = valueOr(site.name, NAME_PLACEHOLDER)

export const metadata: Metadata = {
  // Makes every relative canonical, OG image and alternate resolve absolutely.
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s — ${siteName}`,
  },
  // Deliberately claim-free until the client's positioning is confirmed (Q1):
  // a meta description is the one line of copy search engines quote back.
  description: 'This site is being prepared. Content appears here once the business confirms it.',
  // The class of old site this replaces usually has no canonical on any page.
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName,
    locale: 'en_US',
    url: '/',
    title: siteName,
    description: 'This site is being prepared.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  // No keywords tag: a signal search engines stopped using.
}

// Mirrors the theme policy in globals.css: follow the OS by default. Keying
// this off prefers-color-scheme keeps a dark phone's browser chrome from
// glowing white above a dark page (and vice versa).
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: light.bg },
    { media: '(prefers-color-scheme: dark)', color: dark.bg },
  ],
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: themeInitScript sets data-theme on this element
    // before hydration, so the client html tag legitimately differs from the server's.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-ink antialiased">
        <SkipLink />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics id={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  )
}
