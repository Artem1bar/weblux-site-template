import '@testing-library/jest-dom/vitest'

/**
 * jsdom implements no CSS media queries at all, so `window.matchMedia` is simply
 * absent. Anything that asks the browser about motion preference, colour scheme
 * or viewport therefore throws on render rather than failing a meaningful
 * assertion.
 *
 * The stub answers "no preference" to everything, which is the right default for
 * the suite: it puts components in their *fullest* state — video requested,
 * animations on — so a test exercises the path with the most that can go wrong,
 * rather than the quiet fallback. A test that needs the opposite can override
 * `matchMedia` for its own case.
 */
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

/**
 * IntersectionObserver is likewise missing. The stub never fires, which models
 * "nothing has scrolled into view yet" — the state every component here is
 * required to render correctly in, since that is what a reader sees first and
 * what they keep seeing if the observer never runs.
 */
if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
  class NoopIntersectionObserver implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }
  window.IntersectionObserver = NoopIntersectionObserver as unknown as typeof IntersectionObserver
}
