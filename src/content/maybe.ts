/**
 * Client sites get built before the client has answered every question, and the
 * businesses they describe are often licensed and regulated. That makes "we
 * don't know this yet" a first-class state rather than an empty string somebody
 * later mistakes for fact.
 *
 * Anything the client has published or confirmed is `known`. Anything we would
 * have to invent is `pending`, and a pending value has to carry the question
 * that resolves it — cite the standing list in docs/CLIENT-QUESTIONS.md as
 * `Q<n>: <question>`. Rendering code must narrow the union, so there is no path
 * that prints an unverified claim by accident.
 */

export type Known<T> = { readonly known: true; readonly value: T }
export type Pending = { readonly known: false; readonly question: string }
export type Maybe<T> = Known<T> | Pending

export function known<T>(value: T): Known<T> {
  return { known: true, value }
}

export function pending(question: string): Pending {
  if (question.trim().length === 0) {
    throw new Error(
      'pending() needs the question that would resolve it — an untraceable gap is worse than no gap',
    )
  }
  return { known: false, question }
}

export function isKnown<T>(m: Maybe<T>): m is Known<T> {
  return m.known
}

export function isPending<T>(m: Maybe<T>): m is Pending {
  return !m.known
}

/** The value when we have it, otherwise the fallback. Never throws. */
export function valueOr<T>(m: Maybe<T>, fallback: T): T {
  return isKnown(m) ? m.value : fallback
}
