import { services } from '@/content/services'

export type NavItem = {
  href: string
  label: string
  children?: { href: string; label: string }[]
}

/**
 * One source of truth for navigation. Header, mobile nav, footer and sitemap.ts
 * all read from here, so a new page cannot end up reachable from one and not
 * the others. nav.test.tsx and seo.test.ts hold the two ends together.
 */
export const primaryNav: NavItem[] = [
  {
    href: '/services',
    label: 'Services',
    children: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
  },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/contact', label: 'Contact' },
]

export type FooterColumn = {
  title: string
  links: { href: string; label: string }[]
}

/**
 * Footer columns. The services column derives from the content module, so it
 * simply renders empty-handed (and the footer hides it) until Q4 is answered.
 */
export const footerColumns: FooterColumn[] = [
  {
    title: 'Services',
    links: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title })),
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/team', label: 'The team' },
      { href: '/reviews', label: 'Reviews' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'More',
    links: [
      { href: '/areas', label: 'Areas we serve' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/accessibility', label: 'Accessibility' },
    ],
  },
]
