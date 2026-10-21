import assert from "node:assert/strict"
import test from "node:test"
import { interleaveDateHeadings } from "../registry/chat-container/interleave-date-headings.ts"

test("date headings preserve chronological messages and their full objects", () => {
  const messages = [
    { id: "first", createdAt: new Date(2026, 9, 20, 9), body: "One" },
    { id: "second", createdAt: new Date(2026, 9, 20, 10), body: "Two" },
    { id: "third", createdAt: new Date(2026, 9, 21, 9), body: "Three" },
  ]

  const timeline = interleaveDateHeadings(messages, "en-US")
  assert.deepEqual(timeline.map((item) => item.type), [
    "date-heading", "message", "message", "date-heading", "message",
  ])
  assert.equal(timeline[0].label, "October 20, 2026")
  assert.equal(timeline[3].label, "October 21, 2026")
  assert.strictEqual(timeline[4].message, messages[2])
})
