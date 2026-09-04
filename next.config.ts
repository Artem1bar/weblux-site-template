import type { NextConfig } from 'next'

import { legacyRedirects } from './src/lib/redirects'

const nextConfig: NextConfig = {
  // Cutover redirects live in data (src/lib/redirects.ts), not here, so they
  // are unit-testable and the map can be reviewed without reading config.
  async redirects() {
    return legacyRedirects
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // The kind of small-business site this template replaces usually
          // sends none of these. Baseline hardening; CSP is a per-client
          // decision once the third-party surface (analytics, embeds) is known.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
