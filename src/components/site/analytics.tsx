'use client'

import Script from 'next/script'

import { gaEnabled } from '@/lib/analytics'

/**
 * GA4, loaded only when a valid measurement id is configured. afterInteractive
 * so it never competes with the page a visitor is actually trying to read.
 *
 * No consent banner is wired up here. Before this is switched on for a
 * production audience, confirm what the client needs for privacy disclosure —
 * docs/CLIENT-QUESTIONS.md Q11, and Q9 where the privacy page states it.
 */
export function GoogleAnalytics({ id }: { id: string | undefined }) {
  if (!gaEnabled(id)) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  )
}
