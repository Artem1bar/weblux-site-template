import { pending, type Pending } from './maybe'

export type Faq = {
  question: string
  answer: string
}

/**
 * Deliberately empty. FAQ answers read as the business speaking — about its
 * process, its terms, its trade — and every one of those is a claim the client
 * has to stand behind. Answers about a regulated trade can also drift into
 * legal or financial advice, so the wording is the client's call (Q9 where it
 * touches compliance). These feed the FAQPage JSON-LD once present.
 */
export const faqs: Faq[] = []

export const faqsPending: Pending = pending(
  'Q4: FAQ — the questions customers actually ask, with answers the client signs off',
)
