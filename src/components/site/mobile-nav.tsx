'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

import { isKnown } from '@/content/maybe'
import { site } from '@/content/site'
import { cn } from '@/lib/cn'

import { primaryNav } from './nav-config'
import { PhoneLink } from './phone-link'

/**
 * The panel's links are always in the DOM. Opening toggles a class, it does not
 * mount content — so the markup is complete for crawlers and assistive tech
 * regardless of whether the toggle has been pressed, and regardless of whether
 * the JavaScript ever arrives.
 */
export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <div className={cn('lg:hidden', className)}>
      {/*
        The word "Menu" is dropped below sm, not because it is unimportant but
        because a 360px header with a call button, a theme switch and this
        toggle otherwise runs past the viewport and produces a horizontally
        scrolling page. aria-label carries the name either way, so the button
        is still announced as "Menu" when the text is not painted.
      */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-card border border-border px-2 font-semibold sm:px-3"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {open ? '✕' : '☰'}
        </span>
        <span aria-hidden="true" className="hidden sm:inline">
          Menu
        </span>
      </button>

      <div
        id={panelId}
        ref={panelRef}
        // hidden only mirrors state for AT; the links stay in the document.
        className={cn(
          'absolute inset-x-0 top-full border-b border-border bg-bg shadow-lg',
          open ? 'block' : 'hidden',
        )}
      >
        <nav aria-label="Mobile" className="px-5 py-4">
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-card px-2 text-lg font-semibold hover:bg-surface"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 border-t border-border pt-4">
            {/*
              PhoneLink, not a bare tel: anchor. A raw anchor here means every
              call started from the mobile menu — the most likely place on the
              whole site for one — goes unmeasured, which quietly defeats the
              point of tracking calls at all. Renders nothing while Q3 is open.
            */}
            {isKnown(site.phone) ? (
              <PhoneLink
                location="mobile-nav"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-card bg-brand px-4 font-bold text-on-brand"
              >
                Call {site.phone.value.display}
              </PhoneLink>
            ) : null}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-card bg-accent px-4 font-bold text-on-accent"
            >
              Contact us
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}
