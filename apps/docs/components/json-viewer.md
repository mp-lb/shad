# JSON Viewer

Collapsible JSON tree based on Jalco UI's JSON viewer.

```bash
pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/json-viewer.json
```

```tsx
import { JsonViewer } from "@/components/json-viewer"

export function Payload({ data }: { data: unknown }) {
  return <JsonViewer data={data} title="Payload" defaultExpanded={2} />
}
```
