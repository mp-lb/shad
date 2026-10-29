import { test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ArrayEditor, ListEditor } from '../registry/array-editor/array-editor.tsx'

test('ListEditor renders supplied row content and inline forms', () => {
  const html = renderToStaticMarkup(React.createElement(ListEditor, {
    items: [{ id: 'a', label: 'Alpha' }],
    listLabel: 'Example',
    editingId: 'a',
    renderItem: () => React.createElement('span', null, 'Custom content'),
    renderEditor: () => React.createElement('form', null, 'Custom edit'),
    onEdit: () => {},
    onStartCreate: () => {},
    creating: true,
    renderCreate: () => React.createElement('form', null, 'Custom create'),
  }))
  assert.match(html, /Custom content/)
  assert.match(html, /Custom edit/)
  assert.match(html, /Custom create/)
  assert.match(html, /aria-expanded="true"/)
  assert.equal(ArrayEditor, ListEditor)
})

test('existing simple editor keeps its create input', () => {
  const html = renderToStaticMarkup(React.createElement(ArrayEditor, {
    items: ['Alpha'], onCreate: () => {},
  }))
  assert.match(html, /Alpha/)
  assert.match(html, /New item label/)
})
