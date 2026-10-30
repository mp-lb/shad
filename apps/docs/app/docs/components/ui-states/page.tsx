import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import { PageHeader } from "@/components/page-header";
import { UiStatesDemo } from "@/components/ui-states-demo";

export default function UiStatesPage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="UI States"
          description="Reusable loading, empty, error, retry, and success states with a MAP Lab loader."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/ui-states.json"
        />
        <p className="text-sm text-muted-foreground">
          Use <code>FullScreenLoading</code> while the application or session is
          starting. It centers the standard dot-matrix spinner on the app
          background; its label is announced to screen readers only.
        </p>
        <UiStatesDemo />
      </div>
    </DocsPage>
  );
}
