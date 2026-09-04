import Link from 'next/link'

export type Crumb = { href: string; label: string }

/**
 * Rendered as a real ordered list inside a labelled nav. The JSON-LD
 * BreadcrumbList that mirrors this reads from the same array, so the two
 * cannot disagree.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-ink hover:underline">
                  {crumb.label}
                </Link>
              )}
              {isLast ? null : (
                <span aria-hidden="true" className="text-border">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
