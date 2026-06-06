"use client"

import * as React from "react"
import { RefreshCw, Trash2 } from "lucide-react"

import {
  DebuggerPanel,
  type DebuggerColumn,
} from "../../../registry/debugger/debugger"

type ChunkRow = {
  capturedAt: string
  contentType: string
  sequence: number
  sizeBytes: number
  status: "pending" | "uploaded"
  streamId: string
  uploadedAt?: string
}

const rows: ChunkRow[] = [
  {
    capturedAt: "09:14:22",
    contentType: "audio/webm",
    sequence: 1,
    sizeBytes: 24832,
    status: "uploaded",
    streamId: "str_alpha",
    uploadedAt: "09:14:31",
  },
  {
    capturedAt: "09:14:25",
    contentType: "audio/webm",
    sequence: 2,
    sizeBytes: 21918,
    status: "uploaded",
    streamId: "str_alpha",
    uploadedAt: "09:14:34",
  },
  {
    capturedAt: "09:16:08",
    contentType: "audio/webm",
    sequence: 1,
    sizeBytes: 18642,
    status: "pending",
    streamId: "str_beta",
  },
]

const columns: DebuggerColumn<ChunkRow>[] = [
  {
    header: "Stream",
    render: (row) => row.streamId,
  },
  {
    header: "Seq",
    className: "w-14",
    render: (row) => row.sequence,
  },
  {
    header: "Status",
    render: (row) => row.status,
  },
  {
    header: "Size",
    render: (row) => row.sizeBytes,
  },
  {
    header: "Type",
    render: (row) => row.contentType,
  },
  {
    header: "Captured",
    render: (row) => row.capturedAt,
  },
  {
    header: "Uploaded",
    render: (row) => row.uploadedAt ?? "-",
  },
]

export function DebuggerDemo() {
  const [error, setError] = React.useState<React.ReactNode>(null)

  return (
    <DebuggerPanel
      title="IndexedDB chunks"
      rows={rows}
      columns={columns}
      getRowId={(row) => `${row.streamId}:${row.sequence}`}
      error={error}
      metrics={[
        { label: "Streams", value: 2 },
        { label: "Chunks", value: rows.length },
        { label: "Pending", value: 1 },
        { label: "Bytes", value: 65392 },
      ]}
      actions={[
        {
          icon: RefreshCw,
          label: "Refresh",
          onClick: () => setError(null),
        },
        {
          icon: Trash2,
          label: "Clear",
          tone: "danger",
          onClick: () => setError("Clear action is disabled in the demo."),
        },
      ]}
    />
  )
}
