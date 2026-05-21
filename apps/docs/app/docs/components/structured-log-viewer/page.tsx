import { PageHeader } from "@/components/page-header"
import { StructuredLogViewerDemo } from "@/components/structured-log-viewer-demo"

export default function StructuredLogViewerPage() {
  return (
    <article className="flex flex-col gap-6">
      <PageHeader
        title="Structured Log Viewer"
        description="Show compact event headlines, expand rows, and inspect the full raw JSON payload."
        install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/structured-log-viewer.json"
      />
      <StructuredLogViewerDemo />
    </article>
  )
}
