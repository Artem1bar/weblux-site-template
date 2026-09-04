#!/usr/bin/env bash
# Runs axe-core against every route in one theme and prints violations.
#
#   ./scripts/a11y.sh [light|dark]
#
# Prerequisites, both machine-specific:
#   - a server on http://localhost:3000  (npm run build && npx next start)
#   - the gstack `browse` headless browser CLI at
#     ~/.claude/skills/gstack/browse/dist/browse — this script drives pages
#     through it rather than through Playwright, because browse keeps one warm
#     session across routes. Without gstack installed the script exits early;
#     that is expected on machines that do not carry the toolchain.
#
# axe covers the mechanical half of accessibility: contrast, accessible names,
# roles, landmark structure, heading order. The half it cannot judge — whether
# the focus order makes sense, whether alt text is honest, whether a reveal
# hides something — still needs a person.
#
# axe.run resolves a promise, and `browse eval` does not await one, so the
# result is parked on window and polled.
set -uo pipefail
cd "$(dirname "$0")/.."

B="$HOME/.claude/skills/gstack/browse/dist/browse"
if [ ! -x "$B" ]; then
  echo "gstack browse CLI not found at $B — install gstack, or adapt this script to another driver." >&2
  exit 2
fi

THEME="${1:-light}"
# browse only reads scripts under /private/tmp or the cwd, so the scratch dir
# has to live in one of them — mktemp -d lands in /var/folders and is refused.
TMP="/private/tmp/site-a11y-$$"
mkdir -p "$TMP"
trap 'rm -rf "$TMP"' EXIT

cat node_modules/axe-core/axe.min.js > "$TMP/inject.js"
echo ";'injected'" >> "$TMP/inject.js"

cat > "$TMP/run.js" <<'RUN'
window.__axeDone = false; window.__axeOut = null;
window.axe.run(document, {
  resultTypes: ['violations'],
  runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice'] },
}).then(function (r) {
  window.__axeOut = JSON.stringify(r.violations.map(function (v) {
    return { id: v.id, impact: v.impact, n: v.nodes.length, help: v.help,
             where: v.nodes.slice(0, 3).map(function (n) { return n.target.join(' ') }) }
  }));
  window.__axeDone = true;
}).catch(function (e) {
  window.__axeOut = JSON.stringify([{ id: 'axe-error', impact: 'error', n: 0, help: String(e), where: [] }]);
  window.__axeDone = true;
});
'started'
RUN

# Keep in step with the route set in e2e/journeys.spec.ts.
ROUTES="/ /about /services /areas /team /reviews /contact /privacy /terms /accessibility /styleguide"
total=0

for route in $ROUTES; do
  "$B" goto "http://localhost:3000${route}" >/dev/null 2>&1
  # The theme default is system-follow; force the requested theme so the run
  # is deterministic regardless of the machine's OS setting.
  "$B" js "document.documentElement.setAttribute('data-theme','${THEME}'); 'ok'" >/dev/null 2>&1
  sleep 1
  "$B" eval "$TMP/inject.js" >/dev/null 2>&1
  "$B" eval "$TMP/run.js" >/dev/null 2>&1

  json=""
  for _ in 1 2 3 4 5 6 7 8; do
    sleep 1
    out=$("$B" js "window.__axeDone ? window.__axeOut : ''" 2>/dev/null | tail -1)
    case "$out" in
      \[*) json="$out"; break ;;
    esac
  done

  if [ -z "$json" ]; then
    printf "%-34s TIMED OUT\n" "$route"; continue
  fi

  count=$(printf '%s' "$json" | jq 'length' 2>/dev/null || echo 0)
  printf "%-34s %s\n" "$route" "$count"
  if [ "$count" != "0" ]; then
    printf '%s' "$json" | jq -r '.[] | "    [\(.impact)] \(.id) x\(.n): \(.help)\n      → \(.where | join(" | "))"' 2>/dev/null
    total=$((total + count))
  fi
done

echo "─────────────────────────────────────"
echo "theme=$THEME   total violations: $total"
[ "$total" -eq 0 ]
