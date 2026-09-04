import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Written as .mjs resolving to .mts: Vite's native config loader warns on
// extensionless relative imports, and TypeScript rejects a literal .ts
// specifier unless allowImportingTsExtensions is on. The ESM form satisfies
// both without loosening tsconfig.
import { staticImagePlugin } from './test/static-image-plugin.mjs'

export default defineConfig({
  plugins: [staticImagePlugin(), react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // `server-only` throws on import under any non-server condition, and
      // jsdom is one. The guard still holds in the real build — this only stops
      // it firing when a test renders a client component whose import graph
      // reaches a server module.
      'server-only': new URL('./test/server-only-stub.ts', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/layout.tsx'],
    },
  },
})
