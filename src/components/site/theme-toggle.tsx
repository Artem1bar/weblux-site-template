'use client'

import { THEME_STORAGE_KEY } from '@/lib/theme-init'

/**
 * Light/dark switch.
 *
 * The button renders *both* icons and both labels, and CSS in globals.css shows
 * exactly one. Because the hidden half is `display: none` it is dropped from the
 * accessibility tree too, so the button's accessible name is always the one
 * matching what a press will actually do — and no script has to run before it is
 * correct, which rules out both a hydration mismatch and a flicker on load.
 *
 * The click handler reads the theme off the document, falling back to the OS
 * preference when no explicit choice is set — because the template default is
 * system-follow (see the theme block in globals.css). Forcing one reviewed
 * theme on everyone is a per-brand decision; if a client makes it, change the
 * globals.css policy and this fallback together, or the first press will
 * appear to do nothing for half the visitors.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement
    const explicit = root.getAttribute('data-theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const current = explicit ?? (systemDark ? 'dark' : 'light')
    const next = current === 'dark' ? 'light' : 'dark'

    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Private modes throw on write. The theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`press grid h-11 w-11 place-items-center rounded-card text-ink transition-colors duration-200 hover:bg-surface ${className ?? ''}`}
    >
      {/* Shown on a light page: clicking goes dark. */}
      <span className="theme-when-light contents">
        <span className="sr-only">Switch to dark theme</span>
        <MoonIcon />
      </span>
      {/* Shown on a dark page: clicking goes light. */}
      <span className="theme-when-dark contents">
        <span className="sr-only">Switch to light theme</span>
        <SunIcon />
      </span>
    </button>
  )
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}
