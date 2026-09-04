/**
 * Lives outside the `'use server'` module on purpose.
 *
 * A file marked `'use server'` may only export async functions — every export
 * becomes a callable server action. Exporting the state type and its initial
 * value from there compiles and builds clean, then throws at request time:
 * `A "use server" file can only export async functions, found object.`
 */
export type LeadState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  /** Field name -> first error, for inline display. */
  fieldErrors?: Record<string, string>
  /** Echoed back on success so the visitor can see what we received. */
  received?: { name: string; phone: string }
  /**
   * What was submitted, echoed back so the form can refill itself after a
   * rejection.
   *
   * Submitting a `<form action={…}>` resets uncontrolled inputs once the action
   * resolves, so without this a visitor who misses one field loses everything
   * they typed — often on a phone, mid-problem. Asking them to type it twice is
   * how a lead gets lost. Never populated on success, where the form is
   * replaced anyway.
   */
  values?: Record<string, string>
}

export const initialLeadState: LeadState = { status: 'idle' }
