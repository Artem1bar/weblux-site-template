import Link from 'next/link'

import { BrandMark } from '@/components/brand/brand-mark'
import { ButtonLink } from '@/components/ui/button'
import { Container } from '@/components/ui/layout'
import { isKnown, isPending, valueOr } from '@/content/maybe'
import { NAME_PLACEHOLDER, site } from '@/content/site'

import { MobileNav } from './mobile-nav'
import { primaryNav } from './nav-config'
import { PhoneLink } from './phone-link'
import { ThemeToggle } from './theme-toggle'

/**
 * Two jobs, in this order: make the phone number reachable in one tap, and give
 * one unambiguous next step. Everything else is secondary.
 *
 * Until Q3 is answered the phone slots simply do not render (PhoneLink returns
 * null), and the header closes up around them. The business name renders its
 * placeholder with the resolving question carried on the element, so the gap
 * is traceable from the DOM without lying to a visitor.
 */
export function Header() {
  return (
    <header className="header-elevate sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <Container width="wide">
        <div className="flex min-h-[--header-h] items-center justify-between gap-4 py-3">
          <Link href="/" className="group flex items-center gap-3 font-bold">
            {/*
              The mark sits as ink in a filled brand disc — the one arrangement
              the contrast suite guarantees in both themes. Hover flips it:
              ink disc, brand mark, the identical pair read the other way round.
            */}
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-on-brand shadow-sm transition-colors duration-300 group-hover:bg-ink group-hover:text-brand sm:h-11 sm:w-11">
              <BrandMark className="h-6 w-6 transition-transform duration-500 group-hover:scale-110 sm:h-7 sm:w-7" />
            </span>
            <span
              className="font-display text-base leading-tight sm:text-lg"
              data-pending-question={isPending(site.name) ? site.name.question : undefined}
            >
              {valueOr(site.name, NAME_PLACEHOLDER)}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-card px-3 font-semibold hover:bg-surface"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            {/*
              Two shapes of the same link. Below sm there is no room for a
              formatted phone number beside a logo, a theme switch and a menu
              button — but local-service businesses get reached for on phones,
              and burying the number two taps deep inside the menu is the wrong
              trade. So small screens get an icon-sized call button and wider
              ones get the number in full. Neither renders while Q3 is open.
            */}
            {isKnown(site.phone) ? (
              <>
                <PhoneLink
                  location="header-mobile"
                  aria-label={`Call ${site.phone.value.display}`}
                  className="press grid h-11 w-11 place-items-center rounded-card text-accent transition-colors duration-200 hover:bg-surface sm:hidden"
                >
                  <PhoneIcon />
                </PhoneLink>
                {/*
                  The visible text is the number; the accessible name says what
                  pressing it does. Screen readers otherwise announce "link,
                  five zero four..." with no indication it dials. The name still
                  contains the visible label, which is what WCAG 2.5.3 asks for.
                */}
                <PhoneLink
                  location="header"
                  aria-label={`Call ${site.phone.value.display}`}
                  className="hidden min-h-11 items-center rounded-card px-3 font-bold text-accent hover:bg-surface sm:inline-flex"
                >
                  {site.phone.value.display}
                </PhoneLink>
              </>
            ) : null}
            <ThemeToggle />
            <ButtonLink href="/contact" size="sm" className="hidden sm:inline-flex">
              Contact us
            </ButtonLink>
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  )
}

function PhoneIcon() {
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
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1Z" />
    </svg>
  )
}
