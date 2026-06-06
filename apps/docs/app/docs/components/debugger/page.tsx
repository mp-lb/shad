import { DocsPage } from "fumadocs-ui/layouts/docs/page"

import { DebuggerDemo } from "@/components/debugger-demo"
import { PageHeader } from "@/components/page-header"

export default function DebuggerPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Debugger"
          description="A compact runtime data panel for local browser storage, queues, transports, and other development-only state."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/debugger.json"
        />
        <DebuggerDemo />
      </div>
    </DocsPage>
  )
}
