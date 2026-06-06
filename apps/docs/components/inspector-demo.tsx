"use client"

import * as React from "react"

import {
  DockedDebugger,
  FloatingInspector,
  InspectorList,
  InspectorMetricGrid,
  InspectorSection,
  InspectorTabs,
} from "../../../registry/inspector/inspector"

const tabs = [
  { id: "state", label: "state", count: 4 },
  { id: "events", label: "events", count: 12 },
  { id: "network", label: "network", count: 3 },
]

const listItems = [
  {
    id: "route",
    label: "route.changed",
    meta: "/stores/felixsebastian/fssstack",
    tone: "info" as const,
    value: "31ms",
  },
  {
    id: "sync",
    label: "sync.clean",
    meta: "manifest matched remote bytes",
    tone: "success" as const,
    value: "ok",
  },
  {
    id: "cache",
    label: "cache.stale",
    meta: "revalidated ambient query",
    tone: "warning" as const,
    value: "1.8s",
  },
]

function InspectorContent() {
  const [activeTab, setActiveTab] = React.useState("state")

  return (
    <div className="grid gap-2">
      <InspectorTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
      <InspectorMetricGrid
        metrics={[
          { label: "stores", value: 9 },
          { label: "files", value: 128 },
          { label: "dirty", value: 0 },
          { label: "latency", value: "44ms" },
        ]}
      />
      <InspectorSection title={activeTab}>
        <InspectorList items={listItems} />
      </InspectorSection>
    </div>
  )
}

export function InspectorDemo() {
  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-md border bg-muted/20">
      <div className="grid gap-2 p-4 font-mono text-xs text-muted-foreground">
        <div className="text-foreground">Demo canvas</div>
        <div>Floating inspector state persists in localStorage.</div>
        <div>The docked debugger uses the same compact controls and content.</div>
      </div>
      <FloatingInspector
        title="Doctrine inspector"
        storageKey="mp-lb-docs-floating-inspector"
      >
        <InspectorContent />
      </FloatingInspector>
      <DockedDebugger
        title="Debugger"
        storageKey="mp-lb-docs-docked-debugger"
      >
        <InspectorContent />
      </DockedDebugger>
    </div>
  )
}
