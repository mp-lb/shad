import assert from "node:assert/strict"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { JsonViewer } from "../registry/json-viewer/json-viewer.tsx"
import { JsonViewer as DocsJsonViewer } from "../apps/docs/components/json-viewer.tsx"
import { StructuredLogViewer } from "../registry/structured-log-viewer/structured-log-viewer.tsx"

const event = { eventType: "test.completed", details: { result: "success" } }
const render = <P extends object>(component: React.ComponentType<P>, props: P) => renderToStaticMarkup(React.createElement(component, props))

for (const [name, component] of [["registry", JsonViewer], ["docs", DocsJsonViewer]] as const) {
  test(`${name}: toolbar uses vertical icons with the correct actions`, () => {
    const html = render(component, { data: event })
    assert.match(html, /aria-label="Expand all"[^>]*><svg[^>]*lucide-unfold-vertical/)
    assert.match(html, /aria-label="Collapse all"[^>]*><svg[^>]*lucide-fold-vertical/)
    assert.doesNotMatch(html, /lucide-(?:unfold|fold)-horizontal/)
  })
  test(`${name}: standalone JSON retains its card`, () => {
    const html = render(component, { data: event })
    assert.match(html, /data-slot="json-viewer" class="[^"]*rounded-xl border [^"]*bg-card shadow-sm/)
  })
}

test("expanded logs render JSON without a nested card or surrounding padding", () => {
  const html = render(StructuredLogViewer, { events: [event], defaultExpanded: true })
  assert.match(html, /aria-expanded="true"/)
  assert.match(html, /<div class="border-t border-border\/40 bg-muted\/10"><div data-slot="json-viewer"/)
  const match = html.match(/data-slot="json-viewer" class="([^"]*)"/)
  assert.ok(match)
  const classes = match[1].split(" ")
  for (const expected of ["rounded-none", "border-0", "bg-transparent", "shadow-none"]) {
    assert.ok(classes.includes(expected), expected)
  }
  for (const removed of ["rounded-xl", "border", "bg-card", "shadow-sm"]) {
    assert.ok(!classes.includes(removed), removed)
  }
  assert.match(html, /test.completed/)
  assert.match(html, /aria-label="Copy JSON"/)
  assert.match(html, /aria-label="Search"/)
})

test("collapsed logs do not render the JSON viewer", () => {
  const html = render(StructuredLogViewer, { events: [event] })
  assert.match(html, /aria-expanded="false"/)
  assert.doesNotMatch(html, /data-slot="json-viewer"/)
})
