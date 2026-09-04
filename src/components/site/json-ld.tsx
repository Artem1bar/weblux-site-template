/**
 * Renders a JSON-LD block.
 *
 * JSON.stringify handles escaping of the data itself; the `<` replacement stops
 * a literal `</script>` inside any string from closing the tag early. None of
 * this content is user-supplied today, but the schema reads from content
 * modules that a future edit will touch.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
