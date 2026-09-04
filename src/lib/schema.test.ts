import { describe, expect, it } from 'vitest'

import { known } from '@/content/maybe'
import type { Site } from '@/content/site'
import { site } from '@/content/site'
import type { TeamMember } from '@/content/team'
import { pending } from '@/content/maybe'

import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  personSchema,
  serviceSchema,
} from './schema'
import { siteUrl } from './site-url'

/** A site with the identity facts confirmed, for exercising the known path. */
const confirmedSite: Site = {
  name: known('Example Plumbing Co.'),
  legalName: known('Example Plumbing LLC'),
  tagline: known('Plumbing, done properly.'),
  foundedYear: known(1990),
  phone: known({ raw: '+15555550142', display: '(555) 555-0142' }),
  email: known('office@example.com'),
  address: known({
    street: '1 Main St',
    city: 'Springfield',
    region: 'LA',
    postalCode: '70001',
    country: 'US',
  }),
  hours: known('Mon–Fri 8–5'),
  licenseNumber: pending('Q9: licence number for the footer and schema'),
  socialProfiles: known(['https://example.com/profile']),
}

describe('localBusiness schema', () => {
  it('emits nothing while identity is pending — no fabricated data for machines', () => {
    // The template's default site has every fact pending, so the honest
    // structured-data output is no structured data at all.
    expect(localBusinessSchema(site)).toBeNull()
  })

  it('emits a full node once the identity facts are confirmed', () => {
    const s = localBusinessSchema(confirmedSite)
    expect(s).not.toBeNull()
    expect(s!['@context']).toBe('https://schema.org')
    expect(s!['@type']).toBe('ProfessionalService')
    expect(s!.name).toBe('Example Plumbing Co.')
    expect(s!.telephone).toBe('+15555550142')
    expect(s!.email).toBe('office@example.com')
    expect(s!.address?.streetAddress).toBe('1 Main St')
    expect(s!.sameAs).toEqual(['https://example.com/profile'])
    expect(s!['@id']).toBe(`${siteUrl}/#organization`)
  })

  it('omits, rather than guesses, the fields that stay pending', () => {
    const partial: Site = {
      ...confirmedSite,
      email: pending('Q3: email'),
      address: pending('Q3: address'),
    }
    const s = localBusinessSchema(partial)
    expect(s).not.toBeNull()
    expect(s).not.toHaveProperty('email')
    expect(s).not.toHaveProperty('address')
  })

  it('never invents an aggregate rating or opening hours', () => {
    const s = localBusinessSchema(confirmedSite)
    // Unverifiable reviews are not a rating, and "by appointment" is not an
    // openingHoursSpecification. Faking either risks a manual action on top
    // of being a lie.
    expect(s).not.toHaveProperty('aggregateRating')
    expect(s).not.toHaveProperty('review')
    expect(s).not.toHaveProperty('openingHoursSpecification')
  })
})

describe('person schema', () => {
  it('describes a member without inventing a full name', () => {
    const member: TeamMember = {
      slug: 'sam-r',
      displayName: 'Sam R.',
      fullName: pending('Q7: full name for Sam R.'),
      role: 'Technician',
      credentials: ['Licensed since 2010'],
      bio: ['Sam has run the service desk since 2010.'],
      headshot: pending('Q7: headshot for Sam R.'),
    }
    const s = personSchema(member)
    expect(s['@type']).toBe('Person')
    // displayName is what the site publishes; the pending fullName never leaks.
    expect(s.name).toBe('Sam R.')
    expect(s.jobTitle).toBe('Technician')
    expect(s.worksFor['@id']).toBe(`${siteUrl}/#organization`)
    expect(s.url).toBe(`${siteUrl}/team/sam-r`)
  })
})

describe('service schema', () => {
  it('links a service back to the provider', () => {
    const s = serviceSchema({
      slug: 'repair',
      title: 'Repair',
      summary: 'We repair the thing properly the first time.',
      body: ['Long form.'],
      covers: [],
      whenYouNeedIt: 'When it broke.',
      cta: 'See how repair works',
      featured: true,
    })
    expect(s['@type']).toBe('Service')
    expect(s.name).toBe('Repair')
    expect(s.provider['@id']).toBe(`${siteUrl}/#organization`)
    expect(s.url).toBe(`${siteUrl}/services/repair`)
  })
})

describe('faq schema', () => {
  it('is null while the faq list is empty — a FAQPage with no questions is noise', () => {
    expect(faqSchema()).toBeNull()
  })
})

describe('breadcrumb schema', () => {
  it('numbers positions from 1 and resolves absolute item URLs', () => {
    const s = breadcrumbSchema([
      { href: '/', label: 'Home' },
      { href: '/services', label: 'Services' },
    ])
    expect(s['@type']).toBe('BreadcrumbList')
    expect(s.itemListElement[0].position).toBe(1)
    expect(s.itemListElement[1].position).toBe(2)
    expect(s.itemListElement[1].item).toBe(`${siteUrl}/services`)
  })
})
