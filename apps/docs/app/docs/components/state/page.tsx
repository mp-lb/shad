import { DocsPage } from "fumadocs-ui/layouts/docs/page";

import { PageHeader } from "@/components/page-header";
import { StateDemo } from "@/components/state-demo";

export default function StatePage() {
  return (
    <DocsPage footer={{ enabled: false }} tableOfContent={{ enabled: false }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="State"
          description="Reusable loading, empty, error, retry, and success states with a MAP Lab loader."
          install="pnpm dlx shadcn@latest add https://shad.mp-lb.dev/r/state.json"
        />
        <StateDemo />
      </div>
    </DocsPage>
  );
}
