import { type Maybe, pending } from './maybe'

export type Address = {
  street: string
  city: string
  region: string
  postalCode: string
  country: string
}

export type Phone = {
  /** E.164 for the tel: href, e.g. +15045550100. Some dialers reject anything else. */
  raw: string
  /** Formatted for humans, e.g. (504) 555-0100. */
  display: string
}

export type Site = {
  /** Trading name, as the client presents it. */
  name: Maybe<string>
  /** Registered legal entity, where it differs from the trading name. */
  legalName: Maybe<string>
  /** The one-line promise. The client's voice, not ours. */
  tagline: Maybe<string>
  foundedYear: Maybe<number>
  phone: Maybe<Phone>
  email: Maybe<string>
  address: Maybe<Address>
  hours: Maybe<string>
  /** Licence / registration numbers, where the trade is regulated. */
  licenseNumber: Maybe<string>
  /** Google Business Profile and social URLs, for JSON-LD sameAs. */
  socialProfiles: Maybe<string[]>
}

/**
 * Every field ships pending. This is the template's whole discipline: nothing
 * on the rendered site asserts a fact about a business until the client has
 * confirmed it. Components either hide the affected element or render a
 * PendingNote carrying the question, so an unfinished site is traceable from
 * the DOM and never a lie.
 *
 * When a value arrives, replace `pending(...)` with `known(...)` here and
 * nowhere else.
 */
export const site: Site = {
  name: pending('Q1: Trading name of the business, exactly as the client presents it'),
  legalName: pending('Q1: Registered legal entity name and structure'),
  tagline: pending('Q1: The one-line promise, in the client’s own published words'),
  foundedYear: pending('Q1: Founding year, as the business itself states it'),
  phone: pending('Q3: Primary phone number, and whether it is the one to publish'),
  email: pending('Q3: Public contact email, and where it is actually read'),
  address: pending('Q3: Published business address, if the client publishes one'),
  hours: pending('Q1: Opening hours, as the business commits to them'),
  licenseNumber: pending('Q9: Licence / registration numbers required or expected for this trade'),
  socialProfiles: pending('Q13: Google Business Profile and social URLs to link'),
}

/**
 * What the UI shows wherever the business would be named, until Q1 is answered.
 * Deliberately reads as a placeholder — it must never be mistakable for a real
 * brand, which is why it is not "Acme" or anything name-shaped.
 */
export const NAME_PLACEHOLDER = 'Your Business Name'

/**
 * A constant rather than `new Date().getFullYear()`: the footer year is part of
 * the reviewed page, and a build artefact that silently changes on New Year's
 * Eve is a tiny lie about when anyone last looked at the site.
 */
export const CURRENT_YEAR = 2026
