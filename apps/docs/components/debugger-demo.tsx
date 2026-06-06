"use client"

import * as React from "react"
import { RefreshCw, Trash2 } from "lucide-react"

import {
  DebuggerDock,
  DebuggerMetrics,
  DebuggerNotice,
  DebuggerTable,
  DebuggerViewport,
  type DebuggerColumn,
  type DebuggerDockSide,
  type DebuggerDockSize,
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
  { header: "Stream", render: (row) => row.streamId },
  { header: "Seq", className: "w-14", render: (row) => row.sequence },
  { header: "Status", render: (row) => row.status },
  { header: "Size", render: (row) => row.sizeBytes },
  { header: "Type", render: (row) => row.contentType },
  { header: "Captured", render: (row) => row.capturedAt },
  { header: "Uploaded", render: (row) => row.uploadedAt ?? "-" },
]

export function DebuggerDemo() {
  const [activeTab, setActiveTab] = React.useState("chunks")
  const [error, setError] = React.useState<React.ReactNode>(null)
  const [open, setOpen] = React.useState(true)
  const [side, setSide] = React.useState<DebuggerDockSide>("bottom")
  const [size, setSize] = React.useState<DebuggerDockSize>("compact")

  return (
    <DebuggerViewport
      className="h-[32rem] rounded-md border bg-background"
      debuggerOpen={open}
      side={side}
      debugger={
        <DebuggerDock
          title="Runtime debugger"
          activeTab={activeTab}
          onTabChange={setActiveTab}
          open={open}
          onOpenChange={setOpen}
          side={side}
          onSideChange={setSide}
          size={size}
          onSizeChange={setSize}
          tabs={[
            { id: "chunks", label: "Chunks", count: rows.length },
            { id: "events", label: "Events", count: 8 },
          ]}
          actions={[
            {
              id: "refresh",
              icon: RefreshCw,
              label: "Refresh",
              onClick: () => setError(null),
            },
            {
              id: "clear",
              icon: Trash2,
              label: "Clear",
              tone: "danger",
              onClick: () => setError("Clear action is disabled in the demo."),
            },
          ]}
        >
          <DebuggerMetrics
            metrics={[
              { label: "Streams", value: 2 },
              { label: "Chunks", value: rows.length },
              { label: "Pending", value: 1 },
              { label: "Bytes", value: 65392 },
            ]}
          />
          {error ? <DebuggerNotice>{error}</DebuggerNotice> : null}
          <DebuggerTable
            rows={rows}
            columns={columns}
            getRowId={(row) => `${row.streamId}:${row.sequence}`}
          />
        </DebuggerDock>
      }
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="border-b px-3 py-2 font-mono text-[10px] text-muted-foreground">
          Fake app viewport
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3 text-sm leading-6 text-muted-foreground">
          {Array.from({ length: 18 }, (_, index) => (
            <p key={index}>
              Content row {index + 1}. The debugger is part of layout, so this
              scroll area gets smaller instead of being covered.
            </p>
          ))}
        </div>
      </div>
    </DebuggerViewport>
  )
}
