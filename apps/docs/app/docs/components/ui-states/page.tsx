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
        <UiStatesDemo />
      </div>
    </DocsPage>
  );
}
