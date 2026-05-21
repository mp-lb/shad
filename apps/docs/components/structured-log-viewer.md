# Structured Log Viewer

Expandable structured event log viewer with configurable headline fields.

```bash
pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/structured-log-viewer.json
```

```tsx
import { StructuredLogViewer } from "@/components/structured-log-viewer"

export function LogsPanel({ events }: { events: unknown[] }) {
  return (
    <StructuredLogViewer
      events={events}
      timestampPath="timestamp"
      levelPath="level"
      titlePath="eventType"
      messagePath="message"
      fields={[
        { label: "file", path: "details.filePath" },
        { label: "trace", path: "trace.traceId" },
        { label: "user", path: "userId" },
      ]}
    />
  )
}
```
