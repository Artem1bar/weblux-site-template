import type { Crumb } from '@/components/site/breadcrumbs'
import { areas } from '@/content/areas'
import { faqs } from '@/content/faq'
import { isKnown } from '@/content/maybe'
import type { Service } from '@/content/services'
import { services } from '@/content/services'
import type { Site } from '@/content/site'
import { site } from '@/content/site'
import type { TeamMember } from '@/content/team'
import { team } from '@/content/team'

import { absoluteUrl, siteUrl } from './site-url'

/**
 * JSON-LD for a local service business.
 *
 * The honesty rule bites harder here than anywhere else: structured data is
 * read by machines that will republish it, so a placeholder name or a guessed
 * opening-hours block becomes "fact" in a knowledge panel. Every builder below
 * therefore emits only confirmed values, and `localBusinessSchema` returns
 * null outright until the identity facts exist — no JSON-LD is better than
 * fabricated JSON-LD.
 *
 * Deliberately absent, always: aggregateRating and review markup (unverifiable
 * reviews are not a rating, and inventing one risks a manual action on top of
 * being a lie), and openingHoursSpecification unless the client commits to
 * hours that map to it.
 */

const ORG_ID = `${siteUrl}/#organization`

export function localBusinessSchema(s: Site = site) {
  // Name and one reachable contact channel are the floor for a useful
  // LocalBusiness node. Below it, emit nothing.
  if (!isKnown(s.name) || !isKnown(s.phone)) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService' as const,
    '@id': ORG_ID,
    name: s.name.value,
    url: siteUrl,
    telephone: s.phone.value.raw,
    ...(isKnown(s.email) ? { email: s.email.value } : {}),
    ...(isKnown(s.foundedYear) ? { foundingDate: String(s.foundedYear.value) } : {}),
    ...(isKnown(s.tagline) ? { slogan: s.tagline.value } : {}),
    ...(isKnown(s.address)
      ? {
          address: {
            '@type': 'PostalAddress' as const,
            streetAddress: s.address.value.street,
            addressLocality: s.address.value.city,
            addressRegion: s.address.value.region,
            postalCode: s.address.value.postalCode,
            addressCountry: s.address.value.country,
          },
        }
      : {}),
    ...(areas.length > 0
      ? {
          areaServed: areas.map((area) => ({
            '@type': 'AdministrativeArea' as const,
            name: area.name,
          })),
        }
      : {}),
    ...(services.length > 0
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog' as const,
            name: 'Services',
            itemListElement: services.map((service) => ({
              '@type': 'Offer' as const,
              itemOffered: {
                '@type': 'Service' as const,
                name: service.title,
                description: service.summary,
                url: absoluteUrl(`/services/${service.slug}`),
              },
            })),
          },
        }
      : {}),
    // Reference the Person nodes by @id rather than restating them, so the
    // graph stays consistent with what /team/[slug] emits.
    ...(team.length > 0
      ? { employee: team.map((member) => ({ '@id': absoluteUrl(`/team/${member.slug}#person`) })) }
      : {}),
    // Only emitted once the client supplies them.
    ...(isKnown(s.socialProfiles) ? { sameAs: s.socialProfiles.value } : {}),
  }
}

export function personSchema(member: TeamMember) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person' as const,
    '@id': absoluteUrl(`/team/${member.slug}#person`),
    // What the site publishes. member.fullName may be pending, and we never
    // guess at a real person's name.
    name: member.displayName,
    jobTitle: member.role,
    description: member.bio[0],
    knowsAbout: member.credentials,
    worksFor: { '@id': ORG_ID },
    url: absoluteUrl(`/team/${member.slug}`),
  }
}

export function serviceSchema(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service' as const,
    name: service.title,
    description: service.summary,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { '@id': ORG_ID },
    ...(areas.length > 0
      ? {
          areaServed: areas.map((area) => ({
            '@type': 'AdministrativeArea' as const,
            name: area.name,
          })),
        }
      : {}),
  }
}

/** Null while the FAQ list is empty — a FAQPage with no questions is noise. */
export function faqSchema() {
  if (faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage' as const,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question' as const,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: faq.answer,
      },
    })),
  }
}

export function breadcrumbSchema(trail: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList' as const,
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem' as const,
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.href),
    })),
  }
}
