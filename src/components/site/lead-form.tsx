'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { submitLead } from '@/app/actions/submit-lead'
import { Button } from '@/components/ui/button'
import { isKnown } from '@/content/maybe'
import { site } from '@/content/site'
import { cn } from '@/lib/cn'
import { INQUIRY_TYPES } from '@/lib/lead'
import { initialLeadState } from '@/lib/lead-state'

function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
}: {
  label: string
  name: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  const errorId = `${name}-error`
  const hintId = `${name}-hint`

  return (
    <div>
      <label htmlFor={name} className="block font-semibold">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-muted"> (optional)</span>
        )}
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 text-sm text-ink-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

const inputClass =
  'min-h-11 w-full rounded-card border border-border bg-bg px-3 py-2 text-base ' +
  'placeholder:text-ink-muted/70'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" block disabled={pending}>
      {pending ? 'Sending…' : 'Send it through'}
    </Button>
  )
}

export function LeadForm({ className }: { className?: string }) {
  const [state, formAction] = useActionState(submitLead, initialLeadState)
  const errors = state.fieldErrors ?? {}
  // Submitting a <form action> resets uncontrolled inputs once the action
  // resolves, so a rejected form refills itself from what the server echoed
  // back. Without this, missing one field wipes the whole message — on a
  // phone, mid-problem, that is how a lead gets lost.
  const values = state.values ?? {}
  // Remount the fields whenever a fresh response arrives so the browser picks
  // up the new defaultValue instead of keeping the DOM's own state.
  const formKey = state.status + Object.keys(errors).sort().join(',')

  if (state.status === 'success') {
    return (
      <div className={cn('rounded-card border-2 border-accent bg-surface p-6', className)}>
        <h2 className="text-2xl font-bold">{state.message}</h2>
        <p className="mt-3 text-ink-muted">
          We have your details for {state.received?.name} at {state.received?.phone}.
          {isKnown(site.phone) ? ' If this is urgent, calling is faster than waiting.' : ''}
        </p>
        {isKnown(site.phone) ? (
          <a
            href={`tel:${site.phone.value.raw}`}
            className="mt-5 inline-flex min-h-11 items-center rounded-card bg-brand px-5 font-bold text-on-brand"
          >
            Call {site.phone.value.display}
          </a>
        ) : null}
      </div>
    )
  }

  return (
    <form key={formKey} action={formAction} className={cn('space-y-5', className)} noValidate>
      {state.status === 'error' && state.message ? (
        <p
          role="alert"
          className="rounded-card border-2 border-danger bg-surface p-4 font-semibold text-danger"
        >
          {state.message}
        </p>
      ) : null}

      <Field label="Your name" name="name" error={errors.name} required>
        <input
          id="name"
          name="name"
          autoComplete="name"
          className={inputClass}
          defaultValue={values.name ?? ''}
          required
        />
      </Field>

      <Field
        label="Phone"
        name="phone"
        error={errors.phone}
        hint="The fastest way to reach you."
        required
      >
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(555) 555-0142"
          className={inputClass}
          defaultValue={values.phone ?? ''}
          required
        />
      </Field>

      <Field label="What is this about?" name="inquiryType" error={errors.inquiryType} required>
        <select
          id="inquiryType"
          name="inquiryType"
          className={inputClass}
          defaultValue={values.inquiryType ?? ''}
          required
        >
          <option value="" disabled>
            Choose one
          </option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="What do you need?"
        name="message"
        error={errors.message}
        hint="A sentence or two is plenty — what it is, roughly when, anything already underway."
        required
      >
        <textarea
          id="message"
          name="message"
          rows={5}
          className={inputClass}
          defaultValue={values.message ?? ''}
          required
        />
      </Field>

      <Field label="Email" name="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          defaultValue={values.email ?? ''}
        />
      </Field>

      <Field label="Address" name="address" error={errors.address}>
        <input
          id="address"
          name="address"
          autoComplete="street-address"
          className={inputClass}
          defaultValue={values.address ?? ''}
        />
      </Field>

      {/*
        Honeypot. Hidden from people and from screen readers, visible to naive
        bots. A real submission leaves it empty.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />

      <p className="text-sm text-ink-muted">
        No cost, and no obligation.
        {isKnown(site.phone) ? (
          <>
            {' '}
            Prefer to talk?{' '}
            <a
              href={`tel:${site.phone.value.raw}`}
              className="font-semibold text-accent hover:underline"
            >
              Call {site.phone.value.display}
            </a>
            .
          </>
        ) : null}
      </p>
    </form>
  )
}
