import { JsonViewerDemo } from "@/components/json-viewer-demo"
import { PageHeader } from "@/components/page-header"

export default function JsonViewerPage() {
  return (
    <article className="flex flex-col gap-6">
      <PageHeader
        title="JSON Viewer"
        description="Browse structured payloads with collapsible nodes, search, and path copying."
        install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/json-viewer.json"
      />
      <JsonViewerDemo />
    </article>
  )
}
