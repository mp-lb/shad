import { DocsPage } from "fumadocs-ui/layouts/docs/page"

import { InspectorDemo } from "@/components/inspector-demo"
import { PageHeader } from "@/components/page-header"

export default function InspectorPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Inspector"
          description="Floating inspectors, docked debuggers, and compact tabs/lists for localhost development tools."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/inspector.json"
        />
        <InspectorDemo />
      </div>
    </DocsPage>
  )
}
